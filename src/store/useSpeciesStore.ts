import { create } from 'zustand';
import { DEMO_SPECIES_ID } from '../mock-data/constants';

interface SpeciesState {
  selectedSpeciesId: string;
  setSelectedSpeciesId: (id: string) => void;
}

export const useSpeciesStore = create<SpeciesState>((set) => ({
  selectedSpeciesId: DEMO_SPECIES_ID,
  setSelectedSpeciesId: (selectedSpeciesId) => set({ selectedSpeciesId }),
}));
