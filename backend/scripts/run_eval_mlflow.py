"""Run a RAG evaluation (golden set -> Postgres + MLflow) from the eval env.

Usage (from the project backend/ dir, with the eval venv active):
    python scripts/run_eval_mlflow.py [--name NAME] [--tenant TENANT]

Results land in Postgres (eval_runs/eval_results, visible in /admin Evaluations)
AND in MLflow (params, metric means, prompt text, per-question CSV).
View them with:  mlflow ui --port 5000
"""
import argparse
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="mlflow-baseline")
    ap.add_argument("--tenant", default="default")
    ap.add_argument("--dataset", default="default")
    args = ap.parse_args()

    os.environ.setdefault(
        "MLFLOW_TRACKING_URI",
        "sqlite:///" + os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "mlflow.db",
        ),
    )

    from analytics.evals import run_evaluation

    out = await run_evaluation(
        run_name=args.name,
        dataset_name=args.dataset,
        tenant_id=args.tenant,
    )
    print("EVAL-RESULT:", out)


if __name__ == "__main__":
    asyncio.run(main())
