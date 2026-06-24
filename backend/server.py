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
import cloudinary
import cloudinary.uploader
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

# Cloudinary (persistent image storage)
CLOUDINARY_CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET", "")
if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
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
    """Parse the Google Sheet CSV export and normalise the rows.

    Ordina i progetti dal più recente al più vecchio in base al campo 'Data'
    (formato 'Mese AAAA' in italiano, es. 'Maggio 2026').
    """
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

        # URL immagini: una cella può contenere più URL separati da virgola
        # o da a-capo. Normalizziamo i link Drive e teniamo l'ordine originale.
        raw_images = row.get("URL Immagine", "") or ""
        image_urls: List[str] = []
        for chunk in re.split(r"[,\n]", raw_images):
            cleaned = chunk.strip()
            if cleaned:
                image_urls.append(_normalize_image_url(cleaned))

        projects.append({
            "id": row.get("ID") or str(uuid.uuid4()),
            "title": title,
            "location": location_full,
            "region": region,
            "power": power,
            "storage": storage,
            "year": row.get("Data", ""),
            "type": row.get("Tipo", "Residenziale") or "Residenziale",
            "image": image_urls[0] if image_urls else "",  # backward compat
            "images": image_urls,
            "description": row.get("Descrizione", ""),
        })
    # Ordina i progetti del Sheet dal più recente al più vecchio
    projects.sort(key=lambda p: _project_sort_key(p.get("year", "")), reverse=True)
    return projects


_ITALIAN_MONTHS = {
    "gennaio": 1, "febbraio": 2, "marzo": 3, "aprile": 4, "maggio": 5,
    "giugno": 6, "luglio": 7, "agosto": 8, "settembre": 9, "ottobre": 10,
    "novembre": 11, "dicembre": 12,
}


def _project_sort_key(value: str) -> tuple:
    """Estrae (anno, mese) dal campo Data del Sheet. Esempi:
    'Maggio 2026' -> (2026, 5)
    '2025' -> (2025, 0)
    '' -> (0, 0)  (in fondo)
    """
    if not value:
        return (0, 0)
    text = value.strip().lower()
    # Trova l'anno (primo numero a 4 cifre)
    year_match = re.search(r"\b(20\d{2}|19\d{2})\b", text)
    year = int(year_match.group(1)) if year_match else 0
    # Trova il mese (nome italiano)
    month = 0
    for name, num in _ITALIAN_MONTHS.items():
        if name in text:
            month = num
            break
    return (year, month)


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

    # Merge con i progetti creati dal pannello admin (in MongoDB)
    db_projects = await _fetch_db_projects()
    # I progetti dell'admin compaiono per primi (più recenti)
    merged = db_projects + projects

    _projects_cache["data"] = merged
    _projects_cache["ts"] = now
    return {"count": len(merged), "cached": False, "data": merged}


# -------------------------------------------------------------------
# PROGETTI - CRUD su MongoDB (admin)
# -------------------------------------------------------------------
PROJECT_TYPES = ["Residenziale", "Commerciale", "Industriale"]


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    location: str = Field(default="", max_length=200)
    region: str = Field(default="", max_length=100)
    type: str = Field(default="Residenziale", max_length=50)
    power: str = Field(default="", max_length=50)
    storage: str = Field(default="", max_length=50)
    year: str = Field(default="", max_length=20)
    description: str = Field(default="", max_length=2000)
    images: List[str] = Field(default_factory=list)


async def _fetch_db_projects() -> list:
    """Restituisce i progetti aggiunti dal pannello admin, ordinati dal più recente."""
    cursor = (
        db.projects.find({}, {"_id": 0}).sort("created_at", -1)
    )
    docs = await cursor.to_list(length=200)
    out = []
    for d in docs:
        # Normalizza immagini (Drive ecc.)
        imgs = [_normalize_image_url(u) for u in (d.get("images") or []) if u]
        out.append({
            "id": d.get("id"),
            "title": d.get("title", ""),
            "location": d.get("location", ""),
            "region": d.get("region", ""),
            "power": d.get("power", ""),
            "storage": d.get("storage", ""),
            "year": d.get("year", ""),
            "type": d.get("type", "Residenziale"),
            "description": d.get("description", ""),
            "image": imgs[0] if imgs else "",
            "images": imgs,
            "_source": "db",
        })
    return out


def _invalidate_projects_cache():
    _projects_cache["data"] = None
    _projects_cache["ts"] = 0.0


@api_router.post("/admin/projects")
async def create_db_project(
    payload: ProjectCreate,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)
    project_id = str(uuid.uuid4())
    doc = payload.model_dump()
    doc["id"] = project_id
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.insert_one(doc)
    _invalidate_projects_cache()
    return {"ok": True, "id": project_id}


