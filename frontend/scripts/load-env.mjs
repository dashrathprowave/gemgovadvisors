import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads .env.local (then .env) into process.env.
 *
 * These scripts run outside Next.js, which is what loads those files for the app
 * itself, so they need their own reader. Values already present in the real
 * environment win, so `MYSQL_PASSWORD=x node scripts/...` still overrides.
 */
export async function loadEnv(dir = process.cwd()) {
  for (const file of [".env.local", ".env"]) {
    let text;
    try {
      text = await readFile(path.join(dir, file), "utf8");
    } catch {
      continue;
    }
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
      if (!(match[1] in process.env)) process.env[match[1]] = value;
    }
  }
}
