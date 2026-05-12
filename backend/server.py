from fastapi import FastAPI, APIRouter, HTTPException, Header, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import csv
import io
import re
import time
import html
import asyncio
import httpx
import resend
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend (email)
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
CONTACT_RECIPIENT_EMAIL = os.environ.get(
    "CONTACT_RECIPIENT_EMAIL", "info@energeide.it"
)

# Google Sheets - Progetti
PROJECTS_SHEET_ID = os.environ.get(
    "PROJECTS_SHEET_ID", "16haAvbNJpofu6Wc_48v2xKFMSbPFSTjXvs2emIxUe0A"
)
PROJECTS_SHEET_GID = os.environ.get("PROJECTS_SHEET_GID", "0")
PROJECTS_CACHE_TTL = 300  # seconds (5 min)
_projects_cache = {"data": None, "ts": 0.0}

# Upload directory (persistente) per immagini caricate dal pannello admin
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# -------------------------------------------------------------------
# PROJECTS - sincronizzati con Google Sheet pubblico
# -------------------------------------------------------------------
_DRIVE_PATTERNS = [
    # https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    re.compile(r"drive\.google\.com/file/d/([A-Za-z0-9_-]{20,})"),
    # https://drive.google.com/open?id=FILE_ID
    re.compile(r"drive\.google\.com/open\?id=([A-Za-z0-9_-]{20,})"),
    # https://drive.google.com/uc?...id=FILE_ID  e https://drive.google.com/thumbnail?id=FILE_ID
    re.compile(r"drive\.google\.com/(?:uc|thumbnail)[^\"'\s]*[?&]id=([A-Za-z0-9_-]{20,})"),
]


def _normalize_image_url(url: str) -> str:
    """Converte i link di condivisione di Google Drive in URL incorporabili.

    Drive non serve direttamente i file `view`. L'endpoint
    `drive.google.com/thumbnail?id=...&sz=w1600` invece restituisce sempre un
    JPEG/PNG senza la pagina di avviso, quindi e' perfetto per essere usato
    come `src` di un tag <img>.
    Per gli altri URL (Unsplash, Imgur, ecc.) ritorna il valore originale.
    """
    if not url:
        return ""
    u = url.strip()
    for pattern in _DRIVE_PATTERNS:
        m = pattern.search(u)
        if m:
            file_id = m.group(1)
            return f"https://drive.google.com/thumbnail?id={file_id}&sz=w1600"
    return u


def _parse_projects_csv(csv_text: str) -> List[dict]:
    """Parse the Google Sheet CSV export and normalise the rows."""
    reader = csv.DictReader(io.StringIO(csv_text))
    projects: List[dict] = []
    for raw in reader:
        # Normalise keys (strip whitespace, ignore None keys)
        row = {
            (k or "").strip(): (v or "").strip()
            for k, v in raw.items()
            if k is not None
        }
        title = row.get("Titolo") or row.get("Titolo ") or ""
        if not title:
            # Skip empty rows (e.g. trailing blank lines)
            continue

        location = row.get("Posizione", "")
        region = row.get("Regione", "")
        location_full = (
            f"{location}, {region}" if location and region else (location or region)
        )

        # "Potenza" puo' contenere "6 kW + 10 kWh" oppure solo "6 kW".
        potenza = row.get("Potenza", "")
        power, storage = potenza, ""
        if "+" in potenza:
            parts = [p.strip() for p in potenza.split("+", 1)]
            power = parts[0]
            storage = parts[1] if len(parts) > 1 else ""

        projects.append({
            "id": row.get("ID") or str(uuid.uuid4()),
            "title": title,
            "location": location_full,
            "region": region,
            "power": power,
            "storage": storage,
            "year": row.get("Data", ""),
            "type": row.get("Tipo", "Residenziale") or "Residenziale",
            "image": _normalize_image_url(row.get("URL Immagine", "")),
            "description": row.get("Descrizione", ""),
        })
    return projects


