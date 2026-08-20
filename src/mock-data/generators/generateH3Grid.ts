import { latLngToCell, cellToLatLng } from 'h3-js';
import { KERALA_COAST_BOUNDS, H3_RESOLUTION } from '../constants';
import { mulberry32, seededRange } from '../../utils/seededRandom';

export interface GridCell {
  h3Cell: string;
  lat: number;
  lon: number;
  distanceFromCoastKm: number; // higher = further offshore (west)
}

// Builds a deduplicated H3 grid over the Kerala coast bounding box by sampling
// a regular lat/lon lattice and snapping each point to its H3 cell.
export function generateKeralaGrid(): GridCell[] {
  const { minLat, maxLat, minLon, maxLon } = KERALA_COAST_BOUNDS;
  const seen = new Map<string, GridCell>();
  const steps = 14;

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const lat = minLat + ((maxLat - minLat) * i) / steps;
      const lon = minLon + ((maxLon - minLon) * j) / steps;
      const h3Cell = latLngToCell(lat, lon, H3_RESOLUTION);
      if (!seen.has(h3Cell)) {
        const [cellLat, cellLon] = cellToLatLng(h3Cell);
        // coastline runs roughly along the eastern edge of the bbox; approximate
        // "distance offshore" as how far west (toward open sea) the cell sits.
        const distanceFromCoastKm = Math.max(0, (maxLon - cellLon) * 111);
        seen.set(h3Cell, { h3Cell, lat: cellLat, lon: cellLon, distanceFromCoastKm });
      }
    }
  }

  return Array.from(seen.values());
}

let cached: GridCell[] | null = null;
export function getKeralaGrid(): GridCell[] {
  if (!cached) cached = generateKeralaGrid();
  return cached;
}

// A handful of representative nearshore cells used as "sampling stations" for
// species occurrences, eDNA sites, and the demo narrative.
export function getNearshoreCells(count: number): GridCell[] {
  const rand = mulberry32(7);
  const grid = getKeralaGrid()
    .filter((c) => c.distanceFromCoastKm < 60)
    .sort((a, b) => a.lat - b.lat);
  const picked: GridCell[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(seededRange(rand, 0, grid.length));
    picked.push(grid[idx % grid.length]);
  }
  return picked;
}
