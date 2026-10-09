# ProBee — AI Chatbot (ProBid Consultants LLP) — Project Documentation

> Stack: FastAPI + Postgres/pgvector + Redis + MySQL + React/Vite (chatbot + admin)
> Served by the backend alone — no reverse proxy. Live URLs (local dev AND VPS shape):
> Chatbot http://127.0.0.1:8000/ · Admin http://127.0.0.1:8000/admin · API http://127.0.0.1:8000/api/… · Health `/health` · Docs `/docs`

---

## 1. What this project is

**ProBee** is a production-style **RAG (Retrieval-Augmented Generation) chatbot** for
ProBid Consultants LLP. It answers questions about **government tenders, tender
processes and required documents** in three language styles — **English, Hinglish
(Roman-script Hindi) and Hindi (Devanagari)** — grounding every answer in company
documents stored in Postgres, plus a **live tender search** backed by a MySQL tender
database (`probid`: `live_tenders` + `fresh_tenders` → `all_tenders` view).

Three user-facing surfaces, one backend process (no nginx — FastAPI serves all):

| Surface | URL | Tech |
|---|---|---|
| Chatbot (public, embeddable) | `/` | React (`ChatWidget` + `ChatbotDemo` page). Other sites embed it as `<iframe src="https://your-domain/">` |
| Admin console (username+password gate) | `/admin/*` | React (Overview, Documents, Prompt, Conversations, Users, Evaluations, Cost, Settings) |
| Chat + admin JSON API | `/api/*` (`/api/chat`, `/api/admin/...`) — “the API” other pages call | FastAPI |

---

## 2. What was done in this session (all changes)

### 2.1 Fresh environment rebuild
- **Deleted and recreated the Python virtualenv** (`venv/`, Python 3.13.0) and ran a clean
  `pip install -r backend/requirements.txt` (torch installed CPU-only from the PyTorch
  CPU index: `torch 2.14.0+cpu`, `sentence-transformers 6.1.0`; all imports verified).
- **Fresh frontend install** via `npm ci` in `frontend/` (vite 5.4.21, react 18.3.1 verified).
- **Started backend** (`uvicorn main:app`, :8000) and **dashboard** (`npm run dev`, :5173) as
  detached processes; verified `/health`, widget serving (200), dashboard (200),
  DB-backed metrics (3 docs / 139 chunks), and a live RAG chat round-trip.

### 2.2 Windows-compatibility fixes (code)
1. **`backend/models.py` — model cache path fix.**
   `cache_folder="/app/models"` is a Docker path; on Windows it missed the real HF cache
   (`~/.cache/huggingface`, where `bge-m3` + `bge-reranker-base` already live) and would
   re-download GBs. Added `_resolve_cache_folder()` which uses `HF_HOME` /
   `TRANSFORMERS_CACHE` only when populated, else falls back to the default HF cache
   (container behaviour unchanged — `/app/models` is used when populated).
2. **`backend/main.py` — frontend hosting (was: widget static-dir fix, later removed).**
   The legacy `/widget` mount was deleted together with `frontend/widget/`; `main.py`
   now serves the React build instead (`/assets` + SPA fallback at `/`, `/admin/*`).

### 2.3 Greeting text change
- Greeting changed from *"…your Government Tender & GeM **assistance** assistant."*
  to *"…your Government Tender & GeM **portal** assistant."* First applied to the legacy
  widget files, then carried into the React `ChatWidget.tsx` default + `ChatbotDemo`
  page (the legacy `frontend/widget/` folder has since been deleted).

### 2.4 Mobile-number fix (the main bug)
**Symptom:** the system prompt contained `Mobile: +91 70166 28865`, yet
“what is your mobile number?” answered *“I don't have a mobile number to share.”*

**Root causes found (two, stacked):**
1. **Prompt rules suppressed the number.** Rules 2 (*base answers strictly on the
   provided context*), 6 (*ignore contact details*) and 11 (*no other contact lines*)
   in `rag/generator.py::DEFAULT_SYSTEM_PROMPT` made the LLM ignore the contact block
   in the system prompt, because no retrieved document chunk contains the number.
2. **Stale Redis cache.** The wrong answer had been cached under `rag:qa:*` (1-hour TTL;
   Redis *is* running on :6379), so repeat questions kept serving the old reply even
   after the prompt was corrected. 7 stale keys were deleted.

