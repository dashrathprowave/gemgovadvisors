# Run Guide — ProBee AI Chatbot (ProBid Consultants LLP)

Run the whole project yourself with the steps below. No Docker, no nginx —
just Python + Node + databases on this machine.

> Project folder used below: `D:\Shubh\Projects\AI_Chatbot - V1`
> (If yours is elsewhere, replace the path in every command.)

## 0. What you get when everything runs

| URL | What |
|---|---|
| http://127.0.0.1:8000/ | Chatbot (public, React) — embed via `<iframe src=".../">` |
| http://127.0.0.1:8000/admin | Admin console (login with username + password) |
| http://127.0.0.1:8000/docs | API docs (Swagger) |
| http://127.0.0.1:8000/health | Health check → `{"status":"ok",...}` |
| http://127.0.0.1:5173/ | Same app via Vite dev server (auto-reloads while coding) |

Admin login (dev): username `admin`, password `local_dev_token_change_later`
(from `backend/.env` → `ADMIN_USERNAME` / `ADMIN_TOKEN`). Both are compulsory.

---

## 1. Prerequisites (install once)

- **Python 3.13** (`python --version`) — https://www.python.org/downloads/
- **Node.js 18+** (`node --version`, `npm --version`) — https://nodejs.org/
- **PostgreSQL 16 + pgvector** with database `ragdb` + user `rag`
- **MySQL 8** with database `probid` (tender data)
- **Redis** on :6379 — optional (app works without it, answers just aren't cached)

## 2. First-time setup

### 2.1 Databases (once)
```powershell
# 1. Make sure the DB services are running
Get-Service postgresql*, mysql* | Select-Object Name, Status

# 2. Apply the schema (extensions + tables + vector indexes) — once per fresh DB:
$env:PGPASSWORD = "rag123"
psql -h 127.0.0.1 -U rag -d ragdb -f " C:\Users\Dashrath\Downloads\AI_Chatbot - V2\AI_Chatbot - V2\backend\db\schema.sql"

# 3. Sanity check — you should see your chunks + tenders:
psql -h 127.0.0.1 -U rag -d ragdb -c "SELECT count(*) FROM chunks;"
mysql -h 127.0.0.1 -u root -e "SELECT COUNT(*) FROM probid.live_tenders;"
```

### 2.2 Backend env file (once)
```powershell
# Copy the template and fill in secrets (Groq key, admin username+password, DB creds):
Copy-Item "D:\Shubh\Projects\AI_Chatbot - V1\backend\.env.example" `
          "D:\Shubh\Projects\AI_Chatbot - V1\backend\.env"
# Then edit backend\.env: LLM_API_KEY, ADMIN_USERNAME, ADMIN_TOKEN, DATABASE_URL, REDIS_URL, MYSQL_*
```
A ready `backend/.env` already exists in this project — only recreate it if missing.

### 2.3 Python environment (once, ~10 min — big ML downloads)
```powershell
cd "D:\Shubh\Projects\AI_Chatbot - V1"
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install --index-url https://download.pytorch.org/whl/cpu torch
.\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
# Verify:
.\venv\Scripts\python.exe -c "import fastapi, uvicorn, torch, sentence_transformers; print('ENV-OK', torch.__version__)"
```

### 2.4 Frontend packages (once, ~2 min)
```powershell
cd "D:\Shubh\Projects\AI_Chatbot - V1\frontend"
npm ci
```

> ⚠️ Do **not** delete `venv/` or `frontend/node_modules/` — reinstalling takes ~10 min.
> Exclude them when zipping the project instead.

---

## 3. Daily run (every time)

Open **two** terminals (PowerShell).

### Terminal 1 — Backend (port 8000)
```powershell
cd "D:\Shubh\Projects\AI_Chatbot - V1\backend"
..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```
First boot takes **~2–3 minutes** (it downloads/loads the BGE-M3 embedder + reranker
once, then caches them in `~/.cache/huggingface`). Leave this window open.

### Terminal 2 — Frontend dev UI (port 5173, optional but handy while coding)
```powershell
cd "D:\Shubh\Projects\AI_Chatbot - V1\frontend"
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```
Leave this window open. The page auto-reloads when you edit React files.

### If you changed React code and want it live on :8000 too
The backend serves the **built** copy (`frontend/dist`). Rebuild, then restart Terminal 1:
```powershell
cd "D:\Shubh\Projects\AI_Chatbot - V1\frontend"
npm run build
```

---

## 4. Verify it works

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health          # → status ok
Invoke-WebRequest http://127.0.0.1:8000/ -UseBasicParsing | Select-Object StatusCode   # → 200 chatbot
Invoke-WebRequest http://127.0.0.1:5173/ -UseBasicParsing | Select-Object StatusCode   # → 200 dev UI
```

Then in the browser:
1. http://127.0.0.1:8000/ → click 💬 → complete the name+mobile gate → send
   `what is your mobile number?` → must reply **+91 70166 28865**.
2. http://127.0.0.1:8000/admin → log in with username + password → check
   Overview (3 docs / 139 chunks) and Documents.
3. Try a tender question: `show me construction tenders in Gujarat` → tender table.

---

## 5. Stop everything

- Press `Ctrl+C` in Terminal 1 and Terminal 2, or:
```powershell
# Kill whatever listens on each port:
$be = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique
$fe = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique
Stop-Process -Id $be -Force -ErrorAction SilentlyContinue
Stop-Process -Id $fe -Force -ErrorAction SilentlyContinue
```
Databases can stay running — they hold all your data.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `python.exe ... not recognized` / `ModuleNotFoundError: fastapi` | `venv/` missing → redo §2.3 |
| `vite` not found / blank page on :5173 | `frontend/node_modules` missing → redo §2.4 |
| Port already in use (`address already in use`) | Old process still alive → §5, then start again |
| Backend starts but `/health` hangs ~2 min | Normal — models warming up, wait |
| `/` shows JSON instead of chatbot | `frontend/dist` missing → `npm run build` + restart backend |
| Bot says “I don’t have the mobile number” | Stale Redis cache → delete `rag:qa:*` keys (they expire in 1h anyway) |
| Tender query says “database unavailable” | MySQL down or wrong `MYSQL_*` in `backend/.env` |
| Admin pages show “Invalid username or password” | Enter both `ADMIN_USERNAME` and `ADMIN_TOKEN` (password) from `backend/.env` |
| `/admin/documents` (or any `/admin/*` page) returns JSON | Dev proxy misconfigured — `vite.config.ts` must proxy only `/api` (+ `/health`), never `/admin` |

## 7. VPS notes (when you deploy)

1. Upload everything **except** `venv/`, `node_modules/`, `dist/`, `models/`, `__pycache__/`.
2. Follow §2 on the server, or just run `bash deploy/setup-vm.sh /opt/probee` (does §2.3+§2.4+build+start).
3. One process serves all: chatbot `/`, admin `/admin`, API `/api/*` on port 8000 — point the domain/Cloudflare at it, no nginx needed.
4. Embed the chatbot anywhere: `<iframe src="https://your-domain/" width="400" height="620"></iframe>`.
