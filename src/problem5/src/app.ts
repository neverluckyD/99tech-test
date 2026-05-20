import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { appRoutes } from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { logger } from './utils/logger';
import { swaggerSpec } from './config/swagger';

const app: Application = express();

// ─── Swagger Documentation ──────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Security & Parsing Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HTTP Logging ─────────────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', appRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
