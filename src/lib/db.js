import mysql from "mysql2/promise";

// Only these tables may be written to. The table name goes into the SQL string
// (it cannot be a bound parameter), so it must never come from request data.
const WRITABLE_TABLES = new Set(["registrations", "leads"]);

const COLUMN_NAME = /^[a-z_]+$/;

export function isConfigured() {
  const target = process.env.MYSQL_SOCKET || process.env.MYSQL_HOST;
  return Boolean(target && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

// Next.js re-evaluates modules on hot reload in development; caching the pool on
// globalThis keeps every reload from opening another set of connections.
const globalForDb = globalThis;

export function getPool() {
  if (!isConfigured()) return null;

  if (!globalForDb.__gemAdvisorPool) {
    // A mounted unix socket wins over TCP: panels that run the site in a
    // container often expose MySQL only that way, with no port reachable from
    // inside the container.
    const target = process.env.MYSQL_SOCKET
      ? { socketPath: process.env.MYSQL_SOCKET }
      : { host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306) };

    globalForDb.__gemAdvisorPool = mysql.createPool({
      ...target,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 5),
      charset: "utf8mb4_unicode_ci",
      // Store and read timestamps as UTC so the value does not shift with the
      // server's locale.
      timezone: "Z",
      enableKeepAlive: true,
    });
  }

  return globalForDb.__gemAdvisorPool;
}

/**
 * Inserts one row and returns its id.
 *
 * Values are always bound as parameters, so form input cannot alter the query.
 * Returns `{ ok: false, reason }` rather than throwing when the database simply
 * is not configured — the caller decides whether that is fatal.
 */
export async function insertRow(table, record) {
  if (!WRITABLE_TABLES.has(table)) throw new Error(`Refusing to write to unknown table: ${table}`);

  const pool = getPool();
  if (!pool) return { ok: false, reason: "not_configured" };

  const entries = Object.entries(record).filter(([, value]) => value !== undefined);
  if (entries.length === 0) throw new Error("Nothing to insert");

  const columns = entries.map(([column]) => {
    if (!COLUMN_NAME.test(column)) throw new Error(`Invalid column name: ${column}`);
    return `\`${column}\``;
  });

  const sql =
    `INSERT INTO \`${table}\` (${columns.join(", ")}) ` +
    `VALUES (${entries.map(() => "?").join(", ")})`;

  const [result] = await pool.execute(
    sql,
    entries.map(([, value]) => value)
  );

  return { ok: true, id: result.insertId };
}

/** Verifies the credentials actually work. Used by `npm run db:check`. */
export async function ping() {
  const pool = getPool();
  if (!pool) return { ok: false, reason: "not_configured" };
  const [rows] = await pool.query("SELECT VERSION() AS version");
  return { ok: true, version: rows[0].version };
}
