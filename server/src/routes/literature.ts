import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { literature } from '../db/schema';
import type { LiteratureHit } from '../../../src/types/literature';

interface LiteratureSearchQuery {
  q?: string;
}

const literatureRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: LiteratureSearchQuery }>('/literature/search', async (request, reply) => {
    // Only reject when `q` is entirely absent from the querystring -- an
    // empty string is a valid query that returns everything unfiltered,
    // matching the mock's `searchLiteratureFixture` fallback behavior.
    if (request.query.q === undefined) {
      return reply.status(400).send({ error: 'q is required' });
    }

    const q = request.query.q.toLowerCase();
    const tokens = q.split(/\s+/).filter((token) => token.length > 2);

    const rows = await db.select().from(literature).all();

    const scored = rows.map((row) => {
      const hay = `${row.title} ${row.snippet}`.toLowerCase();
      const matches = tokens.filter((token) => hay.includes(token)).length;
      return { row, matches };
    });

    const anyMatch = scored.some((s) => s.matches > 0);
    const results = anyMatch ? scored.filter((s) => s.matches > 0) : scored;

    const hits: LiteratureHit[] = results.map((s) => s.row).sort((a, b) => b.relevance - a.relevance);

    return hits;
  });
};

export default literatureRoutes;