**Code changes (permanent, survive restarts):**
- **`backend/rag/generator.py`**
  - Contact block now lists `Mobile: +91 70166 28865` next to the email.
  - Rule 6 reworded (ignore filler *in the retrieved context*; prompt contact details are
    official and shareable), rule 11 updated (auto-footer now has email + phone),
    **new rule 12**: contact questions must be answered directly from the prompt header,
    overriding rules 2/6 — never say the number is unavailable.
  - `CONTACT_LINES` footers were later **removed entirely** (see §2.10): contact
    details now appear only when the query asks for them.
  - `_HELP_PHRASES` extended with typo-tolerant matchers: `mobile number`, `moblie`,
    `mobail`, `contect`, `contact probi` (catches “probild”), `your number`,
    `company number`, `call you`, `reach you/us`, `contact you/us`, `मोबाइल नंबर`, …
    (deliberately *not* bare `मोबाइल`/`नंबर`, which would false-positive on queries
    like “mobile se apply” or “tender नंबर”.)
  - New `CONTACT_ANSWERS` + `answer_contact()` — official contact reply in the user's language.
- **`backend/rag/pipeline.py`** — new **CONTACT short-circuit** in `rag_pipeline()`:
  contact questions bypass retrieval + LLM entirely and return the fixed answer
  (kind=`CONTACT`, still recorded/cached like normal answers). Guaranteed, instant, zero LLM cost.
- **`backend/tenders/text_to_sql.py`** — `EMAIL_FOOTERS` on the tender path also include
  the phone number now (later removed entirely with the other auto-footers, §2.10).
- **Live ops (no restart needed for these):** patched the running server's in-memory
  prompt via `PUT /admin/prompt` (rules 6/11/12 + mobile line), cleared Redis, then
  **restarted the backend** once to load the new `generator.py`/`pipeline.py`.

**Verified live:** “what is your moblie number?”, “what is your company moblie
number?” and “how can i contact probild?” (all with typos) each return
“You can contact ProBid Consultants LLP at **+91 70166 28865** or email us at
**sales@probidconsultants.com**…”.

> Heads-up: the dashboard prompt editor (`PUT /api/admin/prompt`) is **in-memory only** —
> a backend restart resets it to `DEFAULT_SYSTEM_PROMPT` (which now ships the mobile
> number + rule 12, so you are covered either way).

### 2.5 React chatbot + routing restructure (no nginx)
- **Removed the nginx concept entirely**: deleted `deploy/nginx-http.conf`; rewrote
  `deploy/setup-vm.sh` (venv → pip → `npm run build` → single uvicorn on :8000, no
  reverse proxy, no docker-compose) and `deploy/README.md` (VPS flow: chatbot at `/`,
  admin at `/admin`, API at `/api`, Cloudflare for HTTPS).
- **Chatbot turned into React**: new `frontend/src/components/ChatWidget.tsx`
  (+ `ChatWidget.css`) — session persistence, SSE streaming from `/api/chat`, typing
  indicator, safe `**bold`**/list rendering (no `dangerouslySetInnerHTML`), source chips,
  Enter-to-send — plus `src/pages/ChatbotDemo.tsx` (+ css), a public full-page demo
  with ProBee branding and a contact footer. No new npm dependencies.
- **Routing**: `App.tsx` now serves the demo at `/` (public, no login) and the existing
  admin console nested under `/admin/*` (username+password gate, verified via API). `index.html` title → “Probee | ProBid Consultants”.
- **API moved under `/api/*`** (`backend/main.py` `include_router(..., prefix="/api")`):
  `/api/chat`, `/api/ingest`, `/api/feedback`, `/api/user/*`, `/api/admin/*`
  (incl. metrics + eval). `src/api.ts` and `vite.config.ts` proxy updated
  (`/api` + `/health` only — so `/admin/*` page navigations are never proxied to the API).
  Legacy `chat-ui.js` URLs updated to `/api/chat`, `/api/user/register`.
- **Backend serves the built frontend** (`main.py`): `/assets` static + `index.html` at
  `/`, `/admin`, `/admin/{path}` (SPA fallback, registered *after* API routers so
  `/api/*` always wins; falls back to the old JSON info block when `dist/` is absent).
### 2.6 Flat `frontend/` + full widget-to-React migration- **Flattened**: `frontend/dashboard/*` moved up to `frontend/` (`src/`, `package.json`,
  `vite.config.ts`, …); `frontend/dashboard/` and `frontend/widget/` **deleted**.
