import { asc, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { oceanTimeseries, speciesOccurrences } from '../db/schema';
import { TIMESERIES_END, TIMESERIES_START } from '../../../src/mock-data/constants';
import type { CorrelationResult } from '../../../src/types/correlation';

interface CorrelateQuery {
  variable?: string;
  speciesId?: string;
}

// Pearson correlation coefficient.
function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : num / denom;
}

// Rough p-value proxy derived from |r| and sample size -- good enough for a
// demo narrative, not a real statistical test.
function approxPValue(r: number, n: number): number {
  const t = Math.abs(r) * Math.sqrt((n - 2) / Math.max(1e-6, 1 - r * r));
  const p = Math.exp(-0.5 * t);
  return Math.max(0.0001, Math.min(0.5, p));
}

// Builds a month-by-month catch series over the seeded timeseries range,
// where every month within a given year is assigned that year's summed
// occurrence count (mirrors the mock's `monthlyCatchSeries` helper).
function buildMonthlyCatchSeries(byYear: Map<number, number>): { date: string; value: number }[] {
  const months: { date: string; value: number }[] = [];
  const start = new Date(TIMESERIES_START);
  const end = new Date(TIMESERIES_END);
  const cur = new Date(start);
  while (cur <= end) {
    const year = cur.getUTCFullYear();
    months.push({ date: cur.toISOString().slice(0, 10), value: byYear.get(year) ?? 0 });
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
  return months;
}

const correlateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: CorrelateQuery }>('/correlate', async (request, reply) => {
    const { variable, speciesId } = request.query;

    if (!variable) {
      return reply.status(400).send({ error: 'variable is required' });
    }
    if (!speciesId) {
      return reply.status(400).send({ error: 'speciesId is required' });
    }

    const oceanRows = await db
      .select({
        date: oceanTimeseries.date,
        value: oceanTimeseries.value,
        anomaly: oceanTimeseries.anomaly,
      })
      .from(oceanTimeseries)
      .where(eq(oceanTimeseries.variable, variable))
      .orderBy(asc(oceanTimeseries.date))
      .all();

    const occurrenceRows = await db
      .select({ date: speciesOccurrences.date, count: speciesOccurrences.count })
      .from(speciesOccurrences)
      .where(eq(speciesOccurrences.speciesId, speciesId))
      .all();

    const byYear = new Map<number, number>();
    for (const o of occurrenceRows) {
      const year = new Date(o.date).getUTCFullYear();
      byYear.set(year, (byYear.get(year) ?? 0) + (o.count ?? 0));
    }
    const catchSeries = buildMonthlyCatchSeries(byYear);

    const oceanValues = oceanRows.map((p) => p.anomaly ?? p.value);
    const catchValues = catchSeries.map((p) => p.value);

    const candidateLags = [0, 3, 6, 9, 12];
    let best = { lag: 0, r: 0 };
    for (const lag of candidateLags) {
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = lag; i < oceanValues.length; i++) {
        xs.push(oceanValues[i - lag]);
        ys.push(catchValues[i]);
      }
      const r = pearson(xs, ys);
      if (Math.abs(r) > Math.abs(best.r)) best = { lag, r };
    }

    const n = oceanValues.length - best.lag;
    const pValue = approxPValue(best.r, n);

    const series = oceanRows.slice(best.lag).map((p, i) => ({
      date: p.date,
      x: p.anomaly ?? p.value,
      y: catchSeries[i]?.value ?? 0,
    }));

    const direction = best.r < 0 ? 'inverse' : 'positive';
    const magnitude = Math.abs(best.r) > 0.5 ? 'strong' : Math.abs(best.r) > 0.3 ? 'moderate' : 'weak';
    const interpretation = `A ${magnitude} ${direction} relationship (r=${best.r.toFixed(2)}, p<${pValue.toFixed(3)}) between ${variable.toUpperCase()} anomaly and catch volume, with catch lagging ocean conditions by ${best.lag} month${best.lag === 1 ? '' : 's'}.`;

    const result: CorrelationResult = {
      variableX: variable,
      variableY: `${speciesId}_catch`,
      pearsonR: Number(best.r.toFixed(3)),
      pValue: Number(pValue.toFixed(4)),
      lagMonths: best.lag,
      series,
      interpretation,
    };

    return result;
  });
};

export default correlateRoutes;
