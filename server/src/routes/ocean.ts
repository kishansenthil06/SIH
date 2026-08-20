import { and, eq, gte, lte } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { oceanTimeseries } from '../db/schema';

interface OceanTimeseriesQuery {
  variable?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
}

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
};

export default oceanRoutes;
