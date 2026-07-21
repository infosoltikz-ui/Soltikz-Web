import dotenv from 'dotenv';
dotenv.config();

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
import masterProfileRoutes from './routes/master-profile.route';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Needed for Google OAuth popup
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://soltikz-web.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow any *.vercel.app preview deployment OR an explicitly listed origin
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for serverless environment
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
    const { prisma } = require('./prisma');
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
app.use('/api/resumes', resumeRoutes); // alias without v1 for frontend
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/v1/cover-letter', coverLetterRoutes);
app.use('/api/cover-letter', coverLetterRoutes); // alias without v1
app.use('/api/master-profile', masterProfileRoutes);

import billingRoutes from './modules/billing/routes/billing.routes';
app.use('/api/v1', billingRoutes);

import adminRoutes from './modules/admin/routes/admin.routes';
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
