import { eq, inArray } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { graphEdges, graphNodes } from '../db/schema';
import type { GraphTraversalResult } from '../../../src/types/graph';

interface GraphTraverseQuery {
  rootSpeciesId?: string;
}

const graphRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: GraphTraverseQuery }>('/graph/traverse', async (request, reply) => {
    const { rootSpeciesId } = request.query;

    if (!rootSpeciesId) {
      return reply.status(400).send({ error: 'rootSpeciesId is required' });
    }

    // Every node directly reachable from the root, one hop out.
    const edges = await db
      .select()
      .from(graphEdges)
      .where(eq(graphEdges.source, rootSpeciesId))
      .all();

    const targetIds = Array.from(new Set(edges.map((e) => e.target)));
    const nodeIds = Array.from(new Set([rootSpeciesId, ...targetIds]));

    const nodes = await db.select().from(graphNodes).where(inArray(graphNodes.id, nodeIds)).all();

    const result: GraphTraversalResult = {
      rootId: rootSpeciesId,
      nodes,
      edges,
    };

    return result;
  });
};

export default graphRoutes;
