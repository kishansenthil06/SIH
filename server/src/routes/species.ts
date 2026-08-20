import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { speciesOccurrences } from '../db/schema';

interface SpeciesOccurrencesParams {
  speciesId: string;
}

interface SpeciesOccurrencesQuery {
  region?: string;
}

const speciesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: SpeciesOccurrencesParams; Querystring: SpeciesOccurrencesQuery }>(
    '/species/:speciesId/occurrences',
    async (request) => {
      const { speciesId } = request.params;
      // `region` is accepted for forward-compatibility but intentionally not
      // used to filter, matching the mock `getOccurrencesForSpecies` behavior.

      const occurrences = await db
        .select()
        .from(speciesOccurrences)
        .where(eq(speciesOccurrences.speciesId, speciesId))
        .all();

      return occurrences;
    }
  );
};

export default speciesRoutes;
