import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { Role } from '@prisma/client';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Not authorized to access this route',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'The user belonging to this token no longer exists.',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'User account is not active.',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Not authorized to access this route',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'User role is not authorized to access this route',
        data: null,
        errors: null,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id || '',
      });
    }
    next();
  };
};
