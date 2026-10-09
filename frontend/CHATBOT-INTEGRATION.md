# AI Chatbot Integration — GeM Advisor

Single project root: `D:\Prowave\One Page Site\GeMGovAdvisor\`
with `backend\` (FastAPI, API-only) + `frontend\` (Next.js site + chatbot widget + admin panel).

---

## 1. What the user gets

- A floating **💬 button** at the bottom-right of every page (stacked just above
  the existing WhatsApp button). Body scroll locks while the panel is open.
- Clicking it opens the chat panel:
  - **Lead gate** — visitor enters name + 10-digit mobile number first
    (stored in the chatbot backend's Postgres `users` table for sales follow-up).
  - **Quick service menus** — one-tap GeM/tender topic buttons.
  - **Streaming AI answers** — RAG (BGE-M3 embeddings → pgvector search →
    reranker → Groq LLM), token-by-token streaming.
  - **Live tender search** (from the MySQL `probid` database) + tender result table.
- A full **admin panel at `/admin`** — the original dashboard ported verbatim
  (`root/frontend/src`: same pages, components, markup, login flow), re-skinned
  to the GeM Advisor orange brand (`#F8862B` family, warm dark sidebar).
  Overview (stats + recharts traffic/latency + health), Documents
  (upload/text/chunks), System Prompt, Conversations, Users (leads),
  Evaluations, Cost, Settings.
- All traffic goes through **same-origin Next.js API routes**, so the browser
  never calls the backend directly → no CORS issues, and the Groq API key
  stays server-side.

---

## 2. Files ADDED — chatbot widget (`frontend\src\`)

| File | Purpose |
|---|---|
| `components/ChatWidget.jsx` | Main chat UI: SSE streaming with token batching (90 ms), lead gate, service menus, tender table, rich-text renderer |
| `components/ChatWidget.css` | Widget styles — self-contained `cw-*` classes, no global conflicts |
| `components/serviceMenus.js` | Quick-reply menu data (`SERVICES` + `SUB_MENUS`) for GeM/tender topics |
| `components/ChatbotFab.jsx` | Floating 💬 launcher (mounts `ChatWidget` only after first click → no SSR/hydration issues; locks body scroll while open) |
| `components/ChatbotFab.css` | FAB + panel positioning (bottom-right, above the WhatsApp button) |
| `app/api/chat/route.js` | Proxies the SSE stream from FastAPI `POST /api/chat` (streaming passthrough; 502 if backend down) |
| `app/api/user/register/route.js` | Validates name (≥2 chars) + phone (≥10 digits), proxies to FastAPI `POST /api/user/register` |
| `app/api/admin/[...slug]/route.js` | Generic proxy: every `/api/admin/*` call is forwarded to FastAPI `/api/admin/*` with method/headers/body preserved (GET/POST/PUT/DELETE/PATCH) |

## 3. Files ADDED — admin panel (`frontend\src\`, converted from the old Vite `root\frontend\src\`)

