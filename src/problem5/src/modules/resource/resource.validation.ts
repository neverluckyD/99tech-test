import { z } from 'zod';

export const createResourceSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name cannot be empty')
      .max(255, 'Name must be at most 255 characters'),
    description: z.string().max(1000).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  }),
});

export const updateResourceSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID must be a valid UUID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const getResourceByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID must be a valid UUID'),
  }),
});
