import { access, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// Project root derived from this file's location, so the loader works no matter
// where it is invoked from.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = pathToFileURL(path.join(ROOT, "src") + path.sep).href;

async function exists(url) {
  try {
    await access(fileURLToPath(url));
    return true;
  } catch {
    return false;
  }
}

// The bundler resolves extensionless specifiers; plain Node ESM does not, so
// try the common shapes before giving up.
async function withExtension(url) {
  for (const candidate of [url, `${url}.js`, `${url}.mjs`, `${url}/index.js`]) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // `@/lib/seo` -> <root>/src/lib/seo.js
  if (specifier.startsWith("@/")) {
    const resolved = await withExtension(new URL(specifier.slice(2), SRC).href);
    if (resolved) return { url: resolved, shortCircuit: true };
    throw new Error(`alias-loader: cannot resolve "${specifier}" under src/`);
  }

  // Relative extensionless imports such as `./db` (Next allows them, Node does not).
  if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith("file:")) {
    const base = new URL(specifier, context.parentURL).href;
    const resolved = await withExtension(base);
    if (resolved && resolved !== base) return { url: resolved, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}

// src/*.js is written for the bundler: ESM syntax, but package.json has no
// "type": "module". Force module parsing so plain Node can import it.
export async function load(url, context, nextLoad) {
  if (url.startsWith(SRC) && url.endsWith(".js")) {
    const source = await readFile(fileURLToPath(url), "utf8");
    return { format: "module", source, shortCircuit: true };
  }
  return nextLoad(url, context);
}
