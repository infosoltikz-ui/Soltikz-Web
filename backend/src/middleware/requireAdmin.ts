import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { adminRole: true }
    });

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'ENTERPRISE')) {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
