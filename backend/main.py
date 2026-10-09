
"""
FastAPI application entry point.

API-only mode: wires together CORS, the JSON routers under /api/*
(chat, ingest, feedback, admin, metrics, eval, user) and ML model
warmup on startup. The chatbot widget + admin panel live in the
Next.js frontend, which proxies to this API same-origin.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from models import get_embedder, get_reranker
from api import chat, ingest, feedback, admin, metrics
from api import eval as eval_api
from api import users


# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("rag-api")


# -------------------------------------------------------------------
# Lifespan — warm ML models so first request isn't slow
# -------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("=" * 60)
    log.info("Starting RAG API")
    log.info("=" * 60)

    log.info("Warming embedder: %s", settings.EMBEDDING_MODEL)
    get_embedder()
    log.info("Embedder loaded ✅")

    log.info("Warming reranker: %s", settings.RERANK_MODEL)
    get_reranker()
    log.info("Reranker loaded ✅")

    log.info("Config:")
    log.info("  LLM_MODEL       = %s", settings.LLM_MODEL)
    log.info("  LLM_MODEL_FAST  = %s", settings.LLM_MODEL_FAST)
    log.info("  LLM_URL        = %s", settings.LLM_BASE_URL)
    log.info("  LLM_KEY        = %s", "set" if settings.LLM_API_KEY else "MISSING")
    log.info("  DATABASE_URL    = %s", settings.DATABASE_URL.split("@")[-1])
    log.info("  REDIS_URL       = %s", settings.REDIS_URL)
    log.info("  CORS_ORIGINS    = %s", settings.cors_list)

    log.info("Models ready ✅ — API is live")
    yield

    log.info("Shutting down RAG API")


# -------------------------------------------------------------------
# App
# -------------------------------------------------------------------
app = FastAPI(
    title="Company RAG Bot",
    description="Production RAG chatbot API with Postgres + pgvector, self-hosted LLMs",
    version="1.0.0",
    lifespan=lifespan,
)


# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allow_headers=["*"],
    allow_credentials=False,
    expose_headers=["*"],
)


# -------------------------------------------------------------------
# Routers — all JSON APIs live under /api/*
# -------------------------------------------------------------------
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(ingest.router, prefix="/api", tags=["ingest"])
app.include_router(feedback.router, prefix="/api", tags=["feedback"])
app.include_router(admin.router, prefix="/api", tags=["admin"])
app.include_router(metrics.router, prefix="/api", tags=["metrics"])
app.include_router(eval_api.router, prefix="/api", tags=["eval"])
app.include_router(users.router, prefix="/api", tags=["user"])


# -------------------------------------------------------------------
# Health check
# -------------------------------------------------------------------
@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "service": "rag-api", "version": "1.0.0"}


# -------------------------------------------------------------------
# Root endpoint (API-only mode — no SPA serving)
# -------------------------------------------------------------------
@app.get("/", tags=["system"])
async def root():
    return {
        "service": "GeM Advisor Chatbot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "note": "API-only mode — chatbot widget + admin panel live in the Next.js frontend",
    }