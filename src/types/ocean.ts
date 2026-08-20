export type OceanVariable = 'sst' | 'chl_a' | 'upwelling_index';

export interface OceanTimeseriesPoint {
  date: string; // ISO date, monthly resolution
  variable: OceanVariable;
  value: number;
  h3Cell: string;
  unit: string;
  anomaly?: number; // deviation from climatological mean
}

export const OCEAN_VARIABLE_META: Record<OceanVariable, { label: string; unit: string; color: string }> = {
  sst: { label: 'Sea Surface Temperature', unit: '°C', color: '#f87171' },
  chl_a: { label: 'Chlorophyll-a', unit: 'mg/m³', color: '#34d399' },
  upwelling_index: { label: 'Upwelling Index', unit: 'm³/s/100m', color: '#818cf8' },
};
