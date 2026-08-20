import cors from '@fastify/cors';
import Fastify from 'fastify';
import correlateRoutes from './routes/correlate';
import curationRoutes from './routes/curation';
import ednaRoutes from './routes/edna';
import graphRoutes from './routes/graph';
import { ingestionRoutes } from './routes/ingestion';
import literatureRoutes from './routes/literature';
import oceanRoutes from './routes/ocean';
import otolithRoutes from './routes/otolith';
import sdmRoutes from './routes/sdm';
import speciesRoutes from './routes/species';

const PORT = Number(process.env.PORT ?? 8787);
const HOST = '0.0.0.0';

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await app.register(speciesRoutes, { prefix: '/api/v1' });
  await app.register(oceanRoutes, { prefix: '/api/v1' });
  await app.register(correlateRoutes, { prefix: '/api/v1' });
  await app.register(ednaRoutes, { prefix: '/api/v1' });
  await app.register(sdmRoutes, { prefix: '/api/v1' });
  await app.register(literatureRoutes, { prefix: '/api/v1' });
  await app.register(graphRoutes, { prefix: '/api/v1' });
  await app.register(otolithRoutes, { prefix: '/api/v1' });
  await app.register(ingestionRoutes, { prefix: '/api/v1' });
  await app.register(curationRoutes, { prefix: '/api/v1' });

  await app.listen({ port: PORT, host: HOST });

  app.log.info(`Server listening at http://localhost:${PORT}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
