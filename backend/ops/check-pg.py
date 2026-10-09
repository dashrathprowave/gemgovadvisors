import asyncio
import asyncpg
import sys

HOST = sys.argv[1] if len(sys.argv) > 1 else "172.23.125.102"


async def main():
    conn = await asyncpg.connect(f"postgresql://rag:rag123@{HOST}:5432/ragdb")
    rows = await conn.fetch(
        "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY 1"
    )
    print("TABLES:", len(rows))
    for r in rows:
        print(" -", r["tablename"])
    v = await conn.fetchval(
        "SELECT extversion FROM pg_extension WHERE extname='vector'"
    )
    print("pgvector version:", v)
    c = await conn.fetchval("SELECT count(*) FROM chunks")
    print("chunks:", c)
    await conn.close()


asyncio.run(main())
