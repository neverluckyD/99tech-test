import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Problem 5 API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Resource management system',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateResourceDto: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string', maxLength: 1000 },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
          },
        },
        UpdateResourceDto: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string', maxLength: 1000 },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
