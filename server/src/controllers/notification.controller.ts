import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: notifications,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Unread count retrieved successfully',
      data: { count },
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const notification = await prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Notification marked as read',
      data: notification,
      errors: null,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || '',
    });
  } catch (error) {
    next(error);
  }
};
