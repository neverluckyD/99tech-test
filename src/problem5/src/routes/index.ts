import { Router } from 'express';
import { resourceRouter } from '../modules/resource/resource.routes';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "ok" }
 *                 timestamp: { type: string, format: "date-time" }
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Module Routes ────────────────────────────────────────────────────────────
router.use('/resources', resourceRouter);

export { router as appRoutes };
