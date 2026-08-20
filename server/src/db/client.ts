import path from 'node:path';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

// better-sqlite3 requires native compilation (node-gyp) and has no prebuilt
// binary for this Node/platform combination in this environment. Node's
// built-in `node:sqlite` module (stable, synchronous, zero-compilation) is
// used instead, bridged into Drizzle via the `sqlite-proxy` driver since
// drizzle-orm does not ship a dedicated `node:sqlite` driver as of the
// latest stable release (checked 0.38.4 and 0.45.2).

const dataDir = path.join(process.cwd(), 'server', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'sih.db');

const sqlite = new DatabaseSync(dbPath);
sqlite.exec('PRAGMA journal_mode = WAL');

// No migration pipeline is wired up for this project (no drizzle.config.ts /
// migrations directory), so the schema is created here directly from DDL
// that mirrors `schema.ts`. Idempotent via IF NOT EXISTS so it's safe to run
// on every process start.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS species_info (
    species_id TEXT PRIMARY KEY NOT NULL,
    scientific_name TEXT NOT NULL,
    common_name TEXT NOT NULL,
    aphia_id INTEGER NOT NULL,
    family TEXT NOT NULL,
    status TEXT NOT NULL,
    thumbnail TEXT
  );

  CREATE TABLE IF NOT EXISTS species_occurrences (
    id TEXT PRIMARY KEY NOT NULL,
    species_id TEXT NOT NULL,
    scientific_name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    h3_cell TEXT NOT NULL,
    date TEXT NOT NULL,
    count INTEGER,
    source TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS species_occurrences_species_id_idx
    ON species_occurrences (species_id);

  CREATE TABLE IF NOT EXISTS ocean_timeseries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    variable TEXT NOT NULL,
    value REAL NOT NULL,
    h3_cell TEXT NOT NULL,
    unit TEXT NOT NULL,
    anomaly REAL
  );
  CREATE INDEX IF NOT EXISTS ocean_timeseries_variable_date_idx
    ON ocean_timeseries (variable, date);
`);

export const db = drizzle(async (sqlText, params, method) => {
  const stmt = sqlite.prepare(sqlText);

  if (method === 'run') {
    stmt.run(...params);
    return { rows: [] };
  }

  if (method === 'get') {
    const row = stmt.get(...params);
    return { rows: row ? (Object.values(row) as unknown[]) : (undefined as unknown as unknown[]) };
  }

  // 'all' and 'values' both expect an array of rows, each row itself an
  // array of column values in select order.
  const rows = stmt.all(...params);
  return { rows: rows.map((row) => Object.values(row as object)) };
}, { schema });
