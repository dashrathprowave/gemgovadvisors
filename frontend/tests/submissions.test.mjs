import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

// The database must look unconfigured so the file fallback is what gets
// exercised — CI has no MySQL, but a developer machine might export these.
for (const key of [
  "MYSQL_HOST",
  "MYSQL_SOCKET",
  "MYSQL_USER",
  "MYSQL_DATABASE",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
]) {
  delete process.env[key];
}

// The app resolves data/ from the working directory when the module loads, so
// switch cwd into a temp folder first — the real customer-data folder is never
// touched by tests. Node runs each test file in its own process, so the cwd
// change stays contained to this file.
const originalCwd = process.cwd();
const dataDir = await mkdtemp(path.join(tmpdir(), "gem-submissions-"));
process.chdir(dataDir);

const { recordSubmission } = await import("@/lib/submissions");

// The fallback writes to <cwd>/data/<file>.
const fallbackFile = path.join(dataDir, "data", "test-leads.jsonl");

after(async () => {
  process.chdir(originalCwd);
  await rm(dataDir, { recursive: true, force: true });
});

/** Submit with the database down: the file layer must catch it. */
function submit(name) {
  return recordSubmission({
    table: "leads",
    file: "test-leads.jsonl",
    record: { name, email: `${name}@example.com` },
    subject: `Test ${name}`,
    heading: "Test lead",
    intro: "Intro",
    rows: (record) => [["Name", record.name]],
    replyTo: undefined,
  });
}

test("a submission with no database falls back to the data file", async () => {
  const result = await submit("fallback-case");

  assert.equal(result.ok, true, "the fallback must keep the lead");
  assert.equal(result.stored, false);
  assert.equal(result.id, null);

  const written = await readFile(fallbackFile, "utf8");
  const last = JSON.parse(written.trim().split("\n").at(-1));
  assert.equal(last.name, "fallback-case");
  assert.ok(last.submittedAt, "the timestamp must be recorded");
});

test("repeated failures append instead of overwriting", async () => {
  await submit("second");

  const lines = (await readFile(fallbackFile, "utf8")).trim().split("\n");
  assert.equal(lines.length, 2);
});

test("when every layer fails the caller is told", async () => {
  const result = await recordSubmission({
    table: "leads",
    file: null, // force the file write to throw
    record: { name: "doomed" },
    subject: "s",
    heading: "h",
    intro: "i",
    rows: () => [],
    replyTo: undefined,
  });

  assert.equal(result.ok, false);
  assert.equal(result.stored, false);
  assert.equal(result.emailed, false);
});
