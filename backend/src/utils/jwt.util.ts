import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

export const generateTokens = (userId: string) => {
  const accessOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  };
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, accessOptions);

  const refreshOptions: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  };
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, refreshOptions);

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookies = (res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: new Date(0),
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: new Date(0),
  });
};
