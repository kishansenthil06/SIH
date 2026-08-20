import type { SpeciesOccurrence } from '../../types/species';
import { getNearshoreCells } from './generateH3Grid';
import { mulberry32, seededRange, pick } from '../../utils/seededRandom';
import { SPECIES_CATALOG, TIMESERIES_START, TIMESERIES_END } from '../constants';
import { nextId } from '../../utils/id';

function years(startIso: string, endIso: string): number[] {
  const out: number[] = [];
  for (let y = new Date(startIso).getUTCFullYear(); y <= new Date(endIso).getUTCFullYear(); y++) out.push(y);
  return out;
}

const SOURCES: SpeciesOccurrence['source'][] = ['obis', 'fishing_survey', 'edna_derived'];

let cache: SpeciesOccurrence[] | null = null;

export function generateAllOccurrences(): SpeciesOccurrence[] {
  if (cache) return cache;
  const rand = mulberry32(101);
  const stations = getNearshoreCells(8);
  const out: SpeciesOccurrence[] = [];

  for (const species of SPECIES_CATALOG) {
    const trendSlope = species.status === 'declining' ? -0.06 : species.status === 'increasing' ? 0.05 : 0.0;
    for (const year of years(TIMESERIES_START, TIMESERIES_END)) {
      const yearsFromStart = year - new Date(TIMESERIES_START).getUTCFullYear();
      for (let m = 0; m < 4; m++) {
        const station = pick(rand, stations);
        const baseCount = 400 + seededRange(rand, -50, 50);
        const trend = baseCount * (1 + trendSlope * yearsFromStart);
        const noise = seededRange(rand, -40, 40);
        const count = Math.max(5, Math.round(trend + noise));
        out.push({
          id: nextId('occ'),
          speciesId: species.speciesId,
          scientificName: species.scientificName,
          lat: station.lat + seededRange(rand, -0.05, 0.05),
          lon: station.lon + seededRange(rand, -0.05, 0.05),
          h3Cell: station.h3Cell,
          date: `${year}-${String(m * 3 + 1).padStart(2, '0')}-01`,
          count,
          source: pick(rand, SOURCES),
        });
      }
    }
  }

  cache = out;
  return out;
}

export function getOccurrencesForSpecies(speciesId: string): SpeciesOccurrence[] {
  return generateAllOccurrences().filter((o) => o.speciesId === speciesId);
}
