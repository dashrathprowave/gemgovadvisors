/**
 * Verifies the database connection and shows how many enquiries are stored.
 *
 *   npm run db:check
 */
import mysql from "mysql2/promise";
import { loadEnv } from "./load-env.mjs";
import { mysqlConfig, describeTarget, explainDbError } from "./db-config.mjs";

await loadEnv();

const { MYSQL_HOST, MYSQL_SOCKET, MYSQL_USER, MYSQL_DATABASE } = process.env;

if (!(MYSQL_HOST || MYSQL_SOCKET) || !MYSQL_USER || !MYSQL_DATABASE) {
  console.error("Database settings missing — copy .env.example to .env.local and fill it in.");
  process.exit(1);
}

let connection;
try {
  connection = await mysql.createConnection(mysqlConfig());

  const [[{ version }]] = await connection.query("SELECT VERSION() AS version");
  console.log(`\nConnected to ${describeTarget()} — MySQL ${version}`);
  console.log(`Database: ${MYSQL_DATABASE}\n`);

  for (const table of ["registrations", "leads"]) {
    try {
      const [[row]] = await connection.query(
        `SELECT COUNT(*) AS total, MAX(created_at) AS latest FROM \`${table}\``
      );
      const latest = row.latest ? new Date(row.latest).toLocaleString("en-IN") : "none yet";
      console.log(`  ${table.padEnd(15)} ${String(row.total).padStart(5)} rows   latest: ${latest}`);
    } catch {
      console.log(`  ${table.padEnd(15)} missing — run: npm run db:setup`);
    }
  }

  const transport =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
      ? `SMTP (${process.env.SMTP_HOST} as ${process.env.SMTP_USER})`
      : "OFF — set SMTP_HOST, SMTP_USER and SMTP_PASSWORD";
  console.log(`\nEmail alerts: ${transport}\n`);
} catch (error) {
  console.error(`\nCould not connect to ${describeTarget()}\n`);
  console.error(explainDbError(error) + "\n");
  process.exit(1);
} finally {
  await connection?.end();
}
