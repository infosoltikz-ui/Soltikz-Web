import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsSummary {
  dailyRequests: number;
  monthlyRequests: number;
  successRate: number;
  avgLatency: number;
  avgCost: number;
  totalCost: number;
}

export class AIAnalytics {
  /**
   * Get overall analytics for a user.
   */
  public static async getAnalytics(userId: string): Promise<AnalyticsSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const logs = await prisma.aIAuditLog.findMany({
      where: { userId }
    });

    const dailyLogs = logs.filter(l => l.createdAt >= today);
    const monthlyLogs = logs.filter(l => l.createdAt >= firstDayOfMonth);

    const successfulLogs = monthlyLogs.filter(l => l.status === 'SUCCESS');
    const successRate = monthlyLogs.length > 0 ? (successfulLogs.length / monthlyLogs.length) * 100 : 100;

    const avgLatency = successfulLogs.length > 0 
      ? successfulLogs.reduce((acc, l) => acc + l.latency, 0) / successfulLogs.length 
      : 0;

    const totalCost = monthlyLogs.reduce((acc, l) => acc + Number(l.cost), 0);
    const avgCost = successfulLogs.length > 0 ? totalCost / successfulLogs.length : 0;

    return {
      dailyRequests: dailyLogs.length,
      monthlyRequests: monthlyLogs.length,
      successRate,
      avgLatency,
      avgCost,
      totalCost
    };
  }
}
