import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HttpStatus } from '../constants/http-status';
import { ApiResponse } from '../utils/api-response';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json(ApiResponse.validationError(messages));
        return;
      }
      next(error);
    }
  };
