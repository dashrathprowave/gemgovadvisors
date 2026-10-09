# GeM Advisor — Chatbot Backend (FastAPI, API-only)

A production **RAG (Retrieval-Augmented Generation) chatbot API** that answers questions about **government tenders, tender processes, and required documents** in **English, Hinglish (Roman-script Hindi), and Hindi (Devanagari)**. Grounded in company documents (PostgreSQL + pgvector) with live tender search via MySQL.

This backend serves **JSON only**. The chatbot widget and the admin panel live in the Next.js frontend (`../frontend`), which calls this API through same-origin proxies (`/api/chat`, `/api/user/register`, `/api/admin/*`).

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Trilingual RAG** | Answers in English, Hinglish, and Hindi (Devanagari) with automatic language detection |
| **Document-Grounded Answers** | Every response cites sources from ingested company PDFs/DOCs/HTML/Markdown |
| **Live Tender Search** | Read-only queries against MySQL `probid` database via the `all_tenders` view (`live_tenders` ∪ `fresh_tenders`) |
| **Lead Capture** | `POST /api/user/register` upserts name + 10-digit mobile (Postgres `users` table) |
| **Admin API** | Username+password guarded: docs, prompt tuning, conversations, evals, cost tracking, users |
| **Streaming SSE** | Token-by-token response streaming via `POST /api/chat` |
| **Exact-Match Cache** | Redis cache for repeat questions (sub-millisecond responses) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (Port 8000)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  /api/chat  │  │ /api/admin  │  │ /api/ingest │  ...          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    RAG PIPELINE                         │   │
│  │  Contact Short-Circuit → Greeting → Tender SQL → Hybrid │   │
│  │  Retrieval (Dense + Sparse + RRF) → Rerank → Generate   │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                │                │                     │
│    ┌────┴────┐      ┌────┴────┐      ┌────┴────┐                │
│    ▼         ▼      ▼         ▼      ▼         ▼                │
│ PostgreSQL  Redis   MySQL     Groq    BGE-M3    BGE-Reranker    │
│ (pgvector)  (Cache) (Tenders)  (LLM)   (Embed)   (CrossEnc)     │
└─────────────────────────────────────────────────────────────────┘
                               │  same-origin proxies
                               ▼  (/api/chat, /api/user/register, /api/admin/*)
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (../frontend, Port 3000)          │
│  Floating 💬 widget (lead gate + streaming)  +  /admin panel    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
GeMGovAdvisor/
├── backend/                       # THIS — FastAPI + RAG (Python 3.13)
│   ├── main.py                    # Entrypoint (API-only, no SPA serving)
│   ├── config.py                  # Pydantic Settings (.env driven)
│   ├── models.py                  # BGE-M3 embedder + BGE reranker (CPU)
│   ├── api/
│   │   ├── chat.py                # POST /api/chat (streaming SSE)
│   │   ├── admin.py               # /api/admin/* (username+password guarded)
│   │   ├── ingest.py              # Document ingestion
│   │   ├── metrics.py             # Dashboard metrics
│   │   ├── feedback.py            # 👍/👎 on messages
│   │   ├── eval.py                # Golden Q&A eval runs
│   │   └── users.py               # Lead capture (name + phone)
│   ├── rag/
│   │   ├── pipeline.py            # Orchestrator with contact short-circuit
│   │   ├── retriever.py           # Hybrid dense + sparse + RRF
│   │   ├── reranker.py            # Cross-encoder rerank (top-4)
│   │   ├── generator.py           # Prompt + streaming + contact answers
│   │   ├── llm_client.py          # Groq OpenAI-compatible streaming
│   │   ├── router.py              # Query routing
│   │   └── query_rewrite.py       # Query normalization
│   ├── tenders/
│   │   ├── mysql.py               # Read-only MySQL + all_tenders view
│   │   └── text_to_sql.py         # NL→SQL for tender queries
│   ├── ingestion/
│   │   ├── loader.py              # PDF/DOCX/HTML/MD/TXT extraction
│   │   └── chunker.py             # Strategy-aware chunking
│   ├── db/
│   │   ├── postgres.py            # Async SQLAlchemy + asyncpg pool
│   │   ├── models.py              # ORM: Document, Chunk, Conversation, Message, Feedback, User, Eval
│   │   ├── schema.sql             # DDL with HNSW, GIN, pg_trgm indexes
│   │   ├── users-table.sql        # Lead-capture `users` table (missing from schema.sql)
│   │   ├── faq_probee.md          # Bundled GeM/tender FAQ (ingest on fresh DBs)
│   │   └── redis_client.py        # Async Redis cache (rag:qa:* keys)
│   ├── analytics/                 # SQL for metrics, cost, evals
│   ├── scripts/                   # benchmark, rebuild_embeddings
│   ├── deploy/
│   │   └── setup-vm.sh            # Fresh-VPS provisioner (pm2 backend)
│   ├── ops/
│   │   ├── check-pg.py            # Postgres connectivity diagnostic
│   │   └── setup-pg-wsl.sh        # Re-apply schema inside WSL (idempotent)
│   ├── venv/                      # Local Python env (NOT committed)
│   ├── models/                    # HF cache target (NOT committed)
│   ├── .env                       # Local secrets (NOT committed)
│   ├── .env.example               # Template
│   └── requirements.txt
│
└── frontend/                      # Next.js 16 site + widget + /admin (see its README)
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- **PostgreSQL 16+** with `pgvector`, `pg_trgm`, `uuid-ossp` extensions (database: `ragdb`, role: `rag`)
- **MySQL 8+** (database: `probid` with `live_tenders`, `fresh_tenders` tables)
- **Redis** (optional but recommended for caching)
- **Python 3.13**

### 1. Python env
```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install --index-url https://download.pytorch.org/whl/cpu torch
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 2. Configure + database
```powershell
Copy-Item .env.example .env
# Edit .env: DATABASE_URL, LLM_API_KEY, ADMIN_USERNAME + ADMIN_TOKEN, REDIS_URL, MySQL creds
# Apply schema once (Postgres must have pgvector):
#   psql -d ragdb -f db/schema.sql
#   psql -d ragdb -f db/users-table.sql
```

### 3. Run
```powershell
cd backend
..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```
First boot loads the embedding models (~1 min from cache; ~10 min download on first-ever run).

### 4. Access
| Surface | URL |
|---------|-----|
| **API Docs** | http://127.0.0.1:8000/docs |
| **Health Check** | http://127.0.0.1:8000/health |
| **Chatbot widget** | Next.js site → http://localhost:3000 (💬 button) |
| **Admin panel** | Next.js site → http://localhost:3000/admin (`ADMIN_USERNAME` + `ADMIN_TOKEN` from `.env`) |

> The backend serves **no HTML** — `/` returns service info JSON. If you need the old standalone chatbot/admin SPA back, it was removed in favor of the Next.js frontend.

---

## ⚙️ Configuration (`.env`)

```ini
# Postgres (RAG store)
DATABASE_URL=postgresql+asyncpg://rag:rag123@127.0.0.1:5432/ragdb

# LLM (Groq OpenAI-compatible)
LLM_API_KEY=gsk_...
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=qwen/qwen3-32b
LLM_MODEL_FAST=qwen/qwen3-32b

# Embeddings / reranker (local CPU)
EMBEDDING_MODEL=BAAI/bge-m3
RERANK_MODEL=BAAI/bge-reranker-base

# Tender database (MySQL, read-only)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=probid

# Cache (optional)
REDIS_URL=redis://127.0.0.1:6379/0

# Admin console (both compulsory)
ADMIN_USERNAME=admin
ADMIN_TOKEN=change-me-to-something-strong

# CORS (only needed for direct browser→backend calls; the Next.js
# proxies are same-origin so they don't need CORS)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Model cache (optional — defaults to ~/.cache/huggingface)
# HF_HOME=
```

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Streaming chat (SSE: `init` → `meta` → `token`* → `[DONE]`) — requires `question`, optional `session_id` |
| `POST` | `/api/user/register` | Lead capture — `{name, phone, session_id}`; upserts on phone |
| `POST` | `/api/feedback` | 👍/👎 on a message |
| `GET` | `/health` | Health check |
| `GET` | `/` | Service info (JSON) |

### Admin (HTTP Basic: `ADMIN_USERNAME` + `ADMIN_TOKEN` — both compulsory)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/metrics/overview` | Dashboard stats |
| `GET` | `/api/admin/metrics/timeseries` | Time-series charts |
| `GET` | `/api/admin/metrics/latency` | Latency distribution |
| `GET` | `/api/admin/metrics/top-questions` | Top asked questions |
| `GET` | `/api/admin/metrics/unanswered` | Unanswered queries |
| `GET/POST` | `/api/admin/documents` | Document CRUD + upload |
| `POST` | `/api/admin/documents/upload` | Upload PDF/DOCX/HTML/MD/TXT |
| `POST` | `/api/admin/documents/{id}/reembed` | Re-embed document chunks |
| `GET` | `/api/admin/prompt` | Get current system prompt |
| `PUT` | `/api/admin/prompt` | Update system prompt (in-memory) |
| `POST` | `/api/admin/prompt/reset` | Reset to default |
| `GET` | `/api/admin/conversations` | List conversations |
| `GET` | `/api/admin/conversations/{id}` | Conversation detail |
| `GET` | `/api/admin/users` | List leads |
| `GET/POST` | `/api/admin/eval/golden` | Golden Q&A CRUD |
| `POST` | `/api/admin/eval/run` | Run evaluation |
| `GET` | `/api/admin/health` | System health (postgres/redis/llm/mysql) |
| `GET` | `/api/admin/cost` | Token cost breakdown |

---

## 🔧 Key Technical Details

### RAG Pipeline Flow (`rag/pipeline.py`)
1. **SQL Injection Guard** — rejects malicious queries
2. **Redis Exact-Match Cache** — instant return for repeated questions
3. **Contact Short-Circuit** — phone/email questions answered deterministically (no LLM)
4. **Greeting Fast-Path** — instant canned response for hellos
5. **Tender Intent Detection** — routes to MySQL text-to-SQL for live tender queries
6. **Hybrid Retrieval** — dense (pgvector HNSW) + sparse (BM25/pg_trgm) fused via RRF
7. **Cross-Encoder Rerank** — BGE reranker down to top-4 chunks
8. **Streaming Generation** — Groq Qwen with trilingual system prompt

### Tender Search
- Read-only against MySQL `probid`; the `all_tenders` view unions `live_tenders` + `fresh_tenders`
- The bot does **not** filter by deadline — add `submitdate >= CURDATE()` if only open tenders should show
- Freshness depends on the DB contents, not the bot — re-import tender dumps to refresh

### Lead Gate
- The Next.js widget requires **name + 10-digit mobile** before the first message
- `POST /api/user/register` upserts on phone (idempotent)

---

## 🌐 Deployment (VPS)

CI (`.github/workflows/ci.yml`) runs `test-backend` (syntax + import check) on every push, and on `master`/tags the `deploy` job SSHs to the VPS: git pull → venv refresh → `pm2 restart chatbot-backend` → `/health` check (10-min retry for first-boot model download).

Fresh server: `bash backend/deploy/setup-vm.sh /opt/gemgovadvisor` (pm2 process `chatbot-backend`, port 8000). Details in `../frontend/DEPLOY.md` §9.

---

## 🧪 Testing & Quality

```powershell
cd backend
# Syntax check (no dependencies needed)
..\venv\Scripts\python.exe -m compileall -q api db rag ingestion tenders analytics scripts config.py main.py models.py
# App assembly check (no model download, no DB connection)
..\venv\Scripts\python.exe -c "from main import app; print('routes:', len(app.routes))"
# Benchmark / re-embed
..\venv\Scripts\python.exe scripts/benchmark.py
..\venv\Scripts\python.exe scripts/rebuild_embeddings.py
```

Evaluations: add golden Q&A in Admin → Evaluations → Run. Prompt edits via dashboard are **in-memory only** — edit `rag/generator.py::DEFAULT_SYSTEM_PROMPT` for permanence.

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| Stale answers after prompt change | Clear Redis: `redis-cli KEYS "rag:qa:*" \| xargs redis-cli DEL` |
| "Model not found" on startup | First boot downloads ~3 GB — wait; then check `HF_HOME`/disk space |
| MySQL tender queries fail | Verify `probid` reachable, `all_tenders` view exists |
| `POST /api/user/register` 500 `relation "users" does not exist` | Apply `db/users-table.sql` to `ragdb` |
| CORS errors on direct calls | Add origin to `CORS_ORIGINS` (not needed via Next.js proxies) |
| Port 8000 in use | `netstat -ano \| findstr :8000` → `taskkill /PID <pid> /F` |
| Only expired tenders show | DB is stale — refresh `probid` data; optionally filter `submitdate >= CURDATE()` |

---

## 📄 License

Proprietary — ProBid Consultants LLP. All rights reserved.

---

*FastAPI · PostgreSQL/pgvector · Redis · MySQL · BGE-M3 · BGE-Reranker · Groq — serving the GeM Advisor Next.js frontend.*
