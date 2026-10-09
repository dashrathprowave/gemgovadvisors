/**
 * Exports stored enquiries to CSV files you can open in Excel.
 *
 *   npm run db:export                 -> exports both tables into ./exports
 *   npm run db:export registrations   -> just that one
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { loadEnv } from "./load-env.mjs";
import { mysqlConfig } from "./db-config.mjs";

const TABLES = ["registrations", "leads"];

function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);

  const cell = (value) => {
    if (value === null || value === undefined) return "";
    const text = value instanceof Date ? value.toISOString() : String(value);
    // Quote whenever the value could otherwise break the column structure.
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [headers.join(","), ...rows.map((row) => headers.map((h) => cell(row[h])).join(","))].join("\r\n");
}

await loadEnv();

const requested = process.argv[2];
const wanted = requested ? [requested] : TABLES;

for (const table of wanted) {
  if (!TABLES.includes(table)) {
    console.error(`Unknown table "${table}". Choose from: ${TABLES.join(", ")}`);
    process.exit(1);
  }
}

const connection = await mysql.createConnection(mysqlConfig());

try {
  const outDir = path.join(process.cwd(), "exports");
  await mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);

  for (const table of wanted) {
    const [rows] = await connection.query(`SELECT * FROM \`${table}\` ORDER BY created_at DESC`);
    const file = path.join(outDir, `${table}-${stamp}.csv`);
    // BOM so Excel opens the rupee sign and accented characters correctly.
    await writeFile(file, "﻿" + toCsv(rows), "utf8");
    console.log(`${String(rows.length).padStart(5)} rows -> ${path.relative(process.cwd(), file)}`);
  }
} finally {
  await connection.end();
}
