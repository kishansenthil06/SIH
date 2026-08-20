import { create } from 'zustand';
import type { CurationTask } from '../types/curation';

interface CurationState {
  tasks: CurationTask[];
  addTask: (task: CurationTask) => void;
  decide: (id: string, decision: 'accepted' | 'overridden', curatorDecision?: string) => void;
}

export const useCurationStore = create<CurationState>((set) => ({
  tasks: [],
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  decide: (id, decision, curatorDecision) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status: decision, curatorDecision, decidedAt: new Date().toISOString() } : t
      ),
    })),
}));

export function pendingCurationCount(tasks: CurationTask[]): number {
  return tasks.filter((t) => t.status === 'pending').length;
}
