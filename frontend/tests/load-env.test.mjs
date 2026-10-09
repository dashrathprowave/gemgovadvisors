import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadEnv } from "../scripts/load-env.mjs";

const dir = await mkdtemp(path.join(tmpdir(), "gem-env-"));
const empty = await mkdtemp(path.join(tmpdir(), "gem-env-empty-"));

await writeFile(
  path.join(dir, ".env.local"),
  [
    "GEM_TEST_PLAIN=plain-value",
    'GEM_TEST_QUOTED="quoted value"',
    "GEM_TEST_OVERRIDE=from-file",
    "# a comment line",
    "not a valid line",
    "gem_test_lower=ignored",
  ].join("\n"),
  "utf8"
);

// Real environment must win over the file — that is how CI overrides config.
process.env.GEM_TEST_OVERRIDE = "from-environment";

await loadEnv(dir);

after(async () => {
  delete process.env.GEM_TEST_PLAIN;
  delete process.env.GEM_TEST_QUOTED;
  delete process.env.GEM_TEST_OVERRIDE;
  await rm(dir, { recursive: true, force: true });
  await rm(empty, { recursive: true, force: true });
});

test("parses KEY=value lines", () => {
  assert.equal(process.env.GEM_TEST_PLAIN, "plain-value");
});

test("strips one layer of matching quotes", () => {
  assert.equal(process.env.GEM_TEST_QUOTED, "quoted value");
});

test("the real environment wins over the file", () => {
  assert.equal(process.env.GEM_TEST_OVERRIDE, "from-environment");
});

test("ignores comments, junk lines and lowercase keys", () => {
  assert.equal(process.env.gem_test_lower, undefined);
});

test("a directory with no env files resolves without throwing", async () => {
  await loadEnv(empty);
});
