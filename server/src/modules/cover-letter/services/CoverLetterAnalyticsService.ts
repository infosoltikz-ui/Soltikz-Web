import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CoverLetterAnalyticsService {
  /**
   * Logs an analytics event for Cover Letters.
   */
  public static async logAction(
    userId: string, 
    action: string, 
    data?: { tokens?: number; cost?: number; template?: string; metadata?: any }
  ) {
    return prisma.coverLetterAnalytics.create({
      data: {
        userId,
        action,
        tokens: data?.tokens,
        cost: data?.cost,
        template: data?.template,
        metadata: data?.metadata || {}
      }
    });
  }

  /**
   * Fetches aggregate analytics for a user's cover letter activity.
   */
  public static async getAnalytics(userId: string) {
    const analytics = await prisma.coverLetterAnalytics.findMany({
      where: { userId }
    });

    const totalGenerated = analytics.filter(a => a.action === 'GENERATION').length;
    const totalExports = analytics.filter(a => a.action === 'EXPORT').length;
    const totalCost = analytics.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    const totalTokens = analytics.reduce((sum, a) => sum + (a.tokens || 0), 0);

    return {
      totalGenerated,
      totalExports,
      totalCost,
      totalTokens,
      history: analytics
    };
  }
}
