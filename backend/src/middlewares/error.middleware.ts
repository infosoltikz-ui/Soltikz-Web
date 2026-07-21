import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    errors: err.errors || null,
    timestamp: new Date().toISOString(),
    requestId: (req as any).id || '',
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'API Endpoint Not Found',
    data: null,
    errors: null,
    timestamp: new Date().toISOString(),
    requestId: (req as any).id || '',
  });
};
