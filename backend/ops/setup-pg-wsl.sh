#!/bin/bash
set -e

# Listen on all interfaces so Windows (host) can reach :5432
PGCONF=/etc/postgresql/18/main/postgresql.conf
sed -i "s/^#listen_addresses = .*/listen_addresses = '*'/" "$PGCONF"

# Start the cluster (WSL has no systemd — use the init script)
service postgresql start
sleep 2

# Role + database matching backend/.env  (rag / rag123 / ragdb)
su postgres -c "psql -c \"CREATE ROLE rag WITH LOGIN SUPERUSER PASSWORD 'rag123';\"" 2>/dev/null || echo "role 'rag' already exists"
su postgres -c "createdb -O rag ragdb" 2>/dev/null || echo "database 'ragdb' already exists"

# Extensions first (cleaner errors than inside the big schema file)
su postgres -c "psql -d ragdb -c 'CREATE EXTENSION IF NOT EXISTS vector;'"
su postgres -c "psql -d ragdb -c 'CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";'"
su postgres -c "psql -d ragdb -c 'CREATE EXTENSION IF NOT EXISTS pg_trgm;'"

# Full schema (tables, HNSW vector index, views, seed data)
su postgres -c "psql -d ragdb -f '/mnt/d/Prowave/One Page Site/GeMGovAdvisor/backend/backend/db/schema.sql'"

echo "PG-SETUP-DONE"
