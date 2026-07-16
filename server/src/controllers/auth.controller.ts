import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../utils/jwt.util';
import { sendEmail } from '../lib/nodemailer';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Email already exists', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {}
        }
      },
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // We can run this async without awaiting in a real app, but awaiting for now
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
      user.email,
      'Welcome! Please verify your email',
      `<h2>Welcome to AI ATS Resume Builder</h2><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    );

    const { accessToken, refreshToken } = generateTokens(user.id);
    
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Registration successful. Please verify your email.',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid credentials or inactive account', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid credentials', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }

    clearTokenCookies(res);

    if (req.user?.id) {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'LOGOUT',
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        }
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, statusCode: 401, message: 'No refresh token provided', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });

    const existingToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!existingToken || existingToken.revoked || existingToken.expiresAt < new Date()) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid or expired refresh token', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
    
    // Revoke old token and generate new pair
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revoked: true },
    });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    await prisma.refreshToken.create({
      data: {
        userId: decoded.id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ success: true, statusCode: 200, message: 'Token refreshed', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ success: true, statusCode: 200, message: 'If email exists, a reset link has been sent.', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      'Password Reset Request',
      `<h2>Password Reset</h2><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    res.status(200).json({ success: true, statusCode: 200, message: 'If email exists, a reset link has been sent.', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid or expired token', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });

    res.status(200).json({ success: true, statusCode: 200, message: 'Password has been reset successfully', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    const verificationRecord = await prisma.emailVerification.findUnique({ where: { token } });
    if (!verificationRecord || verificationRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Invalid or expired token', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
    }

    await prisma.user.update({
      where: { id: verificationRecord.userId },
      data: { emailVerified: true },
    });

    await prisma.emailVerification.delete({ where: { id: verificationRecord.id } });

    res.status(200).json({ success: true, statusCode: 200, message: 'Email has been verified successfully', data: null, errors: null, timestamp: new Date().toISOString(), requestId: (req as any).id || '' });
  } catch (error) {
    next(error);
  }
};
