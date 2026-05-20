import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/http-status';
import { ApiResponse } from '../utils/api-response';

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json(ApiResponse.error(`Route ${req.method} ${req.path} not found`, HttpStatus.NOT_FOUND));
};
