import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

import authRoutes from './routes/auth.route';
import profileRoutes from './routes/profile.route';
import notificationRoutes from './routes/notification.route';
import resumeRoutes from './routes/resume.route';
import aiRoutes from './modules/ai/ai.routes';
import exportRoutes from './routes/export.routes';
import coverLetterRoutes from './routes/cover-letter.routes';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Request ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).id = crypto.randomUUID();
  next();
});

// Health Check Endpoint
app.get('/api/v1/health', async (req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    const { prisma } = require('./server');
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = 'error';
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Health Check Successful',
    data: {
      server: 'ok',
      database: dbStatus,
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
    errors: null,
    timestamp: new Date().toISOString(),
    requestId: (req as any).id,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/v1/cover-letter', coverLetterRoutes);

import billingRoutes from './modules/billing/routes/billing.routes';
app.use('/api/v1', billingRoutes);

import adminRoutes from './modules/admin/routes/admin.routes';
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
