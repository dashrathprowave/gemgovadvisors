/**
 * Production entry point. Point the panel's Node.js app at this file, not at
 * server.js.
 *
 * Next's standalone server relies on its own loader to pick up .env.local. That
 * works when you run it by hand, but a panel that starts the process for you can
 * change enough about the environment that it silently does not — and the app
 * then runs with no database and no mail settings while still answering
 * requests, so enquiries quietly fall through to the file fallback.
 *
 * Reading the file here first removes that dependency entirely.
 *
 * Deliberately CommonJS with a .js extension: it has to be startable by any
 * panel, without assuming ESM support or a "type" field in package.json.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;

function loadEnvFile(file) {
  const full = path.join(root, file);
  let text;
  try {
    text = fs.readFileSync(full, "utf8");
  } catch {
    return 0;
  }

  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    // Anything already in the real environment wins, so a value injected by the
    // hosting panel (PORT, for instance) is never clobbered by the file.
    if (match[1] in process.env) continue;
    process.env[match[1]] = match[2].trim().replace(/^["'](.*)["']$/, "$1");
    count += 1;
  }
  return count;
}

const loaded = loadEnvFile(".env.local") + loadEnvFile(".env");

// One line in the panel's log that says whether the app came up able to do its
// job. Names only — never the values.
const db = process.env.MYSQL_SOCKET || process.env.MYSQL_HOST;
console.log(
  `[start] env vars loaded: ${loaded} | ` +
    `database: ${db ? "configured" : "MISSING"} | ` +
    `email: ${process.env.SMTP_HOST ? "configured" : "MISSING"}`
);

if (!db) {
  console.warn(
    `[start] No database settings found. Expected ${path.join(root, ".env.local")} ` +
      "to contain MYSQL_SOCKET (or MYSQL_HOST), MYSQL_USER and MYSQL_DATABASE. " +
      "Enquiries will be written to data/ instead of the database."
  );
}

require("./server.js");
