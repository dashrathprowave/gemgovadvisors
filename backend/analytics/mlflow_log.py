"""MLflow tracking for eval runs.

mlflow is imported LAZILY so the API keeps working when it isn't installed —
logging is then skipped with a warning instead of crashing the eval.
"""
import logging
import os

log = logging.getLogger(__name__)

EXPERIMENT = "probee-rag"
# SQLite backend (MLflow 3.x file store is in maintenance mode and refuses writes).
# Lives next to backend/ so it moves with the project; override with the
# MLFLOW_TRACKING_URI env var (see _tracking_uri below).
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_STORE = "sqlite:///" + os.path.join(_BACKEND_DIR, "mlflow.db")


def _tracking_uri() -> str:
    return os.environ.get("MLFLOW_TRACKING_URI", DEFAULT_STORE)


def log_eval_run(
    run_name: str,
    dataset_name: str,
    summary: dict,
    raw_rows: list[dict],
    config: dict,
    prompt_text: str | None = None,
    run_db_id: str | None = None,
) -> str | None:
    """Log one completed eval run. Returns the MLflow run id (or None)."""
    try:
        import mlflow
    except ImportError:
        log.warning("[mlflow] package not installed — skipping MLflow logging")
        return None

    try:
        mlflow.set_tracking_uri(_tracking_uri())
        mlflow.set_experiment(EXPERIMENT)
        with mlflow.start_run(run_name=run_name) as run:
            mlflow.log_params({
                "dataset": dataset_name,
                "questions": len(raw_rows),
                **{k: v for k, v in config.items() if v is not None},
            })
            if run_db_id:
                mlflow.set_tag("db_run_id", run_db_id)
            for key, val in (summary or {}).items():
                try:
                    if val is not None and val == val:  # skip None/NaN
                        mlflow.log_metric(key, float(val))
                except (TypeError, ValueError):
                    continue
            lat = [r.get("latency_ms") for r in raw_rows if r.get("latency_ms")]
            if lat:
                mlflow.log_metric("avg_latency_ms", sum(lat) / len(lat))
                mlflow.log_metric("max_latency_ms", max(lat))
            if prompt_text:
                mlflow.log_text(prompt_text, "system_prompt.txt")
            if raw_rows:
                import csv
                import tempfile

                cols = ["question", "answer", "ground_truth", "latency_ms",
                        "faithfulness", "answer_relevancy", "context_precision",
                        "context_recall", "answer_correctness"]
                fd, tmp = tempfile.mkstemp(suffix=".csv", prefix="per_question_")
                with os.fdopen(fd, "w", newline="", encoding="utf-8") as f:
                    w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
                    w.writeheader()
                    w.writerows(raw_rows)
                mlflow.log_artifact(tmp, "per_question")
                os.remove(tmp)
            log.info("[mlflow] logged run %s", run.info.run_id)
            return run.info.run_id
    except Exception as e:
        log.warning("[mlflow] logging failed (eval results are still in Postgres): %s", e)
        return None
