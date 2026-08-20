import { and, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { oceanGridSnapshots } from '../db/schema';
import { DEMO_SPECIES_ID, KERALA_COAST_BOUNDS } from '../../../src/mock-data/constants';
import type { SdmResult, ShapValue } from '../../../src/types/species';
import { mulberry32 } from '../../../src/utils/seededRandom';

interface SdmRunBody {
  speciesId?: string;
  date?: string;
}

const DEFAULT_SDM_DATE = '2024-06-01';

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return h || 1;
}

const sdmRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: SdmRunBody }>('/sdm/run', async (request, reply) => {
    const { speciesId, date } = request.body ?? {};

    if (!speciesId) {
      return reply.status(400).send({ error: 'speciesId is required' });
    }

    const snapshotDate = date ?? DEFAULT_SDM_DATE;

    // The snapshot rows for this variable/date ARE the grid for this date --
    // no separate "grid" concept needed, unlike the mock's static Kerala grid.
    const cells = await db
      .select({
        h3Cell: oceanGridSnapshots.h3Cell,
        value: oceanGridSnapshots.value,
        lat: oceanGridSnapshots.lat,
        lon: oceanGridSnapshots.lon,
      })
      .from(oceanGridSnapshots)
      .where(and(eq(oceanGridSnapshots.variable, 'sst'), eq(oceanGridSnapshots.date, snapshotDate)))
      .all();

    const rand = mulberry32(hashSeed(speciesId + snapshotDate));
    const preferredSst = speciesId === DEMO_SPECIES_ID ? 27.6 : 28.6;

    const results: SdmResult[] = cells.map((cell) => {
      const sst = cell.value ?? 28;
      // Coastline runs roughly along the eastern edge of the bbox; approximate
      // "distance offshore" as how far west (toward open sea) the cell sits --
      // same formula as the mock's `generateKeralaGrid`.
      const distanceFromCoastKm = Math.max(0, (KERALA_COAST_BOUNDS.maxLon - cell.lon) * 111);

      const sstDeviation = sst - preferredSst;
      const sstContribution = Math.max(-1, Math.min(1, -sstDeviation / 2));
      const coastalContribution = Math.max(0, 1 - distanceFromCoastKm / 120);
      const noise = (rand() - 0.5) * 0.15;

      const suitability = clamp01(0.5 + sstContribution * 0.35 + coastalContribution * 0.25 + noise);

      const shapValues: ShapValue[] = [
        { feature: 'SST anomaly', contribution: Number((sstContribution * 0.35).toFixed(3)) },
        { feature: 'Distance to coast', contribution: Number((coastalContribution * 0.25).toFixed(3)) },
        { feature: 'Chlorophyll-a', contribution: Number((noise * 0.4).toFixed(3)) },
      ];

      return {
        speciesId,
        h3Cell: cell.h3Cell,
        lat: cell.lat,
        lon: cell.lon,
        suitability: Number(suitability.toFixed(3)),
        shapValues,
        date: snapshotDate,
      };
    });

    return results;
  });
};

export default sdmRoutes;
