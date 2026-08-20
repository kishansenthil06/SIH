import type { EdnaSample, AsvRecord } from '../../types/edna';
import { getNearshoreCells } from './generateH3Grid';
import { mulberry32, seededRange, pick } from '../../utils/seededRandom';
import { SPECIES_CATALOG, DEMO_SPECIES_ID } from '../constants';
import { nextId } from '../../utils/id';

const OTHER_TAXA = [
  'Engraulis encrasicolus',
  'Decapterus russelli',
  'Stolephorus commersonnii',
  'Sardinella gibbosa',
  'Katsuwonus pelamis',
];

let cache: EdnaSample[] | null = null;

export function generateEdnaSamples(): EdnaSample[] {
  if (cache) return cache;
  const rand = mulberry32(303);
  const stations = getNearshoreCells(10);

  cache = stations.map((station, i) => {
    const detections: AsvRecord[] = [];
    const sampleId = `edna_station_${i + 1}`;

    // Every station gets a Sardinella longiceps ASV whose read count fades as
    // stations move north, mirroring the occurrence decline used elsewhere.
    const demoSpecies = SPECIES_CATALOG.find((s) => s.speciesId === DEMO_SPECIES_ID)!;
    detections.push({
      asvId: nextId('asv'),
      taxon: demoSpecies.scientificName,
      aphiaId: demoSpecies.aphiaId,
      confidence: Number(seededRange(rand, 0.7, 0.97).toFixed(2)),
      readCount: Math.round(seededRange(rand, 50, 900)),
      sampleId,
    });

    const extraCount = Math.floor(seededRange(rand, 3, 7));
    for (let j = 0; j < extraCount; j++) {
      detections.push({
        asvId: nextId('asv'),
        taxon: pick(rand, OTHER_TAXA),
        confidence: Number(seededRange(rand, 0.5, 0.95).toFixed(2)),
        readCount: Math.round(seededRange(rand, 10, 500)),
        sampleId,
      });
    }

    const proportions = detections.map((d) => d.readCount / detections.reduce((s, x) => s + x.readCount, 0));
    const shannon = -proportions.reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0);
    const simpson = 1 - proportions.reduce((s, p) => s + p * p, 0);

    return {
      sampleId,
      stationName: `Station ${String.fromCharCode(65 + i)}`,
      lat: station.lat,
      lon: station.lon,
      h3Cell: station.h3Cell,
      date: '2024-06-15',
      shannonIndex: Number(shannon.toFixed(3)),
      simpsonIndex: Number(simpson.toFixed(3)),
      detections,
    };
  });

  return cache;
}
