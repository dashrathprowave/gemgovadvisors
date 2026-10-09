/**
 * Shared MySQL connection settings and error reporting for the db scripts.
 */

/**
 * Builds the mysql2 connection options.
 *
 * When MYSQL_SOCKET is set the socket wins — panels that run the site in a
 * container often expose MySQL only through a mounted unix socket, with no TCP
 * port reachable from inside that container.
 */
export function mysqlConfig(extra = {}) {
  const base = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE,
    ...extra,
  };

  if (process.env.MYSQL_SOCKET) {
    return { ...base, socketPath: process.env.MYSQL_SOCKET };
  }

  return {
    ...base,
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
  };
}

/** Human-readable description of what we are connecting to. */
export function describeTarget() {
  if (process.env.MYSQL_SOCKET) return `socket ${process.env.MYSQL_SOCKET}`;
  return `${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT || 3306}`;
}

/**
 * Turns a connection failure into something actionable.
 *
 * Node reports a refused connection to a name that resolves to several
 * addresses (localhost -> ::1 and 127.0.0.1) as an AggregateError whose own
 * message is empty, which is why a bare error.message can print as nothing.
 */
export function explainDbError(error) {
  const codes = new Set();
  const collect = (e) => {
    if (!e) return;
    if (e.code) codes.add(e.code);
    if (Array.isArray(e.errors)) e.errors.forEach(collect);
  };
  collect(error);

  const detail =
    error.message || (error.errors || []).map((e) => e.message).filter(Boolean).join("; ") || "no details";

  const lines = [`${[...codes].join(", ") || "error"}: ${detail}`, ""];

  if (codes.has("ECONNREFUSED")) {
    lines.push(
      `Nothing is accepting connections at ${describeTarget()}.`,
      "",
      "On a panel that runs the site in a container this usually means MySQL is",
      "not on the app's own localhost. Check, in order:",
      "  1. ss -tlnp | grep 3306          — is MySQL listening on TCP at all?",
      "  2. ls /run/mysqld /var/run/mysqld — is there a socket instead?",
      "     If so, set MYSQL_SOCKET=/path/to/mysqld.sock in .env.local",
      "  3. The database host shown in your hosting panel — it is often a",
      "     separate hostname, not localhost.",
      "  4. Try MYSQL_HOST=127.0.0.1 instead of localhost — 'localhost' can",
      "     resolve to IPv6 ::1 where MySQL is not listening."
    );
  } else if (codes.has("ER_ACCESS_DENIED_ERROR")) {
    lines.push(
      "The username or password was rejected.",
      "Check MYSQL_USER and MYSQL_PASSWORD, and that the user is allowed to",
      "connect from this host (panels often create user@localhost only)."
    );
  } else if (codes.has("ER_BAD_DB_ERROR")) {
    lines.push(
      `The database "${process.env.MYSQL_DATABASE}" does not exist.`,
      "Create it in the panel first, or check MYSQL_DATABASE for a typo."
    );
  } else if (codes.has("ENOENT")) {
    lines.push(
      `There is no socket file at ${process.env.MYSQL_SOCKET}.`,
      "",
      "Find the right path with:  ls -la /run/mysqld /var/run/mysqld",
      "then correct MYSQL_SOCKET in .env.local."
    );
  } else if (codes.has("ENOTFOUND") || codes.has("EAI_AGAIN")) {
    lines.push(`The hostname "${process.env.MYSQL_HOST}" could not be resolved.`);
  } else if (codes.has("ETIMEDOUT")) {
    lines.push(
      `${describeTarget()} did not respond — a firewall is probably dropping the`,
      "connection, or the host is wrong."
    );
  }

  return lines.join("\n");
}
