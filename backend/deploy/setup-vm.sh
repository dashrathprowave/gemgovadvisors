#!/usr/bin/env bash
# Bootstrap the stack on a fresh Linux VPS (Ubuntu).
#
# Layout on the VPS (same as the repo):
#   <APP_DIR>/backend/    FastAPI chatbot API (uvicorn :8000, managed by pm2)
#   <APP_DIR>/frontend/   Next.js site (built artifact or `npm run build`)
#
# The backend is API-only: the chatbot widget + admin panel live in the
# Next.js frontend, which proxies to the backend same-origin.
#
# Run as:  bash setup-vm.sh /opt/gemgovadvisor
set -euo pipefail

APP_DIR="${1:-/opt/gemgovadvisor}"
cd "$APP_DIR"

echo "== 1/5  System packages (python, node, postgres, mysql, redis) =="
sudo apt-get update -y
sudo apt-get install -y python3.13 python3.13-venv nodejs npm \
  postgresql postgresql-contrib redis-server mysql-server
# Postgres ALSO needs the pgvector extension for backend/db/schema.sql:
#   sudo apt-get install -y postgresql-16-pgvector   # match your PG major version

echo "== 2/5  Preparing backend/.env =="
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo ">>> CREATED backend/.env FROM TEMPLATE. STOP AND EDIT IT:"
  echo "    nano $APP_DIR/backend/.env"
  echo "    (set DATABASE_URL, LLM_API_KEY, ADMIN_USERNAME, ADMIN_TOKEN, REDIS_URL, MySQL creds, CORS_ORIGINS)"
  exit 1
fi

echo "== 3/5  Postgres schema (run once) =="
# Assumes the rag user/db already created; applies extensions + tables.
# sudo -u postgres psql -c "CREATE USER rag WITH PASSWORD '...'; CREATE DATABASE ragdb OWNER rag;"
# sudo -u postgres psql -d ragdb -f backend/db/schema.sql        # needs pgvector installed
# sudo -u postgres psql -d ragdb -f backend/db/users-table.sql   # lead-capture table

echo "== 4/5  Python env =="
python3.13 -m venv backend/venv
backend/venv/bin/pip install --upgrade pip
backend/venv/bin/pip install --index-url https://download.pytorch.org/whl/cpu torch
backend/venv/bin/pip install -r backend/requirements.txt

echo "== 5/5  Starting API (pm2 keeps it alive across reboots) =="
cd backend
pm2 start "$APP_DIR/backend/venv/bin/python" --name "chatbot-backend" -- -m uvicorn main:app --host 0.0.0.0 --port 8000
pm2 save
cd "$APP_DIR"

echo ">> Waiting for http://127.0.0.1:8000/health ..."
echo "   (first boot downloads ~3 GB of embedding models — can take 10+ minutes)"
for i in $(seq 1 90); do
  if curl -sf -m 5 http://127.0.0.1:8000/health >/dev/null 2>&1; then
    IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    echo ">>> API HEALTH : http://${IP:-<your-public-ip>}:8000/health"
    echo ">>> API DOCS   : http://${IP:-<your-public-ip>}:8000/docs"
    echo ">>> ADMIN PANEL: served by the Next.js frontend at /admin (not by the backend)"
    echo ">>> CHAT WIDGET: served by the Next.js frontend (proxies to this API same-origin)"
    exit 0
  fi
  sleep 10
done

echo ">>> Timed out waiting for /health. Debug with:"
echo "    pm2 logs chatbot-backend --lines 50"