- **All legacy widget features ported to React** (then the folder was removed):
  - `src/components/serviceMenus.ts` — the 10 service buttons + sub-question menus.
  - `ChatWidget.tsx` — mandatory **lead gate** (name + 10-digit mobile → `POST /api/user/register`,
    `sessionStorage` flag, same validation/errors as legacy), service/sub menus (user+prompt
    messages, chip-click sends, “← All services” back), **tender results table** from
    `meta.tenders` (PBID + Live/Fresh badge, 120-char description, agency, city/state,
    ₹ value, due/open dates), empty-answer fallback, per-status error messages.
  - Menu behaviour: full service list only with the 1st (greeting) response, then the
    picked service's sub-questions; after every answer only a single
    **“☰ All Services”** button shows, which re-expands the full list.
  - Dropped intentionally: iframe close button (host-page chrome, not chatbot UI).
- **Backend**: `/widget` mount removed from `main.py`; `frontend/dist` is the first
  `DIST_DIR` candidate.
- `deploy/setup-vm.sh`, `deploy/README.md` and this doc updated to `frontend/` paths.
- Rebuilt (`npm run build` clean), restarted backend + Vite dev, verified: `/` → chatbot
  HTML, `/admin` → 200, `/api/admin/metrics/overview` → DB data, `/api/chat` streams
  incl. +91 70166 28865, `/api/user/register` saves leads.

### 2.7 Username + password admin login (compulsory)
- `backend/config.py` + `.env`/`.env.example`: new `ADMIN_USERNAME` (dev: `admin`);
  `ADMIN_TOKEN` is now the **password** (dev: `local_dev_token_change_later`).
- `backend/api/admin.py`: `check_admin()` enforces HTTP Basic `username:password` with
  constant-time compare (`require_admin` wrapper kept, so metrics/eval routers inherit it);
  old `Bearer <token>` access now returns 401. `api/ingest.py` uses the same check.
- `frontend/src/api.ts`: credentials in sessionStorage, `Basic` header on every admin call;
  `App.tsx` login requires **both** fields and verifies via `GET /api/admin/health`
  before entry (wrong → “Invalid username or password”); `Settings.tsx` logout updated.
- Verified: no-auth → 401, old Bearer → 401, wrong password → 401, correct pair → 200.
- Session-scoped login: credentials live in `sessionStorage` (not persistent
  `localStorage`), so a fresh browser session hitting `/admin` directly always lands
  on the login screen — no silent auto-entry from an old remembered login.

### 2.8 "Aaj ke tender" — today's live + fresh tenders in Hinglish
- Requests like “aaj ke tender kitne nikle?”, “aaj ke tender batao?”, “aaj ke
  construction tender dikhao” now return current tenders from **both** sources.
- `backend/tenders/text_to_sql.py`: date rules added to the SQL prompt — “aaj/today”
  → `dt = (SELECT MAX(dt) FROM all_tenders)` (never `CURDATE()`, the feed can lag days),
  “kal/yesterday” → MAX(dt)−1 day, “this week” → last 7 days of data; deadlines still
  use `submitdate`. `kitne` → `COUNT(*)` (already existed).
- Bug fixed: `is_count_query()` matched `MAX(` anywhere, so date-filtered LIST queries
  were misread as COUNT (returned a PBID as the “count”). It now inspects only the
  SELECT list.
- MySQL: added `idx_live_dt` / `idx_fresh_dt` indexes (both tables were full-scanning).
- Verified live: count = **82,520** latest-batch tenders; list queries return 10-row
  tender tables incl. category filter (`Work LIKE '%construction%'`).
- Note: the tender feed's newest data is the latest `dt` batch (currently 2026-09-16),
  so “aaj ke” means “latest available”, not literally today.

### 2.9 Text-upload 500 on re-upload (duplicate hash)
- Symptom: `POST /api/admin/documents/create-text` → 500
  `UniqueViolationError: documents_tenant_id_file_hash_key` when uploading text whose
  SHA-256 already exists (e.g. retried “Gem Details” upload). The endpoint inserted
  blindly, unlike the file-upload path which dedupes.
- Fix in `backend/api/admin.py::create_text_document`: pre-check
  `(tenant_id, file_hash)` → return 200 `{"status":"duplicate_skipped", ...}` (same
  shape as ingest); plus `IntegrityError` catch + rollback for concurrent races.
- Verified: same text twice → `created` then `duplicate_skipped` (same id), no 500.

