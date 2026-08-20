import { create } from 'zustand';
import type { Insight, ToolCallTraceEntry } from '../types/insight';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  insightId?: string;
}

interface CopilotState {
  messages: ChatMessage[];
  trace: ToolCallTraceEntry[];
  insights: Record<string, Insight>;
  currentInsightId: string | null;
  isRunning: boolean;
  addMessage: (message: ChatMessage) => void;
  setTrace: (trace: ToolCallTraceEntry[]) => void;
  updateTraceStep: (step: number, patch: Partial<ToolCallTraceEntry>) => void;
  setInsight: (insight: Insight) => void;
  setRunning: (running: boolean) => void;
  reset: () => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
  messages: [],
  trace: [],
  insights: {},
  currentInsightId: null,
  isRunning: false,
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setTrace: (trace) => set({ trace }),
  updateTraceStep: (step, patch) =>
    set((s) => ({ trace: s.trace.map((t) => (t.step === step ? { ...t, ...patch } : t)) })),
  setInsight: (insight) =>
    set((s) => ({ insights: { ...s.insights, [insight.id]: insight }, currentInsightId: insight.id })),
  setRunning: (isRunning) => set({ isRunning }),
  reset: () => set({ messages: [], trace: [], isRunning: false }),
}));
