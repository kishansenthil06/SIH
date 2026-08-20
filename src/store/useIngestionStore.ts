import { create } from 'zustand';
import type { IngestionJob } from '../types/ingestion';

interface IngestionState {
  job: IngestionJob | null;
  setJob: (job: IngestionJob | null) => void;
  updateJob: (patch: Partial<IngestionJob>) => void;
}

export const useIngestionStore = create<IngestionState>((set) => ({
  job: null,
  setJob: (job) => set({ job }),
  updateJob: (patch) => set((s) => ({ job: s.job ? { ...s.job, ...patch } : s.job })),
}));