### 2.10 Contact details only on demand (no auto-footer)
- Before: every RAG + tender answer ended with an auto-appended
  “further assistance … email / call +91…” footer.
- Now: footers removed (`CONTACT_LINES` in `rag/generator.py` and `EMAIL_FOOTERS` in
  `tenders/text_to_sql.py` deleted; rule 11 rewritten to forbid contact closings
  unless asked). The deterministic CONTACT answer (rule 12 + `wants_contact`) still
  returns email + phone when the query asks for them.
- Verified live: normal question → clean answer, no email/phone; “what is your mobile
  number?” → +91 70166 28865 + email.
- Side note: two consecutive `Invoke-WebRequest` SSE reads hung with zero output while
  the API itself answered in ~12s — PowerShell 5.1 buffering quirk with event streams,
  not a backend issue (proven via httpx streaming script with timestamps).

### 2.11 Chunk keyword search + short answers
- **Chunk search** (`frontend/src/pages/Documents.tsx` → `ChunkViewer`): search box
  filters the document's chunks by keyword (multi-word AND, case-insensitive, matches
  text + chunk index), shows “X of Y chunks match”, highlights hits with `<mark>`
  (React nodes only, no innerHTML), clear button + empty-state hint. Client-side over
  the loaded chunks (endpoint caps at 500/doc). Styles in `styles.css` (`.chunk-search`).
- **Short answers**: system-prompt rule 1 + generation instruction now cap answers at
  ~80 words / 5–6 lines (longer only when explicitly asked); `LLM_MAX_TOKENS`
  320 → 256 (`config.py` + `.env.example`). Verified: process question → 85 tokens,
  4 steps, no footer.

### 2.12 Fully responsive admin dashboard
- `frontend/src/styles.css` has two tiers: ≤920px and ≤640px (stat grids, tables,
  modal, forms, login, bubbles).
- ≤920px uses a **hamburger drawer** (`App.tsx`: sticky mobile topbar + slide-in
  sidebar + backdrop, closes on navigation) instead of an overflowing top nav row.
- Tables swipe-scroll with a **sticky first column** on phones; chunk-search wraps;
  file inputs can't overflow.

### 2.17 Smooth response animations
- `ChatWidget`: bot/user rows glide in on mount (`cw-msg-in`; safe — React reuses the
  row node so streaming updates never restart it), blinking orange caret (`cw-caret`)
  at the live end of a streaming answer, typing dots kept for the pre-first-token gap.
- Auto-scroll follows tokens only while the user is near the bottom (never yanks
  mid-read), instant during streaming, smooth glide otherwise.
- `prefers-reduced-motion` disables all of it (widget + demo panel).

### 2.18 Jank-free streaming (batched paints + memoized rows)
- Root cause of choppy arrival: every streamed token triggered a full chat-list
  re-render + rich-text re-parse. Now tokens accumulate in a local buffer and flush
  to state every 90ms (~11 paints/sec), and message rows are `React.memo`'d so only
  the in-progress bubble re-renders. Entrance/caret/scroll behavior unchanged.

### 2.13 `/embed` — bare chatbot view for iframes
- `App.tsx` has an `/embed` route rendering only `ChatWidget` inside `.embed-wrap`
  (100vh/100dvh, no landing content, no margins) — perfect in any iframe size on any
  device. Backend serves `index.html` at `/embed` (dev Vite handles it too).
- Embed snippet: `<iframe src="https://your-domain/embed" width="400" height="620"
  style="border:none;border-radius:18px;"></iframe>` (`/` keeps the landing page
  + floating-icon demo).

### 2.14 `probee.js` — Razorpay-style drop-in SDK
- `frontend/public/probee.js` (copied to `dist/` on build, served live at
  `/probee.js`): any site adds one script tag, then `Probee.open({ apiUrl })`
  renders the chatbot UI directly (floating button + 400×620 panel with an
  isolated `/embed` iframe, fullscreen on phones). Also `Probee.init()` (button
  only), `close()`, `toggle()`; options `{ apiUrl, color, title }`.
- Verified: `/probee.js` → 200; headless DOM-stub test 9/9
  (panel/iframe/FAB/open/close/toggle/body-class).

### 2.14 Users page shows each user's conversations + times- `frontend/src/pages/Users.tsx`: new “Conversations” column — ▸/▾ expands an inline
  list per user (joined client-side on `session_id` from existing
  `/api/admin/conversations` data): started time, last activity time, question count,
  first question. Users with no chats show “—”. No backend change needed.