@api_router.put("/admin/projects/{project_id}")
async def update_db_project(
    project_id: str,
    payload: ProjectCreate,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)
    existing = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    update_doc = payload.model_dump()
    update_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.update_one({"id": project_id}, {"$set": update_doc})
    _invalidate_projects_cache()
    return {"ok": True}


@api_router.delete("/admin/projects/{project_id}")
async def delete_db_project(
    project_id: str,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Progetto non trovato")
    _invalidate_projects_cache()
    return {"ok": True}


@api_router.get("/admin/projects")
async def list_db_projects(
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    """Lista solo i progetti gestiti dall'admin (in MongoDB)."""
    _require_admin(x_admin_token)
    return {"data": await _fetch_db_projects()}


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
    images: List[str] = Field(default_factory=list)
    image_url: str = ""  # backward compat (primo elemento di images)
    facebook_url: str = ""
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlogPostCreate(BaseModel):
    title: str
    content: str
    images: List[str] = Field(default_factory=list)
    image_url: str = ""  # accettato per compat; se images è vuoto, viene usato come singolo elemento
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

        # Compatibilità: i post vecchi avevano solo image_url, i nuovi hanno images.
        images = p.get("images") or []
        if not images and p.get("image_url"):
            images = [p["image_url"]]
        # Normalizza i link di Google Drive
        images = [_normalize_image_url(u) for u in images if u]
        p["images"] = images
        p["image_url"] = images[0] if images else ""
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

    # Unifica images + image_url legacy
    images = [u.strip() for u in (payload.images or []) if u and u.strip()]
    if not images and payload.image_url and payload.image_url.strip():
        images = [payload.image_url.strip()]

    post = BlogPost(
        title=payload.title.strip(),
        content=payload.content.strip(),
        images=images,
        image_url=images[0] if images else "",
        facebook_url=payload.facebook_url.strip(),
        published_at=published_at,
    )
    doc = post.model_dump()
    doc["published_at"] = doc["published_at"].isoformat()
    await db.blog_posts.insert_one(doc)
    return post


@api_router.put("/posts/{post_id}", response_model=BlogPost)
async def update_post(
    post_id: str,
    payload: BlogPostCreate,
    x_admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    _require_admin(x_admin_token)

    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Post non trovato")

    # published_at: mantieni quello esistente a meno che non sia stato esplicitamente cambiato
    published_at = None
    if payload.published_at:
        try:
            published_at = datetime.fromisoformat(payload.published_at)
        except ValueError:
            published_at = None
    if published_at is None:
        existing_pa = existing.get("published_at")
        if isinstance(existing_pa, str):
            try:
                published_at = datetime.fromisoformat(existing_pa)
            except ValueError:
                published_at = datetime.now(timezone.utc)
        else:
            published_at = datetime.now(timezone.utc)

    images = [u.strip() for u in (payload.images or []) if u and u.strip()]
    if not images and payload.image_url and payload.image_url.strip():
        images = [payload.image_url.strip()]

    update_doc = {
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "images": images,
        "image_url": images[0] if images else "",
        "facebook_url": payload.facebook_url.strip(),
        "published_at": published_at.isoformat(),
    }
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_doc})

    return BlogPost(
        id=post_id,
        title=update_doc["title"],
        content=update_doc["content"],
        images=update_doc["images"],
        image_url=update_doc["image_url"],
        facebook_url=update_doc["facebook_url"],
        published_at=published_at,
    )


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
    """Carica un'immagine su Cloudinary. Solo admin. Ritorna l'URL pubblico.

    Se Cloudinary non e' configurato, fallback su disco locale (legacy).
    """
    _require_admin(x_admin_token)

    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Formato non supportato. Usa JPG, PNG, WEBP o GIF.",
        )

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File troppo grande. Max {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.",
        )
    if not data:
        raise HTTPException(status_code=400, detail="File vuoto.")

    # 1. Cloudinary (preferito): upload persistente + CDN + ottimizzazione
    if CLOUDINARY_CLOUD_NAME:
        try:
            result = await asyncio.to_thread(
                cloudinary.uploader.upload,
                data,
                folder="energeide/uploads",
                resource_type="image",
                # Genera automaticamente WebP/AVIF quando supportato
                eager=[{"quality": "auto", "fetch_format": "auto"}],
                use_filename=False,
                unique_filename=True,
                overwrite=False,
            )
            return {
                "ok": True,
                "url": result["secure_url"],
                "filename": result.get("public_id", ""),
                "size": result.get("bytes", len(data)),
            }
        except Exception as exc:  # pragma: no cover
            logger.exception("Errore Cloudinary, fallback su disco locale: %s", exc)
            # Non blocca: continua con il salvataggio locale come fallback

    # 2. Fallback: disco locale (NON persistente tra deploy!)
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