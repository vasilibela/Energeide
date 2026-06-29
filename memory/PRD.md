# Energeide — Sito Vetrina + Blog

## Problema/Obiettivo
Sito vetrina italiano per Energeide S.r.l. (consulenti fotovoltaico, pompe di calore, sistemi di accumulo). Replica fedele dei contenuti del sito live `https://energeide.it/` con architettura React + FastAPI + MongoDB.

## Stack
- Frontend: React (CRA) + TailwindCSS + Shadcn/UI + Lucide-react, dati statici in `/app/frontend/src/data/mock.js`
- Backend: FastAPI + Motor (MongoDB async), prefix `/api`
- DB: MongoDB locale (collezioni: `status_checks`, `blog_posts`)
- Sorgente progetti: Google Sheet pubblico (cache 5 min in memoria) → `GET /api/projects`

## Pagine
- `/` Home (Hero, Stats, Piani Essential/Premium/Elite, Suggerimento 9 kW, Why Us, Testimonials, CTA)
- `/chi-siamo`, `/servizi`, `/progetti` (da Google Sheet), `/faq`, `/contatti`
- `/news` Blog (post dal backend, empty-state se vuoto). Le card mostrano un'anteprima troncata; al click si apre la pagina dedicata `/news/:id`.
- `/news/:id` Pagina di dettaglio post (contenuto completo, galleria foto a tutta larghezza, link Facebook se presente).
- `/admin` Area Riservata (login con token → form pubblicazione + lista post + elimina)
- `/privacy-policy`, `/termini-e-condizioni`

## API Backend
- `GET  /api/projects` → lista progetti da Google Sheet (cached)
- `GET  /api/projects/locations` → coordinate progetti per la mappa (geocoding Nominatim cached su Mongo `geocode_cache`)
- `GET  /api/posts` → lista post blog (pubblica, drive URLs normalizzati)
- `GET  /api/posts/{id}` → singolo post (per la pagina dettaglio `/news/:id`)
- `POST /api/posts` → crea post (header `X-Admin-Token`)
- `DELETE /api/posts/{id}` → elimina (header `X-Admin-Token`)
- `POST /api/admin/login` → verifica token
- `POST /api/contact` → invia lead via Resend a `CONTACT_RECIPIENT_EMAIL` e salva su Mongo (`contact_leads`)

## Configurazione (.env backend)
- `MONGO_URL`, `DB_NAME` (protetti)
- `PROJECTS_SHEET_ID`, `PROJECTS_SHEET_GID`
- `ADMIN_TOKEN` → vedere `/app/memory/test_credentials.md`
- `RESEND_API_KEY`, `SENDER_EMAIL` (default `onboarding@resend.dev`), `CONTACT_RECIPIENT_EMAIL` (default `info@energeide.it`)

## Changelog
- **Feb 2026 — Sessione corrente (parte 3)**
  - **Mappa Italia interattiva** su `/progetti`: componente `ProjectsMap.jsx` con react-leaflet + tile OpenStreetMap. Pin custom in colori brand (giallo F4C542 con bordo blu 0A1F44), popup con titolo/location/potenza/anno
  - Backend `GET /api/projects/locations` con geocoding via Nominatim (rate-limited 1.1s, User-Agent corretto) e cache persistente su Mongo (collezione `geocode_cache`)
  - Aggiunte dipendenze frontend: `react-leaflet@5`, `leaflet@1.9`

- **Feb 2026 — Sessione corrente (parte 2 bis: upload immagini)**
  - Backend `POST /api/admin/upload` (multipart, X-Admin-Token) → salva su `/app/backend/uploads/` con nome UUID, ritorna URL relativo
  - Static mount `/api/uploads/*` per servire i file (passa per ingress)
  - Validazione MIME (JPG/PNG/WEBP/GIF) + limite 8 MB
  - Frontend Admin: dropzone con drag-and-drop, file picker, preview, remove button
  - Frontend News + Admin: helper `resolveImageUrl` per gestire path relativi/assoluti
  - Bonus: `_normalize_image_url` applicato anche ai post (Google Drive `/file/d/.../view` → `thumbnail`)

- **Feb 2026 — Sessione corrente (parte 2)**
  - Form contatti collegato a **Resend.com**: nuovo endpoint `POST /api/contact` invia email HTML al destinatario con i dati del lead + reply-to del visitatore; salva copia su Mongo collection `contact_leads`
  - `/app/frontend/src/pages/Contatti.jsx` riscritto: chiamata fetch reale al backend, stati loading/success/error con `data-testid` per testing, validazione email lato server (Pydantic `EmailStr`)
  - Aggiunte env: `RESEND_API_KEY`, `SENDER_EMAIL`, `CONTACT_RECIPIENT_EMAIL`
  - Aggiunta dipendenza `resend>=2.0.0` in `requirements.txt`

- **Feb 2026 — Sessione corrente (parte 1)**
  - Logo header reso PNG trasparente (sfondo bianco rimosso via PIL, edges anti-aliased)
  - Header altezza portata a `h-[88px]` e Logo ridimensionato a `h-10 sm:h-12 md:h-14` → niente più overlap sulla hero
  - Rimosso indirizzo `Corso Vittorio Emanuele, 21 – Quadrelle (AV)` da `mock.js`
  - Rimosso completamente `FacebookFeed` (componente eliminato) e la sezione "SEGUICI SU FACEBOOK" da Home e News
  - Nuovo sistema blog: backend CRUD `/api/posts` con autenticazione `X-Admin-Token`, pagina pubblica `/news` riscritta con grid post + empty-state, pannello `/admin` con login, form pubblicazione e gestione post
  - Test pytest in `/app/backend/tests/test_blog_admin.py` (11/11 pass) + E2E frontend tutto verde (testing agent)

## Files chiave
- `/app/frontend/src/components/Header.jsx` — header + logo (h-[88px])
- `/app/frontend/src/components/Logo.jsx` — img PNG trasparente
- `/app/frontend/public/assets/energeide-logo.png` — logo trasparente
- `/app/frontend/src/data/mock.js` — dati statici allineati al sito live
- `/app/frontend/src/pages/Home.jsx` — homepage senza sezione Facebook
- `/app/frontend/src/pages/News.jsx` — blog dinamico da `/api/posts`
- `/app/frontend/src/pages/Admin.jsx` — pannello admin (login + CRUD UI)
- `/app/frontend/src/App.js` — routes (aggiunta `/admin`)
- `/app/backend/server.py` — endpoints blog + progetti
- `/app/backend/.env` — `ADMIN_TOKEN`
- `/app/backend/tests/test_blog_admin.py` — test pytest

## Backlog
- P1: Internazionalizzazione (en/it switch) se richiesto
- P2: Editor rich-text per post blog (attualmente plain text + URL immagine)
- P2: Upload immagine direttamente dall'admin (oggi URL esterno)
- P2: Lista paginata `/news` se i post diventano molti
- P3: Eventuale integrazione Facebook Graph API per auto-import post (richiede FB App + token a lunga durata)

## Note tecniche
- Token admin in localStorage (`energeide_admin_token`) — accettabile per MVP single-admin, valutare httpOnly cookie se si scala
- `server.py` ~330 righe: se si aggiungono altri router, valutare split in `/app/backend/routes/`
