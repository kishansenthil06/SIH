import type { OtolithSpecimen, OtolithPrediction } from '../../types/otolith';
import { mulberry32, seededRange, pick } from '../../utils/seededRandom';
import { SPECIES_CATALOG } from '../constants';

const SWATCHES = ['#c9a876', '#d4b896', '#b89968', '#e0c8a0', '#a88858'];
const STATIONS = ['Kollam Trawl Ground', 'Kochi Shelf Transect', 'Alappuzha Nearshore', 'Kozhikode Deep Station'];

let cache: OtolithSpecimen[] | null = null;

export function generateOtolithSpecimens(count = 18): OtolithSpecimen[] {
  if (cache) return cache;
  const rand = mulberry32(505);
  cache = Array.from({ length: count }, (_, i) => ({
    specimenId: `otolith_${i + 1}`,
    imageColor: pick(rand, SWATCHES),
    collectedAt: `2024-0${(i % 6) + 1}-${String(10 + (i % 15)).padStart(2, '0')}`,
    stationName: pick(rand, STATIONS),
    lengthMm: Number(seededRange(rand, 4, 14).toFixed(1)),
    status: 'unclassified',
  }));
  return cache;
}

export function classifySpecimen(specimenId: string): OtolithPrediction {
  const rand = mulberry32(hashSeed(specimenId));
  const primary = pick(rand, SPECIES_CATALOG);
  const confidence = Number(seededRange(rand, 0.62, 0.95).toFixed(2));
  const alternatives = SPECIES_CATALOG.filter((s) => s.speciesId !== primary.speciesId)
    .slice(0, 2)
    .map((s) => ({
      speciesId: s.speciesId,
      scientificName: s.scientificName,
      confidence: Number(seededRange(rand, 0.05, confidence - 0.1).toFixed(2)),
    }));

  return {
    specimenId,
    predictedSpeciesId: primary.speciesId,
    predictedScientificName: primary.scientificName,
    confidence,
    alternatives,
    shapeDescriptors: {
      circularity: Number(seededRange(rand, 0.55, 0.9).toFixed(2)),
      rectangularity: Number(seededRange(rand, 0.5, 0.85).toFixed(2)),
      aspectRatio: Number(seededRange(rand, 1.1, 2.4).toFixed(2)),
    },
  };
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return h || 1;
}
