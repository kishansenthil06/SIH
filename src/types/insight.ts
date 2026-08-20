import type { Citation } from './literature';

export type ToolStatus = 'pending' | 'running' | 'done' | 'error';

export interface ToolCallTraceEntry {
  step: number;
  toolName: string;
  args: Record<string, unknown>;
  status: ToolStatus;
  startedAt?: string;
  finishedAt?: string;
  latencyMs?: number;
  resultSummary?: string;
}

export interface EvidenceItem {
  id: string;
  claim: string;
  supportingToolCall: string;
  value?: number | string;
  citationIds?: string[];
}

export interface InsightMapLayer {
  id: string;
  label: string;
  type: 'h3' | 'points';
  dataRef: string;
}

export interface InsightChart {
  id: string;
  type: 'timeseries' | 'scatter' | 'shap';
  dataRef: string;
  title: string;
}

export interface Insight {
  id: string;
  question: string;
  narrative: string;
  evidence: EvidenceItem[];
  confidence: number; // 0-1
  mapLayers: InsightMapLayer[];
  charts: InsightChart[];
  citations: Citation[];
  trace: ToolCallTraceEntry[];
  generatedAt: string;
}
