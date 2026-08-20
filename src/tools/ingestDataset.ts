import { callTool, type ToolResult } from './client';
import type { ValidationIssue } from '../types/ingestion';
import { KERALA_COAST_BOUNDS } from '../mock-data/constants';

export interface IngestDatasetArgs {
  rows: Record<string, string>[];
  mapping: Record<string, string | null>; // sourceColumn -> canonicalField
}

export interface IngestDatasetResult {
  issues: ValidationIssue[];
  ingestedPoints: { lat: number; lon: number }[];
  validRowCount: number;
}

function reverseMapping(mapping: Record<string, string | null>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [source, target] of Object.entries(mapping)) {
    if (target) out[target] = source;
  }
  return out;
}

export function ingestDataset(args: IngestDatasetArgs): Promise<ToolResult<IngestDatasetResult>> {
  return callTool('ingest_dataset', { rowCount: args.rows.length }, () => {
    const fieldToSource = reverseMapping(args.mapping);
    const issues: ValidationIssue[] = [];
    const ingestedPoints: { lat: number; lon: number }[] = [];

    args.rows.forEach((row, index) => {
      const latCol = fieldToSource['latitude'];
      const lonCol = fieldToSource['longitude'];
      const dateCol = fieldToSource['date'];

      if (!latCol || !lonCol) {
        if (index === 0) issues.push({ row: index, column: 'latitude/longitude', severity: 'error', message: 'Latitude/longitude columns are not mapped' });
        return;
      }

      const lat = Number(row[latCol]);
      const lon = Number(row[lonCol]);

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        issues.push({ row: index, column: latCol, severity: 'error', message: `Non-numeric coordinate: "${row[latCol]}", "${row[lonCol]}"` });
        return;
      }

      if (lat < KERALA_COAST_BOUNDS.minLat - 5 || lat > KERALA_COAST_BOUNDS.maxLat + 5 || lon < KERALA_COAST_BOUNDS.minLon - 5 || lon > KERALA_COAST_BOUNDS.maxLon + 5) {
        issues.push({ row: index, column: latCol, severity: 'warning', message: `Coordinate (${lat}, ${lon}) falls well outside the expected Kerala coast region` });
      }

      if (dateCol && Number.isNaN(Date.parse(row[dateCol]))) {
        issues.push({ row: index, column: dateCol, severity: 'warning', message: `Could not parse date "${row[dateCol]}"` });
      }

      ingestedPoints.push({ lat, lon });
    });

    return { issues, ingestedPoints, validRowCount: ingestedPoints.length };
  });
}
