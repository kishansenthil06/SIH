import { db } from './client';
import {
  speciesInfo,
  speciesOccurrences,
  oceanTimeseries,
  oceanGridSnapshots,
  ednaSamples,
  asvRecords,
  otolithSpecimens,
  otolithPredictions,
  curationTasks,
  literature,
  graphNodes,
  graphEdges,
  ingestedPoints,
} from './schema';
import { SPECIES_CATALOG, TIMESERIES_START, TIMESERIES_END } from '../../../src/mock-data/constants';
import { generateAllOccurrences } from '../../../src/mock-data/generators/generateOccurrences';
import { generateRegionTimeseries, generateOceanSnapshot } from '../../../src/mock-data/generators/generateOceanTimeseries';
import { generateEdnaSamples } from '../../../src/mock-data/generators/generateEdna';
import { generateOtolithSpecimens } from '../../../src/mock-data/generators/generateOtoliths';
import { searchLiteratureFixture } from '../../../src/mock-data/generators/generateLiterature';
import { mulberry32, pick } from '../../../src/utils/seededRandom';
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

// Mirrors the unexported `monthRange` helper in generateOceanTimeseries.ts so
// grid snapshots can be generated for the exact same month sequence used by
// the regional timeseries.
function monthRange(startIso: string, endIso: string): string[] {
  const months: string[] = [];
  const start = new Date(startIso);
  const end = new Date(endIso);
  const cur = new Date(start);
  while (cur <= end) {
    months.push(cur.toISOString().slice(0, 10));
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return months;
}

// Fixed, non-species knowledge-graph nodes (mirrors generateGraph.ts's REGION/HABITAT/SST/CHLA constants).
const REGION_NODE = { id: 'region_kerala_coast', label: 'Kerala Coast', type: 'region' };
const HABITAT_NODE = { id: 'habitat_upwelling_zone', label: 'Coastal Upwelling Zone', type: 'habitat' };
const SST_NODE = { id: 'variable_sst', label: 'Sea Surface Temperature', type: 'variable' };
const CHLA_NODE = { id: 'variable_chl_a', label: 'Chlorophyll-a', type: 'variable' };

async function main(): Promise<void> {
  // Clear existing data.
  await db.delete(speciesOccurrences).run();
  await db.delete(oceanTimeseries).run();
  await db.delete(speciesInfo).run();
  await db.delete(oceanGridSnapshots).run();
  await db.delete(asvRecords).run();
  await db.delete(ednaSamples).run();
  await db.delete(otolithPredictions).run();
  await db.delete(otolithSpecimens).run();
  await db.delete(curationTasks).run();
  await db.delete(literature).run();
  await db.delete(graphEdges).run();
  await db.delete(graphNodes).run();
  await db.delete(ingestedPoints).run();

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

  // Seed ocean grid snapshots: full Kerala-grid coverage per variable per month, for map layers.
  let gridSnapshotCount = 0;
  const months = monthRange(TIMESERIES_START, TIMESERIES_END);
  for (const variable of OCEAN_VARIABLES) {
    for (const date of months) {
      const cells = generateOceanSnapshot(variable, date);
      const rows = cells.map((cell) => ({
        h3Cell: cell.h3Cell,
        variable,
        date,
        value: cell.value,
        lat: cell.lat,
        lon: cell.lon,
      }));
      for (const batch of chunk(rows, CHUNK_SIZE)) {
        await db.insert(oceanGridSnapshots).values(batch).run();
      }
      gridSnapshotCount += rows.length;
    }
  }

  // Seed eDNA samples + flattened ASV detections.
  const ednaSampleData = generateEdnaSamples();
  const ednaSampleRows = ednaSampleData.map((sample) => ({
    sampleId: sample.sampleId,
    stationName: sample.stationName,
    lat: sample.lat,
    lon: sample.lon,
    h3Cell: sample.h3Cell,
    date: sample.date,
    shannonIndex: sample.shannonIndex,
    simpsonIndex: sample.simpsonIndex,
  }));
  for (const batch of chunk(ednaSampleRows, CHUNK_SIZE)) {
    await db.insert(ednaSamples).values(batch).run();
  }

  const asvRows = ednaSampleData.flatMap((sample) =>
    sample.detections.map((detection) => ({
      asvId: detection.asvId,
      sampleId: detection.sampleId,
      taxon: detection.taxon,
      aphiaId: detection.aphiaId ?? null,
      confidence: detection.confidence,
      readCount: detection.readCount,
    }))
  );
  for (const batch of chunk(asvRows, CHUNK_SIZE)) {
    await db.insert(asvRecords).values(batch).run();
  }

  // Seed otolith specimens, with a deterministic hidden ground-truth species label
  // assigned via a seeded RNG (independent of the real classifier logic).
  const otolithSpecimenData = generateOtolithSpecimens();
  const otolithSpecimenRows = otolithSpecimenData.map((specimen, i) => {
    const rand = mulberry32(606 + i);
    const trueSpecies = pick(rand, SPECIES_CATALOG);
    return {
      specimenId: specimen.specimenId,
      imageColor: specimen.imageColor,
      collectedAt: specimen.collectedAt,
      stationName: specimen.stationName,
      lengthMm: specimen.lengthMm,
      status: specimen.status,
      trueSpeciesId: trueSpecies.speciesId,
    };
  });
  for (const batch of chunk(otolithSpecimenRows, CHUNK_SIZE)) {
    await db.insert(otolithSpecimens).values(batch).run();
  }

  // Seed literature (full unfiltered, relevance-sorted set).
  const literatureData = searchLiteratureFixture('');
  const literatureRows = literatureData.map((paper) => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors,
    year: paper.year,
    venue: paper.venue,
    url: paper.url ?? null,
    snippet: paper.snippet,
    relevance: paper.relevance,
  }));
  for (const batch of chunk(literatureRows, CHUNK_SIZE)) {
    await db.insert(literature).values(batch).run();
  }

  // Seed knowledge graph: fixed topology nodes/edges replicated per species from
  // generateGraph.ts's traverseGraphFixture, persisted across all species at once.
  const speciesNodes = SPECIES_CATALOG.map((species) => ({
    id: species.speciesId,
    label: species.scientificName,
    type: 'species',
  }));
  const paperNodes = literatureData.map((paper) => ({
    id: paper.id,
    label: paper.title,
    type: 'paper',
  }));
  const graphNodeRows = [REGION_NODE, HABITAT_NODE, SST_NODE, CHLA_NODE, ...speciesNodes, ...paperNodes];
  for (const batch of chunk(graphNodeRows, CHUNK_SIZE)) {
    await db.insert(graphNodes).values(batch).run();
  }

  const graphEdgeRows: { id: string; source: string; target: string; label: string }[] = [
    // Global edges (shared across all species, seeded once).
    { id: 'e3', source: HABITAT_NODE.id, target: SST_NODE.id, label: 'modulated by' },
    { id: 'e4', source: HABITAT_NODE.id, target: CHLA_NODE.id, label: 'produces' },
  ];
  for (const species of SPECIES_CATALOG) {
    graphEdgeRows.push(
      { id: `e1_${species.speciesId}`, source: species.speciesId, target: REGION_NODE.id, label: 'occurs in' },
      { id: `e2_${species.speciesId}`, source: species.speciesId, target: HABITAT_NODE.id, label: 'depends on' },
      { id: `e5_${species.speciesId}`, source: species.speciesId, target: SST_NODE.id, label: 'sensitive to' }
    );
    const topPapers = searchLiteratureFixture(species.scientificName).slice(0, 3);
    for (const paper of topPapers) {
      graphEdgeRows.push({
        id: `e_lit_${species.speciesId}_${paper.id}`,
        source: species.speciesId,
        target: paper.id,
        label: 'studied in',
      });
    }
  }
  for (const batch of chunk(graphEdgeRows, CHUNK_SIZE)) {
    await db.insert(graphEdges).values(batch).run();
  }

  // otolith_predictions, curation_tasks, and ingested_points are populated at
  // request time by other routes (classify, curation, ingestion), not at seed time.

  console.log(
    [
      `Seeded ${speciesRows.length} species,`,
      `${occurrenceRows.length} occurrences,`,
      `${timeseriesCount} ocean timeseries points,`,
      `${gridSnapshotCount} ocean grid snapshot rows,`,
      `${ednaSampleRows.length} eDNA samples (${asvRows.length} ASV detections),`,
      `${otolithSpecimenRows.length} otolith specimens,`,
      `${literatureRows.length} literature rows,`,
      `${graphNodeRows.length} graph nodes / ${graphEdgeRows.length} graph edges.`,
    ].join(' ')
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
