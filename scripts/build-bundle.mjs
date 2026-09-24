/**
 * Assembles a ready-to-upload deployment folder.
 *
 *   npm run bundle
 *
 * `output: "standalone"` gives us .next/standalone/server.js, but Next.js does
 * not copy `public/` or `.next/static/` into it — without those the site loads
 * with no CSS and no images. This script does that copy and leaves everything in
 * ./deploy, which is what gets uploaded to the server.
 */
import { cp, rm, mkdir, writeFile, readFile, access, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "deploy");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// Symlinks are dereferenced: Windows cannot recreate them without elevation,
// and an uploaded bundle must not depend on links resolving on the server.
const COPY_OPTS = { recursive: true, dereference: true };

const standalone = path.join(root, ".next", "standalone");
if (!(await exists(standalone))) {
  console.error("\n.next/standalone not found — run `npm run build` first.\n");
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// 1. The server plus its trimmed node_modules.
await cp(standalone, out, COPY_OPTS);

// 2. Client-side JS and CSS.
await cp(path.join(root, ".next", "static"), path.join(out, ".next", "static"), COPY_OPTS);

// 3. Images, icons, robots assets.
if (await exists(path.join(root, "public"))) {
  await cp(path.join(root, "public"), path.join(out, "public"), COPY_OPTS);
}

// 4. The SQL schema, so the database can be set up from the same upload.
if (await exists(path.join(root, "db"))) {
  await cp(path.join(root, "db"), path.join(out, "db"), COPY_OPTS);
}

// 5. The database helper scripts, so setup and checks can be run over SSH on the
// server. These import mysql2, which serverExternalPackages keeps as a real
// package inside the bundled node_modules.
await cp(path.join(root, "scripts"), path.join(out, "scripts"), COPY_OPTS);
// This build tool only makes sense on a dev machine; on the server it would just
// fail confusingly, so it does not travel with the bundle.
await rm(path.join(out, "scripts", "build-bundle.mjs"), { force: true });

// start.js belongs beside server.js, not in scripts/ — it resolves .env.local
// and ./server.js relative to its own directory.
await cp(path.join(root, "scripts", "start.js"), path.join(out, "start.js"), COPY_OPTS);
await rm(path.join(out, "scripts", "start.js"), { force: true });

// Next writes its own minimal package.json into the standalone output. Keep its
// fields but give it a script list that actually works on the server.
const bundledPackagePath = path.join(out, "package.json");
const bundledPackage = JSON.parse(await readFile(bundledPackagePath, "utf8"));
// Replaced, not merged: the project's dev/build/lint/bundle scripts all need the
// Next CLI and dev dependencies, which the bundle deliberately does not carry.
// Advertising them here only produces a confusing "next: not found" on the server.
bundledPackage.scripts = {
  start: "node start.js",
  "db:setup": "node scripts/db-setup.mjs",
  "db:check": "node scripts/db-check.mjs",
  "db:export": "node scripts/db-export.mjs",
  "mail:test": "node scripts/mail-test.mjs",
};
await writeFile(bundledPackagePath, JSON.stringify(bundledPackage, null, 2) + "\n", "utf8");

// 6. Never ship stored enquiries or local secrets, whatever the build traced in.
// next.config.mjs already excludes these, but a deployment bundle is the wrong
// place to find out that something slipped through.
for (const unwanted of ["data", "exports", ".env", ".env.local", ".env.production"]) {
  const target = path.join(out, unwanted);
  if (await exists(target)) {
    await rm(target, { recursive: true, force: true });
    console.warn(`Removed ${unwanted} from the bundle — it must not be deployed.`);
  }
}

// A reminder inside the bundle itself — .env.local is intentionally not copied,
// because secrets should be created on the server, not shipped from a laptop.
await writeFile(
  path.join(out, "READ-ME-FIRST.txt"),
  [
    "Upload the CONTENTS of this folder to your site directory on the server.",
    "",
    "Then, on the server:",
    "  1. Create .env.local next to server.js with the MYSQL_* and SMTP_* values.",
    "  0. Delete the old build first:  rm -rf .next",
    "     Extracting over it leaves server/ and static/ from different builds,",
    "     and the page then asks for CSS files that are not on disk.",
    "",
    "  2. Create the tables:   node scripts/db-setup.mjs",
    "  3. Check it connected:  node scripts/db-check.mjs",
    "  4. Test email:         node scripts/mail-test.mjs",
    "  5. Start the app:       node start.js",
    "     (Enhance: point the Deploy Node.js tool at start.js, NOT server.js)",
    "",
    "The app reads PORT and HOSTNAME from the environment.",
    "Enhance sets PORT itself; set HOSTNAME=0.0.0.0 so its proxy can reach the app.",
    "",
    "Do not upload .env.local from your computer — create it on the server.",
  ].join("\n"),
  "utf8"
);

// A single archive instead of thousands of small files. Uploading .next/static
// file-by-file over FTP or a web file manager routinely drops or truncates a few
// of them, and a missing CSS chunk breaks the whole layout with no obvious cause.
const archive = path.join(root, "deploy.tar.gz");
await rm(archive, { force: true });

// Relative paths on purpose: an absolute Windows path like "D:\..." is read by
// some tar builds as a remote host spec because of the drive-letter colon.
const tar = spawnSync("tar", ["-czf", "deploy.tar.gz", "-C", "deploy", "."], {
  cwd: root,
  stdio: "inherit",
});

console.log(`\nDeployment bundle ready:  ${path.relative(root, out)}`);

if (tar.error || tar.status !== 0) {
  console.log("\n(could not create deploy.tar.gz — tar is unavailable; upload the folder instead)");
  console.log("Upload the CONTENTS of deploy/ to the server, then run `node server.js`.\n");
} else {
  const { size } = await stat(archive);
  console.log(`Single-file archive:      deploy.tar.gz (${(size / 1024 / 1024).toFixed(1)} MB)\n`);
  console.log("Upload deploy.tar.gz to the site directory, then on the server:\n");
  console.log("  rm -rf .next                      # old build must go first");
  console.log("  tar -xzf deploy.tar.gz && rm deploy.tar.gz");
  console.log("  node scripts/db-check.mjs");
  console.log("\nThen RESTART the app in the panel. Until you do, the old build stays");
  console.log("in memory and keeps asking for the previous asset filenames.");
  console.log("\nStartup file for the panel:  start.js   (NOT server.js)");
  console.log("\n(.env.local is not in the archive, so it is left untouched.)\n");
}