- Verified: 3 users join correctly (46/0/8 msgs); endpoints respond in <0.5s.
  (Two `Invoke-RestMethod` calls hung with zero output during testing — same
  PowerShell 5.1 web-cmdlet flakiness seen with SSE reads; httpx proved the API fast.)

### 2.16 MySQL outage fix + MySQL health in Settings
- Symptom: tender queries failed with `Can't connect to MySQL server (WinError 10061)`.
  Cause: Laragon was running but its MySQL (`mysql-8.4.3`, datadir
  `C:/laragon/data/mysql-8.4`) was never started. Fix: launched `mysqld.exe` detached
  with that datadir on :3306 (data intact: 171,819 live tenders). Same lesson as
  Redis: nothing auto-restarts these services — check them first on any DB error.
- `GET /api/admin/health` now also reports `mysql` (+ `mysql_error`): pings the
  `all_tenders` view (`ok` / `empty` / `down`). `SystemHealth.tsx` renders all four
  (PostgreSQL, Redis, LLM, MySQL) with green/red dots and the error text inline.

### 2.17 MLflow eval tracking (separate env + Groq judge + UI)
- Eval env: `D:\Shubh\Projects\AI_Chatbot-eval` (full backend stack + ragas + mlflow +
  langchain-groq). Kept OUT of the serving venv to avoid dependency fights.
- Version hell solved: `ragas==0.2.6` pins numpy 1.26 (no py3.13 wheels) → moved to
  `ragas==0.4.3`; its `llms/base.py` unconditionally imports VertexAI (removed from
  `langchain-community>=0.4`) → guarded that import with try/except in the eval env's
  site-packages (documented hack, re-apply after reinstall).
- `backend/analytics/mlflow_log.py`: lazy-mlflow `log_eval_run()` (params, metric
  means, avg/max latency, prompt text + per-question CSV artifacts) into SQLite store
  `D:\Shubh\Projects\mlflow.db` (MLflow 3.x file store refuses writes — maintenance
  mode). Hooked into `run_evaluation()` after the Postgres commit (best-effort).
- `run_evaluation()` uses a **Groq judge** (`_judge_kwargs()`: ChatGroq +
  HuggingFaceEmbeddings via `LLM_MODEL_FAST`/cached bge-m3) when no `OPENAI_API_KEY`
  is set, since RAGAS defaults need OpenAI.
- Runner: `backend/scripts/run_eval_mlflow.py --name NAME` (run with cwd=`backend/`,
  eval venv). UI: `mlflow ui --backend-store-uri sqlite:///D:/Shubh/Projects/mlflow.db
  --port 5000` → http://127.0.0.1:5000, experiment `probee-rag`.
- Verified: `mlflow-baseline-2` (1 golden Q) FINISHED with params
  (qwen3-27b, top_k 12/4) + metrics (relevancy 0.544, latency 655ms) visible in UI.
  Note: with 1 golden question, near-zero scores (faithfulness 0.0) reflect the tiny
  dataset + judge strictness, not the product — add more golden pairs for real signal.

### 2.15 No context → no answer (deterministic refusal)
- Rule: random/off-topic questions are **refused, never answered from thin air**.
- `rag/pipeline.py`: relevance gate after rerank (always reranks now, so scores are
  uniform). Refuses with kind=`REFUSED` when best rerank < `MIN_RERANK_SCORE` (0.10),
  unless multilingual dense cosine ≥ `MIN_DENSE_SCORE` (0.50) **and** the question
  carries domain terms (`has_domain_terms()` in `rag/generator.py`: EN + Roman Hindi
  + Devanagari vocab, always AND-combined with the dense signal).
- Why two signals (measured): relevant EN rerank top 0.74–1.0 vs random ≤0.004 — but
  the English-trained reranker scores genuine Hinglish as low as 0.0–0.07, while
  multilingual bge-m3 dense cosine separates them (genuine Hinglish 0.51–0.59 vs
  random ≤0.44). A pure rerank threshold would wrongly refuse Hinglish.
- Refusal text per language (`REFUSAL_ANSWERS`), no LLM call, cached like answers.
  Greetings, CONTACT answers and the tender path bypass the gate.
- Verified 8/8 matrix: cricket/joke/mausam → refused (right language); GeM-register,
  sarkari-tender (Hinglish), find-tenders (EN) → answered; namaste → intro;
  mobile number → contact answer.

---

## 3. File-by-file guide (which file does what)

