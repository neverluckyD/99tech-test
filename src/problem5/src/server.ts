import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    // Verify DB connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(
        `Server is running on http://localhost:${env.PORT} [${env.NODE_ENV}]`,
      );
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();
