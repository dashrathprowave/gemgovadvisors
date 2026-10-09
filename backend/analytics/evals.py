"""
RAGAS evaluation runner.
Compares generated answers against ground truth on a golden test set.
"""
import asyncio
import os
import time, logging
from sqlalchemy import select, text as sql_text
from sqlalchemy.ext.asyncio import AsyncSession

from db.postgres import AsyncSessionLocal
from db.models import GoldenQA, EvalRun, EvalResult
from rag.pipeline import rag_pipeline

log = logging.getLogger(__name__)


def _judge_kwargs() -> dict:
    """RAGAS judge LLM: prefer free Groq when no OpenAI key is configured."""
    if os.environ.get("OPENAI_API_KEY"):
        return {}
    try:
        from langchain_groq import ChatGroq
        from langchain_community.embeddings import HuggingFaceEmbeddings
        from ragas.llms import LangchainLLMWrapper
        from ragas.embeddings import LangchainEmbeddingsWrapper
        from config import settings

        key = os.environ.get("GROQ_API_KEY") or settings.LLM_API_KEY
        llm = LangchainLLMWrapper(ChatGroq(
            model=settings.LLM_MODEL_FAST, api_key=key, temperature=0,
        ))
        emb = LangchainEmbeddingsWrapper(HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
        ))
        log.info("[eval] using Groq judge: %s", settings.LLM_MODEL_FAST)
        return {"llm": llm, "embeddings": emb}
    except Exception as e:
        log.warning("[eval] Groq judge unavailable, using RAGAS defaults: %s", e)
        return {}


async def run_evaluation(
    run_name: str,
    dataset_name: str = "default",
    tenant_id: str = "default",
    metrics: list[str] | None = None,
) -> dict:
    """
    Execute evaluation:
    1. Load golden Q/A pairs from Postgres
    2. Run each question through the RAG pipeline
    3. Compute RAGAS metrics
    4. Store results + summary
    """
    from ragas import evaluate, EvaluationDataset, SingleTurnSample
    from ragas.metrics import (
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall,
        answer_correctness,
    )

    async with AsyncSessionLocal() as db:
        # 1. Load golden set
        golden = (await db.execute(
            select(GoldenQA).where(GoldenQA.tenant_id == tenant_id)
        )).scalars().all()
        if not golden:
            return {"status": "failed", "error": "no golden QA pairs"}

        # 2. Create eval run record
        run = EvalRun(
            name=run_name,
            dataset_name=dataset_name,
            total_questions=len(golden),
            status="running",
        )
        db.add(run)
        await db.commit()
        await db.refresh(run)

        log.info(f"[eval] {run_name}: {len(golden)} questions")

        # 3. Generate answers
        samples = []
        raw_rows = []
        for i, g in enumerate(golden):
            t0 = time.perf_counter()
            result = await rag_pipeline(g.question, [], tenant_id, db)

            answer = ""
            async for tok in result["answer_gen"]:
                answer += tok

            latency_ms = int((time.perf_counter() - t0) * 1000)

            contexts = [s.get("title", "") for s in result.get("sources", [])]
            # We don't have full chunk text here; fetch it
            # For brevity, using source titles. Improve by joining chunks.
            samples.append(SingleTurnSample(
                user_input=g.question,
                response=answer,
                retrieved_contexts=contexts,
                reference=g.ground_truth,
            ))
            raw_rows.append({
                "question": g.question,
                "answer": answer,
                "ground_truth": g.ground_truth,
                "contexts": contexts,
                "latency_ms": latency_ms,
            })
            log.info(f"[eval] {i+1}/{len(golden)} done")

        # 4. RAGAS evaluate
        dataset = EvaluationDataset(samples=samples)
        use_metrics = metrics or [
            "faithfulness", "answer_relevancy",
            "context_precision", "context_recall", "answer_correctness"
        ]
        metric_objs = {
            "faithfulness": faithfulness,
            "answer_relevancy": answer_relevancy,
            "context_precision": context_precision,
            "context_recall": context_recall,
            "answer_correctness": answer_correctness,
        }
        chosen = [metric_objs[m] for m in use_metrics if m in metric_objs]

        log.info("[eval] running RAGAS...")
        judge = _judge_kwargs()
        try:
            report = evaluate(
                dataset=dataset,
                metrics=chosen,
                raise_exceptions=False,
                **judge,
            )
        except TypeError:
            log.warning("[eval] ragas evaluate() rejected llm/embeddings kwargs, retrying plain")
            report = evaluate(
                dataset=dataset,
                metrics=chosen,
                raise_exceptions=False,
            )

        # 5. Store results
        df = report.to_pandas()
        for i, row in enumerate(raw_rows):
            r = df.iloc[i] if i < len(df) else {}
            db.add(EvalResult(
                run_id=run.id,
                question=row["question"],
                ground_truth=row["ground_truth"],
                answer=row["answer"],
                contexts=row["contexts"],
                faithfulness=_f(r, "faithfulness"),
                answer_relevancy=_f(r, "answer_relevancy"),
                context_precision=_f(r, "context_precision"),
                context_recall=_f(r, "context_recall"),
                answer_correctness=_f(r, "answer_correctness"),
                latency_ms=row["latency_ms"],
            ))

        # Summary
        summary = {}
        for m in use_metrics:
            col = df.get(m)
            if col is not None:
                summary[m] = float(col.mean(skipna=True))

        run.status = "completed"
        run.summary = summary
        run.finished_at = sql_text("NOW()")
        await db.commit()

        # MLflow tracking (best-effort — Postgres results are the record;
        # MLflow is the experiment/comparison layer).
        try:
            from analytics.mlflow_log import log_eval_run
            from rag.generator import get_system_prompt
            from config import settings

            cfg = {
                "llm_model": settings.LLM_MODEL,
                "llm_model_fast": settings.LLM_MODEL_FAST,
                "embedding_model": settings.EMBEDDING_MODEL,
                "embedding_dim": settings.EMBEDDING_DIM,
                "rerank_model": settings.RERANK_MODEL,
                "top_k_dense": settings.TOP_K_DENSE,
                "top_k_sparse": settings.TOP_K_SPARSE,
                "top_k_hybrid": settings.TOP_K_HYBRID,
                "top_k_rerank": settings.TOP_K_RERANK,
                "rrf_k": settings.RRF_K,
                "llm_temperature": settings.LLM_TEMPERATURE,
                "llm_max_tokens": settings.LLM_MAX_TOKENS,
                "min_rerank_score": settings.MIN_RERANK_SCORE,
                "min_dense_score": settings.MIN_DENSE_SCORE,
            }
            await asyncio.to_thread(
                log_eval_run,
                run_name, dataset_name, summary, raw_rows, cfg,
                get_system_prompt(), str(run.id),
            )
        except Exception as e:
            log.warning("[mlflow] hook failed: %s", e)

        return {
            "run_id": str(run.id),
            "status": "completed",
            "summary": summary,
            "questions": len(golden),
        }


def _f(row, key):
    try:
        v = row.get(key)
        return float(v) if v is not None and v == v else None  # NaN check
    except Exception:
        return None