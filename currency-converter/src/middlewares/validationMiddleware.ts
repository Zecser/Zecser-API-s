import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { CustomError } from './errorHandler';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const customError: CustomError = new Error('Validation failed');
        customError.statusCode = 400;
        (customError as any).details = error.errors;
        next(customError);
      } else {
        next(error);
      }
    }
  };
};
