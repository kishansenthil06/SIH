import { liveCall, type ToolResult } from './client';
import type { ValidationIssue } from '../types/ingestion';

export interface IngestDatasetArgs {
  rows: Record<string, string>[];
  mapping: Record<string, string | null>; // sourceColumn -> canonicalField
}

export interface IngestDatasetResult {
  issues: ValidationIssue[];
  ingestedPoints: { lat: number; lon: number }[];
  validRowCount: number;
}

export function ingestDataset(args: IngestDatasetArgs): Promise<ToolResult<IngestDatasetResult>> {
  return liveCall('ingest_dataset', { rowCount: args.rows.length }, '/api/v1/ingestion/datasets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: args.rows, mapping: args.mapping }),
  });
}
