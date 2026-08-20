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

  CREATE TABLE IF NOT EXISTS ocean_grid_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    h3_cell TEXT NOT NULL,
    variable TEXT NOT NULL,
    date TEXT NOT NULL,
    value REAL NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL
  );
  CREATE INDEX IF NOT EXISTS ocean_grid_snapshots_variable_date_idx
    ON ocean_grid_snapshots (variable, date);

  CREATE TABLE IF NOT EXISTS edna_samples (
    sample_id TEXT PRIMARY KEY NOT NULL,
    station_name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    h3_cell TEXT NOT NULL,
    date TEXT NOT NULL,
    shannon_index REAL NOT NULL,
    simpson_index REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS asv_records (
    asv_id TEXT PRIMARY KEY NOT NULL,
    sample_id TEXT NOT NULL,
    taxon TEXT NOT NULL,
    aphia_id INTEGER,
    confidence REAL NOT NULL,
    read_count INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS asv_records_sample_id_idx
    ON asv_records (sample_id);

  CREATE TABLE IF NOT EXISTS otolith_specimens (
    specimen_id TEXT PRIMARY KEY NOT NULL,
    image_color TEXT NOT NULL,
    collected_at TEXT NOT NULL,
    station_name TEXT NOT NULL,
    length_mm REAL NOT NULL,
    status TEXT NOT NULL,
    true_species_id TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otolith_predictions (
    specimen_id TEXT PRIMARY KEY NOT NULL,
    predicted_species_id TEXT NOT NULL,
    predicted_scientific_name TEXT NOT NULL,
    confidence REAL NOT NULL,
    alternatives TEXT NOT NULL,
    circularity REAL NOT NULL,
    rectangularity REAL NOT NULL,
    aspect_ratio REAL NOT NULL,
    model_version TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS curation_tasks (
    id TEXT PRIMARY KEY NOT NULL,
    specimen_id TEXT NOT NULL,
    ai_prediction TEXT NOT NULL,
    ai_confidence REAL NOT NULL,
    status TEXT NOT NULL,
    curator_decision TEXT,
    decided_at TEXT
  );

  CREATE TABLE IF NOT EXISTS literature (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    year INTEGER NOT NULL,
    venue TEXT NOT NULL,
    url TEXT,
    snippet TEXT NOT NULL,
    relevance REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS graph_nodes (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS graph_edges (
    id TEXT PRIMARY KEY NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    label TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ingested_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    ingested_at TEXT NOT NULL
  );
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