| File | Purpose (verbatim port from Vite `root\frontend\src\` — only import paths changed, TS types stripped) |
|---|---|
| `app/admin/admin.css` | Original `styles.css` copied exactly, mechanically scoped under `.admin-root` so its globals never leak into the site; recolored indigo→GeM Advisor orange |
| `app/admin/layout.tsx` | Exact original `App.tsx` AdminApp shell (`.login`, `.layout`, `.sidebar`, `main.content`, mobile topbar) + Next Link routing + `QueryClientProvider` |
| `app/admin/page.tsx` | Redirects authed users to `/admin/overview` (layout shows login otherwise) |
| `app/admin/(authed)/{overview,documents,conversations,prompt,users,evaluations,cost,settings}/page.jsx` | All 8 pages verbatim; charts load client-only (`ssr:false`); `recharts@2.15.3` pinned (v3 crashed Turbopack) |
| `components/admin/{StatCard,StoragePanel,SystemHealth,icons}.jsx` + `OverviewCharts.jsx` | Verbatim copies (charts split for client-only loading) |
| `lib/admin/api.ts` | Same-origin calls to `/api/admin/*` with sessionStorage Basic auth (+ `verify()` for login) |

## 4. Files MODIFIED in `frontend\`

| File | Change |
|---|---|
| `src/app/layout.js` | Site chrome moved into `components/SiteChrome.js` (client wrapper hides Header/Footer/WhatsApp/💬/JsonLd on `/admin*` — admin has its own dashboard shell) |
| `src/components/SiteChrome.js` | **NEW** — `usePathname` gate: full site chrome everywhere except `/admin*` |
| `src/app/globals.css` | No admin styles — admin is styled 100% by its own scoped `app/admin/admin.css` (original dashboard stylesheet) |
| `src/components/ChatbotFab.jsx` | Added body scroll-lock `useEffect` while panel is open |
| `.env` / `.env.example` | Added `CHATBOT_API_URL=http://127.0.0.1:8000` |
| `package.json` | `@tanstack/react-query` (as original) + `recharts@2.15.3` pinned (v3 broke Turbopack via `es-toolkit`) |
| `next.config.mjs` | Turbopack `@/*` → `./src/*` alias (matches `jsconfig.json`) |

Nothing else in the site was touched.

---

## 5. Changes in `backend\` (formerly `AI_Chatbot - V2\`, flattened to API-only)

| File | Change |
|---|---|
| `main.py` | **Stripped SPA serving** — removed `StaticFiles` mount + `/`, `/embed`, `/probee.js`, `/admin` SPA routes. Backend is now pure API (`/` returns service info). Chatbot UI + admin live in Next.js. |
| `.env` | Fixed stale `HF_HOME`/`TRANSFORMERS_CACHE` (old-machine path → local `models\`); cleaned malformed `CORS_ORIGINS` entry |
| `db/users-table.sql` | **NEW** — creates the `users` table `POST /api/user/register` needs (missing from `schema.sql`; without it the lead gate returned 500). Applied to `ragdb`. |
| `ops/check-pg.py` | **NEW** — Postgres connectivity diagnostic |
| `ops/setup-pg-wsl.sh` | **NEW** — idempotent Postgres schema setup inside WSL |
| `venv\` | **NEW** — Python 3.13 env, all of `requirements.txt` (CPU torch) |
| REMOVED | `chatbot-ui\` (old React SPA — superseded by Next.js), `mlruns\` + `mlflow.db` (unused experiment tracking) |

No RAG/LLM logic touched (`api/*.py`, `rag/`, `ingestion/`, `tenders/` run as shipped).

---

## 6. One-time machine setup (already done)

1. **Python venv** — `backend\venv` (torch CPU + all requirements).
2. **PostgreSQL 18 + pgvector** — inside **WSL Ubuntu**; role `rag`/`rag123`, db `ragdb`; `schema.sql` + `users-table.sql` applied. Auto-starts via systemd.
3. **`C:\Users\Dashrath\.wslconfig`** — `networkingMode=NAT`, `localhostForwarding=true`, `firewall=false`, `vmIdleTimeout=-1`, `instanceIdleTimeout=-1` (fixes Hyper-V firewall drops + WSL idle-suspend → WinError 1225).
4. **FAQ knowledge ingested** — `faq_probee.md` (39 chunks) + Training Handbook PDF (82 chunks).
5. **Redis** — Laragon build on :6379 (optional cache).
6. **MySQL** — :3306 with `probid` (160k live tenders) for tender search.

---

## 7. How to run everything (after a reboot)

```powershell
# 1. PostgreSQL — auto-starts inside WSL. Verify:
wsl -d Ubuntu -e bash -lc "ss -tlnp | grep 5432"

# 2. Redis — only if port 6379 is free:
cd C:\laragon\bin\redis\redis-x64-5.0.14.1; .\redis-server.exe redis.windows.conf

# 3. Backend — FastAPI on http://127.0.0.1:8000 (~1 min model warmup, cached)
cd "D:\Prowave\One Page Site\GeMGovAdvisor\backend"
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

# 4. Frontend — Next.js on http://localhost:3000
cd "D:\Prowave\One Page Site\GeMGovAdvisor\frontend"
npm run dev
```

## 8. URLs

| What | URL |
|---|---|
| Website (click 💬 bottom-right) | http://localhost:3000 |
| Admin panel (original dashboard UI) | http://localhost:3000/admin — user `admin`, password `local_dev_token_change_later` |
| Backend health | http://127.0.0.1:8000/health |
| Backend API docs | http://127.0.0.1:8000/docs |

---

## 9. Folder map (final — one root, `backend\` + `frontend\`)

```
GeMGovAdvisor\
├── backend\                        ← FastAPI, API-only
│   ├── api/                        ← chat, users, admin, ingest, …
│   ├── rag/  ingestion/  tenders/  analytics/  scripts/
│   ├── db/                         ← schema.sql, users-table.sql, faq_probee.md
│   ├── deploy/  ops/  models/
│   ├── venv/
│   ├── .env  config.py  main.py  models.py  requirements.txt
│   └── README.md / RUN_GUIDE.md / PROJECT_DOCS.md
│
└── frontend\                       ← Next.js 16 (App Router, Turbopack)
    ├── src\
    │   ├── app\
    │   │   ├── api\                ← chat/, user/register/, admin/[...slug]/ proxies
    │   │   ├── admin\              ← login + (authed)/{overview,documents,prompt,
    │   │   │                         conversations,users,evaluations,cost,settings}
    │   │   └── (site pages)  layout.js  page.js  globals.css
    │   ├── components\             ← site sections + ChatWidget/ChatbotFab/serviceMenus + admin/icons
    │   ├── lib\                    ← admin/api.ts + seo/db/mailer/…
    │   └── data\                   ← site.js
    ├── public/
    ├── .env                        ← CHATBOT_API_URL=http://127.0.0.1:8000
    ├── package.json / next.config.mjs / jsconfig.json / …
    └── CHATBOT-INTEGRATION.md      ← this file
```

## 10. Notes

- Backend **down** → widget shows a graceful error, site unaffected (proxy 502).
- Chat dead after a **reboot** → check WSL Postgres (§7 step 1).
- Change admin password → `ADMIN_USERNAME` / `ADMIN_TOKEN` in `backend\.env`, restart backend.
- Backend on another machine later → update `CHATBOT_API_URL` in `frontend\.env`.
- `/admin` uses the original dashboard layout, re-skinned to the GeM Advisor orange brand.
- **CI/CD** (`.github/workflows/ci.yml`): `test-frontend` (lint/test/build/smoke in `frontend/`) + `test-backend` (syntax + FastAPI import check in `backend/`) run in parallel; `deploy` (master/tags) git-pulls both, rebuilds frontend, refreshes backend venv, restarts both pm2 processes (`frontend`, `chatbot-backend`) and health-checks `:8000/health`. Details in `frontend/CI-CD-STEPS.md` + `frontend/DEPLOY.md` (§9 backend).