@api_router.get("/projects")
async def get_projects(refresh: bool = False):
    """Restituisce la lista dei progetti leggendo il Google Sheet pubblico.

    Cache in-memory di 5 minuti. Passa ?refresh=1 per forzare il reload.
    """
    now = time.time()
    if (
        not refresh
        and _projects_cache["data"] is not None
        and now - _projects_cache["ts"] < PROJECTS_CACHE_TTL
    ):
        return {
            "count": len(_projects_cache["data"]),
            "cached": True,
            "data": _projects_cache["data"],
        }

    url = (
        f"https://docs.google.com/spreadsheets/d/{PROJECTS_SHEET_ID}"
        f"/export?format=csv&gid={PROJECTS_SHEET_GID}"
    )
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as http:
            r = await http.get(url)
            r.raise_for_status()
            csv_text = r.text
    except httpx.HTTPError as exc:
        logger.error("Errore nel fetch del Google Sheet progetti: %s", exc)
        # Se ho una cache, restituisco quella anche se scaduta
        if _projects_cache["data"] is not None:
            return {
                "count": len(_projects_cache["data"]),
                "cached": True,
                "stale": True,
                "data": _projects_cache["data"],
            }
        raise HTTPException(
            status_code=502,
            detail="Impossibile leggere il Google Sheet dei progetti.",
        ) from exc

    try:
        projects = _parse_projects_csv(csv_text)
    except Exception as exc:  # pragma: no cover
        logger.exception("Errore nel parsing del CSV progetti")
        raise HTTPException(
            status_code=500,
            detail=f"Errore parsing CSV: {exc}",
        ) from exc

    _projects_cache["data"] = projects
    _projects_cache["ts"] = now
    return {"count": len(projects), "cached": False, "data": projects}


# -------------------------------------------------------------------
# GEOCODING - lat/lng per i progetti (Nominatim + cache MongoDB)
# -------------------------------------------------------------------
_geocode_lock = asyncio.Lock()
_geocode_last_call = {"ts": 0.0}


async def _nominatim_geocode(query: str) -> dict | None:
    """Geocodifica una stringa tramite Nominatim (OSM). Rispetta il rate limit
    pubblico di 1 richiesta/sec e include lo User-Agent richiesto."""
    async with _geocode_lock:
        # Throttle: almeno 1.1 secondi tra le chiamate
        elapsed = time.time() - _geocode_last_call["ts"]
        if elapsed < 1.1:
            await asyncio.sleep(1.1 - elapsed)
        try:
            async with httpx.AsyncClient(timeout=10.0) as http:
                r = await http.get(
                    "https://nominatim.openstreetmap.org/search",
                    params={
                        "q": query,
                        "format": "json",
                        "limit": 1,
                        "countrycodes": "it",
                    },
                    headers={
                        "User-Agent": "Energeide-Website/1.0 (info@energeide.it)",
                        "Accept-Language": "it",
                    },
                )
                _geocode_last_call["ts"] = time.time()
                if r.status_code != 200:
                    return None
                data = r.json()
                if not data:
                    return None
                return {
                    "lat": float(data[0]["lat"]),
                    "lng": float(data[0]["lon"]),
                }
        except (httpx.HTTPError, ValueError, KeyError) as exc:
            logger.warning("Geocoding fallito per '%s': %s", query, exc)
            return None


