/**
 * Creates the database tables from db/schema.sql.
 *
 *   npm run db:setup
 *
 * Reads credentials from .env.local (or the real environment on the server).
 * Safe to run more than once — the schema uses CREATE TABLE IF NOT EXISTS.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { loadEnv } from "./load-env.mjs";
import { mysqlConfig, describeTarget, explainDbError } from "./db-config.mjs";

const root = process.cwd();


async function main() {
  await loadEnv();

  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

  if (!(MYSQL_HOST || process.env.MYSQL_SOCKET) || !MYSQL_USER || !MYSQL_DATABASE) {
    console.error(
      "\nMissing database settings.\n" +
        "Copy .env.example to .env.local and fill in MYSQL_HOST, MYSQL_USER,\n" +
        "MYSQL_PASSWORD and MYSQL_DATABASE, then run this again.\n"
    );
    process.exit(1);
  }

  const schema = await readFile(path.join(root, "db", "schema.sql"), "utf8");

  const connection = await mysql.createConnection(mysqlConfig({ multipleStatements: true }));

  try {
    await connection.query(schema);

    const [tables] = await connection.query(
      "SELECT TABLE_NAME AS name FROM information_schema.TABLES " +
        "WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('registrations','leads') ORDER BY TABLE_NAME",
      [MYSQL_DATABASE]
    );

    console.log(`\nConnected to "${MYSQL_DATABASE}" on ${describeTarget()}`);
    for (const { name } of tables) {
      const [[{ count }]] = await connection.query(
        `SELECT COUNT(*) AS count FROM \`${name}\``
      );
      console.log(`  ✓ ${name} — ready (${count} row${count === 1 ? "" : "s"})`);
    }
    console.log("\nDatabase is ready.\n");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("\nDatabase setup failed.\n");
  console.error(explainDbError(error) + "\n");
  process.exit(1);
});
