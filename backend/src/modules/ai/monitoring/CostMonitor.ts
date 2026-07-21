import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CostMonitor {
  /**
   * Check if a user has exceeded their monthly estimated cost limit.
   */
  public static async checkCostLimit(userId: string, limitInDollars: number = 10.00): Promise<boolean> {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const logs = await prisma.aIAuditLog.findMany({
      where: {
        userId,
        createdAt: { gte: firstDayOfMonth }
      }
    });

    const totalCost = logs.reduce((acc, log) => acc + Number(log.cost), 0);

    return totalCost < limitInDollars;
  }
}
