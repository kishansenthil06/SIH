export interface ColumnMapping {
  sourceColumn: string;
  targetField: string | null; // null = unmapped
  inferredType: 'string' | 'number' | 'date' | 'unknown';
  sampleValues: string[];
}

export interface ValidationIssue {
  row: number;
  column: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface IngestionJob {
  id: string;
  fileName: string;
  rowCount: number;
  columns: ColumnMapping[];
  issues: ValidationIssue[];
  status: 'mapping' | 'validated' | 'ingested';
  ingestedPoints: { lat: number; lon: number }[];
}

export const CANONICAL_FIELDS = [
  'latitude',
  'longitude',
  'date',
  'scientific_name',
  'sst_c',
  'count',
  'gear_type',
] as const;