### 3.1 `backend/` — FastAPI API + RAG brain (Python 3.13 venv)
| File | Role |
|---|---|
| `main.py` | App entrypoint. FastAPI app, CORS, all routers under **`/api/*`**, `/health`, model warmup on `lifespan`, plus **frontend hosting**: `/assets` static + `index.html` SPA fallback at `/`, `/admin`, `/admin/{path}` (chatbot at `/`, admin SPA at `/admin/*`). |
| `config.py` | `Settings` (pydantic-settings, reads `backend/.env`): Postgres URL, Groq LLM key/model (`qwen/qwen3.8-27b`), embedding/reranker model names, TOP_K retrieval knobs, Redis URL, `ADMIN_USERNAME` + `ADMIN_TOKEN` (dashboard login), CORS origins, MySQL tender-DB credentials. |
| `models.py` | Loads **BGE-M3 embedder** (`SentenceTransformer`) and **BGE reranker** (`CrossEncoder`) **once per process** on CPU (`torch.set_num_threads(4)`, grad disabled). |
| `api/chat.py` | `POST /api/chat` — streaming SSE endpoint. Ensures a `Conversation` row, runs `rag_pipeline()`, saves user + assistant messages with latency/cost metadata, writes to Redis cache. |
| `api/ingest.py` | `POST /api/ingest` — file/text ingestion entrypoint (loader → chunker → embed → Postgres). |
| `api/admin.py` | `/api/admin/*` (username+password guarded via HTTP Basic): document CRUD + upload (`/documents/upload`, `/create-text`, `/{id}/reembed`, chunk edit/delete), conversations, feedback, cost, storage, users, health, and **system-prompt get/set/reset** (`/prompt`). |
| `api/metrics.py` | `/api/admin/metrics/*`: `overview`, `timeseries`, `latency`, `top-questions`, `unanswered` — powers dashboard charts. |
| `api/feedback.py` | `POST /api/feedback` — 👍/👎 (+comment) on a message, stored in `feedback`. |
| `api/eval.py` | `/api/admin/eval/*` — golden Q&A set CRUD + eval runs/results (RAG quality tracking). |
| `api/users.py` | `POST /api/user/register` — visitor lead capture (name + 10-digit phone, upsert on phone). |
| `rag/pipeline.py` | `rag_pipeline()` orchestrator: SQL-injection guard → Redis exact-match cache → **CONTACT short-circuit** → greeting fast-path → **tender-DB path** (MySQL text-to-SQL) → hybrid retrieval → rerank → streaming generation. |
| `rag/retriever.py` | Hybrid retrieval from Postgres: **dense pgvector cosine (HNSW)** + **sparse BM25-style full-text**, fused with **RRF**. |
| `rag/reranker.py` | Cross-encoder rerank of top candidates down to `TOP_K_RERANK` (4). |
| `rag/generator.py` | Prompt building + answer streaming: trilingual `detect_language()`, greeting/general/context branches, `DEFAULT_SYSTEM_PROMPT` + get/set/reset, email+phone `CONTACT_LINES` footer appended to every LLM answer, `wants_contact()` + deterministic `answer_contact()`. |
| `rag/llm_client.py` | Async streaming client for the **Groq OpenAI-compatible** chat-completions API (`httpx`, retries). |
| `rag/router.py` / `rag/query_rewrite.py` | Query routing + normalization/rewrite helpers for retrieval. |
| `tenders/mysql.py` | Read-only MySQL access: connection, auto-creates the `all_tenders` view (`live_tenders ∪ fresh_tenders`), `format_row()` maps DB rows to chat-table fields. |
| `tenders/text_to_sql.py` | Tender intent detection (`is_tender_query`), NL→SQL generation, count messages, result formatting, email+phone footers, SQL-rejection guard. |
| `ingestion/loader.py` | `load_file()` — extracts text from PDF/DOCX/HTML/MD/TXT uploads. |
| `ingestion/chunker.py` | Chunking strategies (`auto/markdown/fixed/pages/paragraphs/sentences/json/semantic`, overlap controls) + `list_strategies()` for the dashboard. |
| `db/postgres.py` | Async SQLAlchemy engine (`asyncpg`, pool 10+20) + `AsyncSessionLocal` / `get_db()`. |
| `db/models.py` | ORM models: `Document`, `Chunk` (`Vector(1024)` embedding), `Conversation`, `Message` (+latency/cost/cache/kind columns), `Feedback`, `Unanswered`, eval tables, `metrics_snapshots`, `User`. |
| `db/schema.sql` | Authoritative DDL: `vector`/`uuid-ossp`/`pg_trgm` extensions, all tables, **HNSW cosine index**, GIN full-text + trigram indexes. |
| `db/redis_client.py` | Async Redis cache (`rag:qa:<tenant>:<sha>` keys, TTL 3600); all failures swallowed → degrades gracefully without Redis. |
| `db/faq_probee.md` | Seed FAQ knowledge source (also ingested as chunks). |
| `analytics/{queries,cost,evals}.py` | SQL aggregations behind metrics/cost/eval endpoints. |
| `scripts/{benchmark,rebuild_embeddings}.py` | Perf benchmark + full re-embed utility. |
| `.env` / `.env.example` | Local secrets (Postgres, Groq key, HF cache, admin username+password, CORS, MySQL). |

