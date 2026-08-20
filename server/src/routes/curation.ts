import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { curationTasks, otolithSpecimens } from '../db/schema';

interface SubmitCurationParams {
  taskId: string;
}

interface SubmitCurationBody {
  decision: 'accept' | 'override';
  specimenId: string;
  aiPrediction: string;
  aiConfidence: number;
  curatorDecision: string;
}

const curationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Params: SubmitCurationParams; Body: SubmitCurationBody }>(
    '/curation/tasks/:taskId/submit',
    async (request) => {
      const { taskId } = request.params;
      const { decision, specimenId, aiPrediction, aiConfidence, curatorDecision } = request.body;

      // No prior "create task" call ever happens server-side — curation tasks
      // are created client-side and only sent to the backend at submit time —
      // so this route upserts the full task record on first submit.
      const status = decision === 'accept' ? 'accepted' : 'overridden';
      const decidedAt = new Date().toISOString();

      await db.delete(curationTasks).where(eq(curationTasks.id, taskId));
      await db.insert(curationTasks).values({
        id: taskId,
        specimenId,
        aiPrediction,
        aiConfidence,
        status,
        curatorDecision,
        decidedAt,
      });

      await db
        .update(otolithSpecimens)
        .set({ status: 'curated' })
        .where(eq(otolithSpecimens.specimenId, specimenId));

      return { acknowledged: true };
    }
  );
};

export default curationRoutes;
