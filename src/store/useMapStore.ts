import { create } from 'zustand';
import type { OceanVariable } from '../types/ocean';

export type MapLayerKey = 'sst' | 'chl_a' | 'sdm_suitability' | 'occurrences' | 'none';

interface MapState {
  activeLayer: MapLayerKey;
  selectedDate: string;
  selectedSpeciesId: string;
  selectedH3Cell: string | null;
  setActiveLayer: (layer: MapLayerKey) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSpeciesId: (speciesId: string) => void;
  setSelectedH3Cell: (cell: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayer: 'sst',
  selectedDate: '2024-06-01',
  selectedSpeciesId: 'sardinella_longiceps',
  selectedH3Cell: null,
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedSpeciesId: (selectedSpeciesId) => set({ selectedSpeciesId }),
  setSelectedH3Cell: (selectedH3Cell) => set({ selectedH3Cell }),
}));

export function layerKeyToOceanVariable(layer: MapLayerKey): OceanVariable | null {
  if (layer === 'sst' || layer === 'chl_a') return layer;
  return null;
}
