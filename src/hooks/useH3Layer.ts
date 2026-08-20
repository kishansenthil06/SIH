import { H3HexagonLayer } from '@deck.gl/geo-layers';
import { cellToBoundary } from 'h3-js';
import type { H3CellValue } from '../types/h3';

export interface H3LayerColorStop {
  min: number;
  max: number;
  color: [number, number, number];
}

// deck.gl's H3HexagonLayer needs boundary vertices per cell (not just the
// index), so this wraps cellToBoundary + a simple min/max color ramp.
export function buildH3HexagonLayer<T extends number>(
  id: string,
  data: H3CellValue<T>[],
  colorRamp: [number, number, number][],
  opts: { opacity?: number; extruded?: boolean; onClick?: (d: H3CellValue<T>) => void } = {}
) {
  if (data.length === 0) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return new H3HexagonLayer<H3CellValue<T>>({
    id,
    data,
    pickable: true,
    filled: true,
    stroked: true,
    extruded: opts.extruded ?? false,
    getHexagon: (d) => d.h3Cell,
    getFillColor: (d) => {
      const t = max === min ? 0.5 : (d.value - min) / (max - min);
      const color = rampColor(colorRamp, t);
      return [...color, Math.round((opts.opacity ?? 0.75) * 255)];
    },
    getLineColor: [255, 255, 255, 40],
    lineWidthMinPixels: 1,
    onClick: opts.onClick ? (info) => info.object && opts.onClick!(info.object) : undefined,
    updateTriggers: {
      getFillColor: [data],
    },
  });
}

function rampColor(ramp: [number, number, number][], t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (ramp.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const frac = idx - lo;
  const a = ramp[lo];
  const b = ramp[hi];
  return [Math.round(a[0] + (b[0] - a[0]) * frac), Math.round(a[1] + (b[1] - a[1]) * frac), Math.round(a[2] + (b[2] - a[2]) * frac)];
}

export function h3CellCenter(h3Cell: string): [number, number] {
  const boundary = cellToBoundary(h3Cell);
  const lat = boundary.reduce((s, p) => s + p[0], 0) / boundary.length;
  const lon = boundary.reduce((s, p) => s + p[1], 0) / boundary.length;
  return [lat, lon];
}
