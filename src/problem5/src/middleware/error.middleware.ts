import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/http-status';
import { ApiResponse } from '../utils/api-response';
import { logger } from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message ?? 'Internal Server Error';

  if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error('Unhandled error:', {
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};
