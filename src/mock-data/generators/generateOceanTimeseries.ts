import type { OceanTimeseriesPoint, OceanVariable } from '../../types/ocean';
import type { H3CellValue } from '../../types/h3';
import { OCEAN_VARIABLE_META } from '../../types/ocean';
import { TIMESERIES_START, TIMESERIES_END } from '../constants';
import { getKeralaGrid, getNearshoreCells, type GridCell } from './generateH3Grid';
import { mulberry32 } from '../../utils/seededRandom';

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

// Warm anomaly years used to drive the sardine-decline narrative: elevated SST,
// suppressed upwelling/chlorophyll, matching the real 2016/2019/2023-ish pattern
// referenced in the plan.
const WARM_ANOMALY_YEARS = new Set([2016, 2019, 2023, 2024]);

function baseValue(variable: OceanVariable, monthIndex0: number, year: number, distanceFromCoastKm: number, rand: () => number): { value: number; anomaly: number } {
  const seasonal = Math.sin(((monthIndex0 + 3) / 12) * Math.PI * 2);
  const warmYear = WARM_ANOMALY_YEARS.has(year) ? 1 : 0;
  const longTermWarming = (year - 2015) * 0.035;
  const noise = (rand() - 0.5) * 0.3;

  if (variable === 'sst') {
    const climatology = 28.2 + seasonal * 1.1;
    const anomaly = warmYear * 0.9 + longTermWarming + noise * 0.6;
    return { value: climatology + anomaly, anomaly };
  }
  if (variable === 'chl_a') {
    // Upwelling brings nutrient-rich, chlorophyll-rich water nearshore; warm
    // years suppress upwelling intensity, so chlorophyll drops in warm years.
    const coastalBoost = Math.max(0, 1 - distanceFromCoastKm / 150) * 2.5;
    const climatology = 0.6 + coastalBoost - seasonal * 0.2;
    const anomaly = -warmYear * 0.5 - longTermWarming * 0.4 + noise * 0.3;
    return { value: Math.max(0.05, climatology + anomaly), anomaly };
  }
  // upwelling_index
  const coastalBoost = Math.max(0, 1 - distanceFromCoastKm / 150) * 40;
  const climatology = 30 + coastalBoost - seasonal * 8;
  const anomaly = -warmYear * 12 - longTermWarming * 5 + noise * 6;
  return { value: Math.max(0, climatology + anomaly), anomaly };
}

let seriesCache: Map<string, OceanTimeseriesPoint[]> | null = null;

// Monthly, region-averaged series for a variable across the nearshore Kerala
// stations. This is what get_ocean_timeseries returns for the demo's default
// "kerala_coast" region.
export function generateRegionTimeseries(variable: OceanVariable, startDate = TIMESERIES_START, endDate = TIMESERIES_END): OceanTimeseriesPoint[] {
  seriesCache = seriesCache ?? new Map();
  const cacheKey = `${variable}:${startDate}:${endDate}`;
  const cached = seriesCache.get(cacheKey);
  if (cached) return cached;

  const rand = mulberry32(hashSeed(variable));
  const stations = getNearshoreCells(6);
  const months = monthRange(startDate, endDate);
  const unit = OCEAN_VARIABLE_META[variable].unit;

  const points: OceanTimeseriesPoint[] = months.map((date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const monthIndex0 = d.getUTCMonth();
    const avgDistance = stations.reduce((s, c) => s + c.distanceFromCoastKm, 0) / stations.length;
    const { value, anomaly } = baseValue(variable, monthIndex0, year, avgDistance, rand);
    return {
      date,
      variable,
      value: Number(value.toFixed(3)),
      anomaly: Number(anomaly.toFixed(3)),
      h3Cell: stations[0].h3Cell,
      unit,
    };
  });

  seriesCache.set(cacheKey, points);
  return points;
}

// Snapshot across the full H3 grid for a given month, for map layers.
export function generateOceanSnapshot(variable: OceanVariable, date: string): H3CellValue<number>[] {
  const rand = mulberry32(hashSeed(variable + date));
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const monthIndex0 = d.getUTCMonth();
  return getKeralaGrid().map((cell: GridCell) => {
    const { value } = baseValue(variable, monthIndex0, year, cell.distanceFromCoastKm, rand);
    return { h3Cell: cell.h3Cell, value: Number(value.toFixed(3)), lat: cell.lat, lon: cell.lon };
  });
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return h || 1;
}
