import cors from '@fastify/cors';
import Fastify from 'fastify';
import oceanRoutes from './routes/ocean';
import speciesRoutes from './routes/species';

const PORT = Number(process.env.PORT ?? 8787);
const HOST = '0.0.0.0';

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await app.register(speciesRoutes, { prefix: '/api/v1' });
  await app.register(oceanRoutes, { prefix: '/api/v1' });

  await app.listen({ port: PORT, host: HOST });

  app.log.info(`Server listening at http://localhost:${PORT}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
