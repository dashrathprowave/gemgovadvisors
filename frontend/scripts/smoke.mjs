/**
 * Starts the production server and checks the routes that have broken before.
 *
 *   npm run build && npm run smoke
 *
 * Port 3100 because 3000 is usually taken by another dev server.
 */
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.SMOKE_PORT || 3100);
const BASE = `http://127.0.0.1:${PORT}`;
const root = process.cwd();

try {
  await access(path.join(root, ".next", "BUILD_ID"));
} catch {
  console.error("No production build found — run `npm run build` first.");
  process.exit(1);
}

// node.exe plus Next's real JS entrypoint: no shell involved, so a project
// path containing spaces works identically on Windows and Linux.
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const server = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverLog = "";
server.stdout.on("data", (chunk) => (serverLog += chunk));
server.stderr.on("data", (chunk) => (serverLog += chunk));

async function stop() {
  server.kill();
  await new Promise((resolve) => {
    server.once("exit", resolve);
    setTimeout(() => {
      server.kill("SIGKILL");
      resolve();
    }, 5000);
  });
}

// Wait for the server to answer before running the checks.
let ready = false;
for (let i = 0; i < 120 && !ready; i++) {
  if (server.exitCode !== null) break;
  try {
    await fetch(BASE);
    ready = true;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}

if (!ready) {
  console.error("Server did not start:\n" + serverLog);
  await stop();
  process.exit(1);
}

const checks = [
  { route: "/", expect: 200 },
  { route: "/about", expect: 200 },
  { route: "/services", expect: 200 },
  { route: "/services?q=registration", expect: 200 },
  { route: "/register", expect: 200 },
  { route: "/sitemap.xml", expect: 200 },
  { route: "/robots.txt", expect: 200 },
  { route: "/login", expect: 404 },
  { route: "/api/login", expect: 404 },
  { route: "/api/lead", expect: 405 },
  { route: "/api/register", expect: 405 },
];

let failures = 0;

for (const { route, expect } of checks) {
  const response = await fetch(BASE + route, { redirect: "manual" });
  const ok = response.status === expect;
  if (!ok) failures++;
  console.log(`${ok ? "  ok " : "FAIL "} ${String(response.status).padEnd(3)} (expected ${expect})  ${route}`);
}

// The homepage must be our site, not a proxy error page.
const html = await (await fetch(BASE)).text();
const hasBrand = html.includes("GeM");
if (!hasBrand) failures++;
console.log(`${hasBrand ? "  ok " : "FAIL "} homepage contains the brand text`);

await stop();

if (failures) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length + 1} smoke checks passed.`);
process.exit(0);