async def _resolve_coords(location: str, region: str) -> dict | None:
    """Restituisce {lat, lng} per una location, usando la cache su Mongo.
    Prova prima 'location, Italia', poi solo la regione come fallback."""
    if not location and not region:
        return None

    # Chiave cache normalizzata
    cache_key = (location or region).strip().lower()
    cached = await db.geocode_cache.find_one({"_id": cache_key}, {"_id": 0})
    if cached and "lat" in cached and "lng" in cached:
        return {"lat": cached["lat"], "lng": cached["lng"]}

    # Prova geocodifica con location completa
    candidates = []
    if location:
        candidates.append(f"{location}, Italia")
    if region and region.strip() and (not location or region.lower() not in location.lower()):
        candidates.append(f"{region}, Italia")

    for q in candidates:
        result = await _nominatim_geocode(q)
        if result:
            try:
                await db.geocode_cache.update_one(
                    {"_id": cache_key},
                    {"$set": {**result, "query": q, "cached_at": datetime.now(timezone.utc).isoformat()}},
                    upsert=True,
                )
            except Exception:  # pragma: no cover
                pass
            return result

    # Fallback negativo: salva null per non riprovare ogni volta
    try:
        await db.geocode_cache.update_one(
            {"_id": cache_key},
            {"$set": {"lat": None, "lng": None, "query": location or region,
                      "cached_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
    except Exception:  # pragma: no cover
        pass
    return None


@api_router.get("/projects/locations")
async def get_project_locations():
    """Ritorna soltanto le coordinate dei progetti, per la mappa.

    Geocodifica usando Nominatim con cache persistente su Mongo. Ritorna
    una lista di {title, location, region, lat, lng, power, type, year}
    per ogni progetto che ha coordinate valide.
    """
    # Riusa la cache progetti se disponibile, altrimenti la popola
    if _projects_cache["data"] is None:
        await get_projects()

    projects = _projects_cache["data"] or []
    locations = []
    for p in projects:
        coords = await _resolve_coords(p.get("location", ""), p.get("region", ""))
        if not coords or coords.get("lat") is None:
            continue
        locations.append({
            "id": p.get("id"),
            "title": p.get("title"),
            "location": p.get("location"),
            "region": p.get("region"),
            "power": p.get("power"),
            "type": p.get("type"),
            "year": p.get("year"),
            "lat": coords["lat"],
            "lng": coords["lng"],
        })

    return {"count": len(locations), "data": locations}


# -------------------------------------------------------------------
# BLOG POSTS - CRUD con autenticazione semplice tramite admin token
# -------------------------------------------------------------------
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")


def _require_admin(x_admin_token: str | None) -> None:
    """Verifica il token admin per le operazioni di scrittura sui post."""
    if not ADMIN_TOKEN or not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Non autorizzato")


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    image_url: str = ""
    facebook_url: str = ""
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlogPostCreate(BaseModel):
    title: str
    content: str
    image_url: str = ""
    facebook_url: str = ""
    published_at: str | None = None  # ISO 8601 opzionale


class AdminLogin(BaseModel):
    token: str


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    """Verifica le credenziali admin. Ritorna 200 se il token è corretto."""
    if not ADMIN_TOKEN or payload.token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Token non valido")
    return {"ok": True}


@api_router.get("/posts", response_model=List[BlogPost])
async def list_posts(limit: int = 50):
    """Ritorna i post del blog ordinati dal più recente al più vecchio."""
    cursor = db.blog_posts.find({}, {"_id": 0}).sort("published_at", -1).limit(limit)
    posts = await cursor.to_list(length=limit)
    for p in posts:
        if isinstance(p.get("published_at"), str):
            try:
                p["published_at"] = datetime.fromisoformat(p["published_at"])
            except ValueError:
                p["published_at"] = datetime.now(timezone.utc)
        # Normalizza i link di Google Drive in URL renderizzabili
        if p.get("image_url"):
            p["image_url"] = _normalize_image_url(p["image_url"])
    return posts


@api_router.post("/posts", response_model=BlogPost)
async def create_post(
    payload: BlogPostCreate,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)

    published_at = datetime.now(timezone.utc)
    if payload.published_at:
        try:
            published_at = datetime.fromisoformat(payload.published_at)
        except ValueError:
            pass

    post = BlogPost(
        title=payload.title.strip(),
        content=payload.content.strip(),
        image_url=payload.image_url.strip(),
        facebook_url=payload.facebook_url.strip(),
        published_at=published_at,
    )
    doc = post.model_dump()
    doc["published_at"] = doc["published_at"].isoformat()
    await db.blog_posts.insert_one(doc)
    return post


@api_router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post non trovato")
    return {"ok": True}


# -------------------------------------------------------------------
# CONTATTI - invio email tramite Resend
# -------------------------------------------------------------------
class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=3, max_length=40)
    plan: str = Field(default="", max_length=120)
    message: str = Field(default="", max_length=4000)


def _build_contact_email_html(payload: ContactRequest) -> str:
    """Costruisce il body HTML inline-styled (no esterni) per il lead."""
    safe_msg = html.escape(payload.message or "—").replace("\n", "<br>")
    rows = [
        ("Nome", html.escape(payload.name)),
        ("Email", html.escape(payload.email)),
        ("Telefono", html.escape(payload.phone)),
        ("Soluzione di interesse", html.escape(payload.plan or "—")),
    ]
    rows_html = "".join(
        f"""
        <tr>
          <td style="padding:10px 14px;background:#F8FAFC;border:1px solid #E5E7EB;font-family:Arial,sans-serif;font-size:13px;color:#475569;width:200px;font-weight:600;">{label}</td>
          <td style="padding:10px 14px;border:1px solid #E5E7EB;font-family:Arial,sans-serif;font-size:14px;color:#0A1F44;">{value}</td>
        </tr>
        """
        for label, value in rows
    )

    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:#0A1F44;padding:24px;font-family:Arial,sans-serif;color:#ffffff;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;color:#F4C542;font-weight:700;">ENERGEIDE — NUOVO LEAD</p>
              <h1 style="margin:6px 0 0;font-size:22px;line-height:1.2;">Nuova richiesta di preventivo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                {rows_html}
              </table>
              <p style="margin:20px 0 8px;font-family:Arial,sans-serif;font-size:13px;color:#475569;font-weight:600;">Messaggio</p>
              <div style="padding:14px;background:#F8FAFC;border:1px solid #E5E7EB;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;color:#0A1F44;line-height:1.5;">{safe_msg}</div>
            </td>
          </tr>
          <tr>
            <td style="background:#F8FAFC;padding:16px 24px;font-family:Arial,sans-serif;font-size:11px;color:#94A3B8;border-top:1px solid #E5E7EB;">
              Inviato automaticamente dal form di energeide.it
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.post("/contact")
async def submit_contact(payload: ContactRequest):
    """Invia il lead via Resend a info@energeide.it e salva una copia su Mongo."""
    if not resend.api_key:
        raise HTTPException(
            status_code=503,
            detail="Servizio email non configurato.",
        )

    subject = f"Nuova richiesta preventivo — {payload.name}"
    html_body = _build_contact_email_html(payload)

    params = {
        "from": f"Energeide Web <{SENDER_EMAIL}>",
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": payload.email,
        "subject": subject,
        "html": html_body,
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
    except Exception as exc:  # pragma: no cover - dipende da rete
        logger.exception("Errore Resend: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Impossibile inviare l'email. Riprova tra qualche minuto.",
        ) from exc

    # Persistenza opzionale del lead (non bloccante: se fallisce, l'email è già partita)
    try:
        lead_doc = payload.model_dump()
        lead_doc["id"] = str(uuid.uuid4())
        lead_doc["created_at"] = datetime.now(timezone.utc).isoformat()
        lead_doc["email_id"] = result.get("id") if isinstance(result, dict) else None
        await db.contact_leads.insert_one(lead_doc)
    except Exception as exc:  # pragma: no cover
        logger.warning("Impossibile salvare il lead su Mongo: %s", exc)

    return {
        "ok": True,
        "email_id": result.get("id") if isinstance(result, dict) else None,
    }


@api_router.post("/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    """Carica un'immagine sul server. Solo admin. Ritorna l'URL pubblico."""
    _require_admin(x_admin_token)

    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Formato non supportato. Usa JPG, PNG, WEBP o GIF.",
        )

    # Leggi il file con limite di sicurezza
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File troppo grande. Max {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
        )
    if not data:
        raise HTTPException(status_code=400, detail="File vuoto.")

    ext = ALLOWED_IMAGE_TYPES[content_type]
    fname = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOADS_DIR / fname
    try:
        dest.write_bytes(data)
    except OSError as exc:  # pragma: no cover
        logger.exception("Errore salvataggio upload")
        raise HTTPException(status_code=500, detail="Errore salvataggio file.") from exc

    public_url = f"/api/uploads/{fname}"
    return {"ok": True, "url": public_url, "filename": fname, "size": len(data)}


# Include the router in the main app
app.include_router(api_router)

# Mount static uploads sotto /api/uploads/<filename> in modo che passi
# per l'ingress (che instrada solo /api/* al backend).
app.mount(
    "/api/uploads",
    StaticFiles(directory=str(UPLOADS_DIR)),
    name="uploads",
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()