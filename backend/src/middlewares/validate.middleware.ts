import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Validation failed',
          errors: error.issues,
          data: null,
          timestamp: new Date().toISOString(),
          requestId: (req as any).id || '',
        });
      }
      return next(error);
    }
  };
};