### 3.2 `frontend/` — chatbot + admin console (React 18 + TS + Vite 5, flat layout)
| File | Role |
|---|---|
| `src/App.tsx` | Public `/` → `ChatbotDemo` (no login); `/admin/*` → username+password `AdminApp` shell with nested admin routes. |
| `src/components/ChatWidget.tsx` / `.css` | Embeddable React chatbot: greeting, streaming `/api/chat` (SSE reader), typing indicator, safe rich-text, source chips, session id, Enter-to-send. `apiBase` prop (default same-origin; `VITE_API_URL` in demo page). |
| `src/pages/ChatbotDemo.tsx` / `.css` | Public full-page chatbot (ProBee hero + widget + contact footer) — this is what other sites iframe. |
| `src/api.ts` | All admin backend calls under `/api/admin/...`, HTTP Basic (`ADMIN_USERNAME`:`ADMIN_TOKEN`) from localStorage; Vite dev-server proxies `/api` (+ `/health`) → :8000. |
| `src/pages/` | `Overview` (stats), `Documents` (upload/list/re-embed), `Prompt` (system-prompt editor), `Conversations`, `Users` (leads), `Evaluations` (golden sets + runs), `Cost`, `Settings`. |
| `src/components/` | Charts/cards/tables/modals (`LatencyChart`, `LineChart`, `StatCard`, `DocumentTable`, `UploadModal`, `ConversationList`, `EvalPanel`, `SystemHealth`, `StoragePanel`, `Sidebar`, `icons`). |
| `vite.config.ts` | Dev server :5173 + API proxy; `package.json` scripts: `dev / build / preview`. |

### 3.3 Legacy `frontend/widget/` — REMOVED
The vanilla-JS widget (`chat-widget.js`, `chat-ui.*`, `widget-test.html`) was fully
ported to React (`ChatWidget.tsx` + `serviceMenus.ts` + `ChatbotDemo.tsx`) and the
folder was deleted, along with the `/widget` mount in `backend/main.py`. New embeds
use `<iframe src="https://your-domain/">` (the React demo page calling `/api/chat`).

### 3.4 `deploy/` + root files
| File | Role |
|---|---|
| `deploy/setup-vm.sh` | VPS provisioner: system packages → venv → CPU torch → requirements → `npm ci && npm run build` → starts single uvicorn on :8000 (no reverse proxy). |
| `deploy/README.md` | VPS runbook: routes table (`/`, `/admin`, `/api`, `/health`), upload, env, DB loads, Cloudflare HTTPS, iframe embed snippet, troubleshooting. |
| `.gitignore` | Excludes `venv/`, `node_modules/`, `.env`, model caches, logs. |

---

## 4. Why this tech stack

