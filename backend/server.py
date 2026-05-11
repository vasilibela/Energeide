from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import csv
import io
import time
import httpx
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Google Sheets - Progetti
PROJECTS_SHEET_ID = os.environ.get(
    "PROJECTS_SHEET_ID", "16haAvbNJpofu6Wc_48v2xKFMSbPFSTjXvs2emIxUe0A"
)
PROJECTS_SHEET_GID = os.environ.get("PROJECTS_SHEET_GID", "0")
PROJECTS_CACHE_TTL = 300  # seconds (5 min)
_projects_cache = {"data": None, "ts": 0.0}

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
            "image": row.get("URL Immagine", ""),
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


# Include the router in the main app
app.include_router(api_router)

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