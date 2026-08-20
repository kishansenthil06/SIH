import type { SdmResult, ShapValue } from '../../types/species';
import { getKeralaGrid } from './generateH3Grid';
import { generateOceanSnapshot } from './generateOceanTimeseries';
import { mulberry32 } from '../../utils/seededRandom';
import { DEMO_SPECIES_ID } from '../constants';

// Suitability is modeled as a function of SST anomaly (sardines prefer cooler,
// nutrient-rich water) and proximity to the coast/upwelling zone -- this is
// what drives the SHAP-style feature attribution shown in the copilot.
export function generateSdmSnapshot(speciesId: string, date: string): SdmResult[] {
  const rand = mulberry32(hashSeed(speciesId + date));
  const sstSnapshot = generateOceanSnapshot('sst', date);
  const sstByCell = new Map(sstSnapshot.map((c) => [c.h3Cell, c.value]));
  const grid = getKeralaGrid();

  const preferredSst = speciesId === DEMO_SPECIES_ID ? 27.6 : 28.6;

  return grid.map((cell) => {
    const sst = sstByCell.get(cell.h3Cell) ?? 28;
    const sstDeviation = sst - preferredSst;
    const sstContribution = Math.max(-1, Math.min(1, -sstDeviation / 2));
    const coastalContribution = Math.max(0, 1 - cell.distanceFromCoastKm / 120);
    const noise = (rand() - 0.5) * 0.15;

    const suitability = clamp01(0.5 + sstContribution * 0.35 + coastalContribution * 0.25 + noise);

    const shapValues: ShapValue[] = [
      { feature: 'SST anomaly', contribution: Number((sstContribution * 0.35).toFixed(3)) },
      { feature: 'Distance to coast', contribution: Number((coastalContribution * 0.25).toFixed(3)) },
      { feature: 'Chlorophyll-a', contribution: Number((noise * 0.4).toFixed(3)) },
    ];

    return {
      speciesId,
      h3Cell: cell.h3Cell,
      lat: cell.lat,
      lon: cell.lon,
      suitability: Number(suitability.toFixed(3)),
      shapValues,
      date,
    };
  });
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return h || 1;
}
