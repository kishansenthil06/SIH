import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { asvRecords, ednaSamples } from '../db/schema';

interface EdnaQuery {
  region?: string;
  taxonFilter?: string;
}

const ednaRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: EdnaQuery }>('/edna', async (request) => {
    const { taxonFilter } = request.query;
    // `region` is accepted for forward-compatibility but intentionally not
    // used to filter, matching the mock `queryEdna` behavior.

    const samples = await db.select().from(ednaSamples).all();

    const withDetections = await Promise.all(
      samples.map(async (sample) => {
        const detections = await db
          .select()
          .from(asvRecords)
          .where(eq(asvRecords.sampleId, sample.sampleId))
          .all();

        if (!taxonFilter) {
          return { ...sample, detections };
        }

        const needle = taxonFilter.toLowerCase();
        const filteredDetections = detections.filter((d) => d.taxon.toLowerCase().includes(needle));

        return { ...sample, detections: filteredDetections };
      })
    );

    // Mirror the mock `queryEdna` behavior: when filtering by taxon, drop any
    // sample left with zero matching detections.
    const results = taxonFilter ? withDetections.filter((s) => s.detections.length > 0) : withDetections;

    return results;
  });
};

export default ednaRoutes;
