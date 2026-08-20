import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const speciesInfo = sqliteTable('species_info', {
  speciesId: text('species_id').primaryKey().notNull(),
  scientificName: text('scientific_name').notNull(),
  commonName: text('common_name').notNull(),
  aphiaId: integer('aphia_id').notNull(),
  family: text('family').notNull(),
  status: text('status').notNull(),
  thumbnail: text('thumbnail'),
});

export const speciesOccurrences = sqliteTable(
  'species_occurrences',
  {
    id: text('id').primaryKey().notNull(),
    speciesId: text('species_id').notNull(),
    scientificName: text('scientific_name').notNull(),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
    h3Cell: text('h3_cell').notNull(),
    date: text('date').notNull(),
    count: integer('count'),
    source: text('source').notNull(),
  },
  (table) => [index('species_occurrences_species_id_idx').on(table.speciesId)]
);

export const oceanTimeseries = sqliteTable(
  'ocean_timeseries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(),
    variable: text('variable').notNull(),
    value: real('value').notNull(),
    h3Cell: text('h3_cell').notNull(),
    unit: text('unit').notNull(),
    anomaly: real('anomaly'),
  },
  (table) => [index('ocean_timeseries_variable_date_idx').on(table.variable, table.date)]
);

export const oceanGridSnapshots = sqliteTable(
  'ocean_grid_snapshots',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    h3Cell: text('h3_cell').notNull(),
    variable: text('variable').notNull(),
    date: text('date').notNull(),
    value: real('value').notNull(),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
  },
  (table) => [index('ocean_grid_snapshots_variable_date_idx').on(table.variable, table.date)]
);

export const ednaSamples = sqliteTable('edna_samples', {
  sampleId: text('sample_id').primaryKey().notNull(),
  stationName: text('station_name').notNull(),
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  h3Cell: text('h3_cell').notNull(),
  date: text('date').notNull(),
  shannonIndex: real('shannon_index').notNull(),
  simpsonIndex: real('simpson_index').notNull(),
});

export const asvRecords = sqliteTable(
  'asv_records',
  {
    asvId: text('asv_id').primaryKey().notNull(),
    sampleId: text('sample_id').notNull(),
    taxon: text('taxon').notNull(),
    aphiaId: integer('aphia_id'),
    confidence: real('confidence').notNull(),
    readCount: integer('read_count').notNull(),
  },
  (table) => [index('asv_records_sample_id_idx').on(table.sampleId)]
);

export const otolithSpecimens = sqliteTable('otolith_specimens', {
  specimenId: text('specimen_id').primaryKey().notNull(),
  imageColor: text('image_color').notNull(),
  collectedAt: text('collected_at').notNull(),
  stationName: text('station_name').notNull(),
  lengthMm: real('length_mm').notNull(),
  status: text('status').notNull(),
  trueSpeciesId: text('true_species_id').notNull(),
});

export const otolithPredictions = sqliteTable('otolith_predictions', {
  specimenId: text('specimen_id').primaryKey().notNull(),
  predictedSpeciesId: text('predicted_species_id').notNull(),
  predictedScientificName: text('predicted_scientific_name').notNull(),
  confidence: real('confidence').notNull(),
  alternatives: text('alternatives').notNull(),
  circularity: real('circularity').notNull(),
  rectangularity: real('rectangularity').notNull(),
  aspectRatio: real('aspect_ratio').notNull(),
  modelVersion: text('model_version').notNull(),
});

export const curationTasks = sqliteTable('curation_tasks', {
  id: text('id').primaryKey().notNull(),
  specimenId: text('specimen_id').notNull(),
  aiPrediction: text('ai_prediction').notNull(),
  aiConfidence: real('ai_confidence').notNull(),
  status: text('status').notNull(),
  curatorDecision: text('curator_decision'),
  decidedAt: text('decided_at'),
});

export const literature = sqliteTable('literature', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  authors: text('authors').notNull(),
  year: integer('year').notNull(),
  venue: text('venue').notNull(),
  url: text('url'),
  snippet: text('snippet').notNull(),
  relevance: real('relevance').notNull(),
});

export const graphNodes = sqliteTable('graph_nodes', {
  id: text('id').primaryKey().notNull(),
  label: text('label').notNull(),
  type: text('type').notNull(),
});

export const graphEdges = sqliteTable('graph_edges', {
  id: text('id').primaryKey().notNull(),
  source: text('source').notNull(),
  target: text('target').notNull(),
  label: text('label').notNull(),
});

export const ingestedPoints = sqliteTable('ingested_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  ingestedAt: text('ingested_at').notNull(),
});
