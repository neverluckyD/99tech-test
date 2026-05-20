import { Router } from 'express';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ResourceRepository } from './resource.repository';
import { validate } from '../../middleware/validate.middleware';
import { createResourceSchema, updateResourceSchema } from './resource.validation';

const router = Router();

// ─── Dependency Injection ─────────────────────────────────────────────────────
const repository = new ResourceRepository();
const service = new ResourceService(repository);
const controller = new ResourceController(service);

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management API
 */

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: List resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: 'createdAt' }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Create resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourceDto'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation Error
 */
router.post('/', validate(createResourceSchema), controller.create);

/**
 * @swagger
 * /resources/{id}:
 *   put:
 *     summary: Update resource
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateResourceDto'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not Found
 */
router.put('/:id', validate(updateResourceSchema), controller.update);

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Delete resource
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 */
router.delete('/:id', controller.delete);

export { router as resourceRouter };