| Choice | Why it fits here |
|---|---|
| **FastAPI + Uvicorn (async Python)** | The workload is I/O-bound (DB + streaming LLM). `async/await` keeps hundreds of concurrent SSE chat streams cheap on one process; FastAPI adds request validation (Pydantic), auto `/docs`, and simple `APIRouter` modularity (`chat/ingest/admin/…`). |
| **PostgreSQL + pgvector (one database)** | Avoids running a separate vector DB: relational data (docs, conversations, messages, feedback, evals) and 1024-dim embeddings live together with **ACID + JOINs**. `HNSW` index = fast approximate cosine search; `pg_trgm` + `tsvector` GIN indexes give typo-tolerant and full-text sparse retrieval in the same query — exactly what hybrid (dense + BM25 + RRF) retrieval needs. |
| **SQLAlchemy 2.0 async + asyncpg** | Type-safe ORM (`db/models.py`) over the async Postgres driver, connection pooling (10+20) matched to FastAPI's event loop — no blocking DB calls stalling chat streams. |
| **Redis (exact-match QA cache)** | Repeat questions (“timings?”, greetings) return in ~0 ms without burning LLM tokens or GPU/CPU embedding work. Keyed by normalized-question hash per tenant, TTL 3600; client code swallows errors so the app runs even with Redis down. |
| **MySQL `probid` (read-only, text-to-SQL)** | The tender data already lives in MySQL (1.7L+ live tenders). Instead of migrating it, the pipeline detects tender intent and generates SQL against the `all_tenders` view — fresh data with zero duplication/sync lag. |
| **BGE-M3 embeddings (1024-d, self-hosted)** | Multilingual (English/Hindi) single model with strong retrieval quality; runs on CPU so there is **no per-query embedding API cost or data-leaving-premises** concern. |
| **BGE reranker (CrossEncoder)** | Bi-encoder recall is broad; a cross-encoder re-scores query↔chunk pairs jointly for precision, letting the final context be just 4 chunks → smaller prompts, cheaper/faster LLM calls, fewer hallucinations. |
| **Groq (OpenAI-compatible) + Qwen 27B** | Hosted inference fast enough for token streaming with a free tier — no GPU server to buy/manage; OpenAI-compatible API keeps the door open to swap providers without code changes (`LLM_BASE_URL`). Tenacity/httpx add retries/timeouts. |
| **Torch CPU-only** | Dev/VM hosts have no GPU; the CPU wheel is ~200 MB vs multi-GB CUDA — faster installs, lower RAM, and embedding/rerank latency is acceptable for this scale. |
| **React + TypeScript + Vite (chatbot AND dashboard)** | One codebase serves both surfaces: the public chatbot (`/`) and the ops console (`/admin/*`). React Query + Recharts cover data/metrics; Vite gives instant HMR, a dev proxy (`/api` → backend), and a static `dist/` the backend serves directly — which is exactly why **no nginx is needed**: one uvicorn process hosts API + chatbot + admin. TS catches API-shape drift. |
| **Vanilla-JS iframe widget (legacy)** | The original embed path, kept for already-embedded sites; new embeds should iframe the React chatbot at `/`. |
| **Pydantic-settings + `.env`** | Twelve-factor config: same image runs locally vs VM by swapping env (DB hosts, Groq key, admin username+password, CORS origins). |
| **SlowAPI + HTTP Basic admin auth** | Rate-limits public endpoints; compulsory `ADMIN_USERNAME` + `ADMIN_TOKEN` password gates all `/api/admin/*` surfaces (constant-time compare, no token-only bypass). |
| **Ingestion libs (pypdf, python-docx, bs4, langchain-text-splitters)** | Real-world knowledge arrives as PDF handbooks, Word docs, HTML and Markdown — each needs its own extractor, then strategy-aware chunking (markdown-aware splitting preserves headings/tables for better retrieval). |
| **No reverse proxy (by design)** | The backend serves `/assets` + SPA fallback itself, and all APIs live under `/api/*` so they never collide with the `/` chatbot or `/admin/*` pages. One process, one port (8000) → trivial VPS setup; HTTPS is delegated to Cloudflare in front. `deploy/setup-vm.sh` is the repeatable VPS path. |

---

## 5. Run it locally (cheat-sheet)

```powershell
# Databases (must be up): Postgres :5432 (ragdb), MySQL :3306 (probid), Redis :6379 (optional)
# Backend (from backend/):
..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
# Frontend (from frontend/):
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

- Routes: chatbot `/` (public) · admin `/admin` (username + password from `backend/.env`) · API `/api/*` · health `/health` · docs `/docs`.
- After frontend changes: `npm run build` in `frontend/` (backend serves `dist/`), then restart backend.
- Rebuild envs: `python -m venv venv` + `pip install --index-url https://download.pytorch.org/whl/cpu torch`
  then `pip install -r backend/requirements.txt`; `npm ci` in `frontend/`.
- If answers look stale after prompt edits: clear Redis `rag:qa:*` keys (TTL is 1h) or wait for expiry.
- Other sites embed the chatbot as `<iframe src="https://your-domain/" width="400" height="620"></iframe>`.
- Run logs for this session: `C:\Users\Admin\AppData\Local\Temp\opencode\rag-run\`
  (`pip.log`, `npm.log`, `backend.log`, `vite.log`, helper scripts).
