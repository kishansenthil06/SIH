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
