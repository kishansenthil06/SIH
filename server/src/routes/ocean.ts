import { and, eq, gte, lte } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { oceanGridSnapshots, oceanTimeseries } from '../db/schema';
import type { H3CellValue } from '../../../src/types/h3';

interface OceanTimeseriesQuery {
  variable?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
}

interface OceanSnapshotQuery {
  variable?: string;
  date?: string;
}

// Matches the mock's `runSdm` default date.
const DEFAULT_SNAPSHOT_DATE = '2024-06-01';

const oceanRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: OceanTimeseriesQuery }>(
    '/ocean/timeseries',
    async (request, reply) => {
      const { variable, startDate, endDate } = request.query;
      // `region` is accepted but intentionally not used to filter, matching
      // the mock `generateRegionTimeseries` behavior which always returns
      // the same Kerala-coast series regardless of the region argument.

      if (!variable) {
        return reply.status(400).send({ error: 'variable is required' });
      }

      const conditions = [eq(oceanTimeseries.variable, variable)];
      if (startDate) {
        conditions.push(gte(oceanTimeseries.date, startDate));
      }
      if (endDate) {
        conditions.push(lte(oceanTimeseries.date, endDate));
      }

      const points = await db
        .select({
          date: oceanTimeseries.date,
          variable: oceanTimeseries.variable,
          value: oceanTimeseries.value,
          h3Cell: oceanTimeseries.h3Cell,
          unit: oceanTimeseries.unit,
          anomaly: oceanTimeseries.anomaly,
        })
        .from(oceanTimeseries)
        .where(and(...conditions))
        .all();

      return points;
    }
  );

  fastify.get<{ Querystring: OceanSnapshotQuery }>(
    '/ocean/snapshot',
    async (request, reply) => {
      const { variable, date } = request.query;

      if (!variable) {
        return reply.status(400).send({ error: 'variable is required' });
      }

      const snapshotDate = date ?? DEFAULT_SNAPSHOT_DATE;

      const cells = await db
        .select({
          h3Cell: oceanGridSnapshots.h3Cell,
          value: oceanGridSnapshots.value,
          lat: oceanGridSnapshots.lat,
          lon: oceanGridSnapshots.lon,
        })
        .from(oceanGridSnapshots)
        .where(and(eq(oceanGridSnapshots.variable, variable), eq(oceanGridSnapshots.date, snapshotDate)))
        .all();

      const result: H3CellValue<number>[] = cells;

      return result;
    }
  );
};

export default oceanRoutes;
