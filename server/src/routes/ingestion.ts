import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { ingestedPoints } from '../db/schema';
import type { ValidationIssue } from '../../../src/types/ingestion';
import { KERALA_COAST_BOUNDS } from '../../../src/mock-data/constants';

interface IngestDatasetBody {
  rows: Record<string, string>[];
  mapping: Record<string, string | null>; // sourceColumn -> canonicalField
}

interface IngestDatasetResult {
  issues: ValidationIssue[];
  ingestedPoints: { lat: number; lon: number }[];
  validRowCount: number;
}

const CHUNK_SIZE = 200;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

// sourceColumn -> canonicalField becomes canonicalField -> sourceColumn so
// validation can look up "which source column holds latitude" etc.
function reverseMapping(mapping: Record<string, string | null>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [source, target] of Object.entries(mapping)) {
    if (target) out[target] = source;
  }
  return out;
}

const ingestionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: IngestDatasetBody }>('/ingestion/datasets', async (request) => {
    const { rows, mapping } = request.body;

    const fieldToSource = reverseMapping(mapping);
    const issues: ValidationIssue[] = [];
    const validPoints: { lat: number; lon: number }[] = [];

    rows.forEach((row, index) => {
      const latCol = fieldToSource['latitude'];
      const lonCol = fieldToSource['longitude'];
      const dateCol = fieldToSource['date'];

      if (!latCol || !lonCol) {
        if (index === 0) {
          issues.push({
            row: index,
            column: 'latitude/longitude',
            severity: 'error',
            message: 'Latitude/longitude columns are not mapped',
          });
        }
        return;
      }

      const lat = Number(row[latCol]);
      const lon = Number(row[lonCol]);

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        issues.push({
          row: index,
          column: latCol,
          severity: 'error',
          message: `Non-numeric coordinate: "${row[latCol]}", "${row[lonCol]}"`,
        });
        return;
      }

      if (
        lat < KERALA_COAST_BOUNDS.minLat - 5 ||
        lat > KERALA_COAST_BOUNDS.maxLat + 5 ||
        lon < KERALA_COAST_BOUNDS.minLon - 5 ||
        lon > KERALA_COAST_BOUNDS.maxLon + 5
      ) {
        issues.push({
          row: index,
          column: latCol,
          severity: 'warning',
          message: `Coordinate (${lat}, ${lon}) falls well outside the expected Kerala coast region`,
        });
      }

      if (dateCol && Number.isNaN(Date.parse(row[dateCol]))) {
        issues.push({
          row: index,
          column: dateCol,
          severity: 'warning',
          message: `Could not parse date "${row[dateCol]}"`,
        });
      }

      validPoints.push({ lat, lon });
    });

    if (validPoints.length > 0) {
      const ingestedAt = new Date().toISOString();
      const insertRows = validPoints.map((point) => ({
        lat: point.lat,
        lon: point.lon,
        ingestedAt,
      }));

      for (const batch of chunk(insertRows, CHUNK_SIZE)) {
        await db.insert(ingestedPoints).values(batch).run();
      }
    }

    const result: IngestDatasetResult = {
      issues,
      ingestedPoints: validPoints,
      validRowCount: validPoints.length,
    };

    return result;
  });
};

export { ingestionRoutes };
