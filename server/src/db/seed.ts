import { db } from './client';
import { speciesInfo, speciesOccurrences, oceanTimeseries } from './schema';
import { SPECIES_CATALOG, TIMESERIES_START, TIMESERIES_END } from '../../../src/mock-data/constants';
import { generateAllOccurrences } from '../../../src/mock-data/generators/generateOccurrences';
import { generateRegionTimeseries } from '../../../src/mock-data/generators/generateOceanTimeseries';
import type { OceanVariable } from '../../../src/types/ocean';

const OCEAN_VARIABLES: OceanVariable[] = ['sst', 'chl_a', 'upwelling_index'];

const CHUNK_SIZE = 200;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

async function main(): Promise<void> {
  // Clear existing data.
  await db.delete(speciesOccurrences).run();
  await db.delete(oceanTimeseries).run();
  await db.delete(speciesInfo).run();

  // Seed species info.
  const speciesRows = SPECIES_CATALOG.map((species) => ({
    speciesId: species.speciesId,
    scientificName: species.scientificName,
    commonName: species.commonName,
    aphiaId: species.aphiaId,
    family: species.family,
    status: species.status,
    thumbnail: species.thumbnail ?? null,
  }));
  for (const batch of chunk(speciesRows, CHUNK_SIZE)) {
    await db.insert(speciesInfo).values(batch).run();
  }

  // Seed species occurrences (generated once by the shared deterministic generator).
  const occurrences = generateAllOccurrences();
  const occurrenceRows = occurrences.map((occ) => ({
    id: occ.id,
    speciesId: occ.speciesId,
    scientificName: occ.scientificName,
    lat: occ.lat,
    lon: occ.lon,
    h3Cell: occ.h3Cell,
    date: occ.date,
    count: occ.count ?? null,
    source: occ.source,
  }));
  for (const batch of chunk(occurrenceRows, CHUNK_SIZE)) {
    await db.insert(speciesOccurrences).values(batch).run();
  }

  // Seed ocean timeseries for each variable.
  let timeseriesCount = 0;
  for (const variable of OCEAN_VARIABLES) {
    const points = generateRegionTimeseries(variable, TIMESERIES_START, TIMESERIES_END);
    const pointRows = points.map((point) => ({
      date: point.date,
      variable: point.variable,
      value: point.value,
      h3Cell: point.h3Cell,
      unit: point.unit,
      anomaly: point.anomaly ?? null,
    }));
    for (const batch of chunk(pointRows, CHUNK_SIZE)) {
      await db.insert(oceanTimeseries).values(batch).run();
    }
    timeseriesCount += pointRows.length;
  }

  console.log(
    `Seeded ${speciesRows.length} species, ${occurrenceRows.length} occurrences, ${timeseriesCount} ocean timeseries points.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
