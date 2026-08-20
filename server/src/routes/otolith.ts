import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db/client';
import { otolithPredictions, otolithSpecimens } from '../db/schema';
import { SPECIES_CATALOG } from '../../../src/mock-data/constants';
import { mulberry32, seededRange } from '../../../src/utils/seededRandom';

interface ClassifyParams {
  specimenId: string;
}

interface Centroid {
  speciesId: string;
  scientificName: string;
  circularity: number;
  rectangularity: number;
  aspectRatio: number;
}

// Deterministic, distinct reference centroid per catalog species so
// nearest-neighbor classification below is meaningful rather than degenerate.
const CENTROIDS: Centroid[] = SPECIES_CATALOG.map((species, index) => ({
  speciesId: species.speciesId,
  scientificName: species.scientificName,
  circularity: 0.55 + index * 0.08,
  rectangularity: 0.5 + index * 0.07,
  aspectRatio: 1.1 + index * 0.35,
}));

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return h || 1;
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Centroid, b: { circularity: number; rectangularity: number; aspectRatio: number }): number {
  return Math.sqrt(
    (a.circularity - b.circularity) ** 2 +
      (a.rectangularity - b.rectangularity) ** 2 +
      (a.aspectRatio - b.aspectRatio) ** 2
  );
}

const otolithRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/otolith/specimens', async () => {
    const specimens = await db
      .select({
        specimenId: otolithSpecimens.specimenId,
        imageColor: otolithSpecimens.imageColor,
        collectedAt: otolithSpecimens.collectedAt,
        stationName: otolithSpecimens.stationName,
        lengthMm: otolithSpecimens.lengthMm,
        status: otolithSpecimens.status,
      })
      .from(otolithSpecimens)
      .all();

    return specimens;
  });

  fastify.post<{ Params: ClassifyParams }>('/otolith/:specimenId/classify', async (request, reply) => {
    const { specimenId } = request.params;

    const [specimen] = await db
      .select({
        specimenId: otolithSpecimens.specimenId,
        lengthMm: otolithSpecimens.lengthMm,
        trueSpeciesId: otolithSpecimens.trueSpeciesId,
      })
      .from(otolithSpecimens)
      .where(eq(otolithSpecimens.specimenId, specimenId))
      .all();

    if (!specimen) {
      return reply.status(404).send({ error: 'specimen not found' });
    }

    const trueCentroid = CENTROIDS.find((c) => c.speciesId === specimen.trueSpeciesId) ?? CENTROIDS[0];

    // Seeded RNG keyed off the specimen id so results are deterministic and
    // reproducible across requests, but not identical across specimens.
    const rand = mulberry32(hashSeed(specimenId));

    const actual = {
      circularity: trueCentroid.circularity + seededRange(rand, -0.08, 0.08),
      rectangularity: trueCentroid.rectangularity + seededRange(rand, -0.08, 0.08),
      aspectRatio: trueCentroid.aspectRatio + seededRange(rand, -0.08, 0.08),
    };

    const ranked = CENTROIDS.map((c) => ({ ...c, dist: distance(c, actual) })).sort((a, b) => a.dist - b.dist);

    const [nearest, second, third] = ranked;

    const confidence = round(clamp(0.5 + (second.dist - nearest.dist), 0.55, 0.97), 2);

    const alternatives = [second, third].map((entry, i) => {
      const altConfidence = round(clamp(confidence - 0.15 - i * 0.1 - entry.dist * 0.05, 0.05, confidence - 0.05), 2);
      return {
        speciesId: entry.speciesId,
        scientificName: entry.scientificName,
        confidence: altConfidence,
      };
    });

    const shapeDescriptors = {
      circularity: round(actual.circularity, 3),
      rectangularity: round(actual.rectangularity, 3),
      aspectRatio: round(actual.aspectRatio, 3),
    };

    const modelVersion = 'heuristic-v1';

    // Upsert into otolith_predictions (delete-then-insert, keyed by specimenId).
    await db.delete(otolithPredictions).where(eq(otolithPredictions.specimenId, specimenId));
    await db.insert(otolithPredictions).values({
      specimenId,
      predictedSpeciesId: nearest.speciesId,
      predictedScientificName: nearest.scientificName,
      confidence,
      alternatives: JSON.stringify(alternatives),
      circularity: shapeDescriptors.circularity,
      rectangularity: shapeDescriptors.rectangularity,
      aspectRatio: shapeDescriptors.aspectRatio,
      modelVersion,
    });

    await db.update(otolithSpecimens).set({ status: 'classified' }).where(eq(otolithSpecimens.specimenId, specimenId));

    return {
      specimenId,
      predictedSpeciesId: nearest.speciesId,
      predictedScientificName: nearest.scientificName,
      confidence,
      alternatives,
      shapeDescriptors,
      modelVersion,
    };
  });
};

export default otolithRoutes;
