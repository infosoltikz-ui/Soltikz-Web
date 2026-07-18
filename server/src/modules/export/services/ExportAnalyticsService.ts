import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ExportAnalyticsService {
  /**
   * Logs an export event
   */
  public static async logEvent(userId: string, resumeId: string, action: string, metadata?: any) {
    await prisma.exportAnalytics.create({
      data: {
        userId,
        resumeId,
        action,
        metadata
      }
    });
  }

  /**
   * Gets aggregate analytics for a user or global
   */
  public static async getAnalytics(userId: string) {
    const totalExports = await prisma.exportHistory.count({ where: { userId } });
    const successfulExports = await prisma.exportHistory.count({ where: { userId, status: 'SUCCESS' } });
    
    // Group by format
    const formatStats = await prisma.exportHistory.groupBy({
      by: ['format'],
      where: { userId, status: 'SUCCESS' },
      _count: true
    });

    // Group by template
    const templateStats = await prisma.exportHistory.groupBy({
      by: ['template'],
      where: { userId, status: 'SUCCESS' },
      _count: true
    });

    const totalShares = await prisma.resumeShare.count({ where: { userId } });

    return {
      totalExports,
      successfulExports,
      formatStats,
      templateStats,
      totalShares
    };
  }
}
