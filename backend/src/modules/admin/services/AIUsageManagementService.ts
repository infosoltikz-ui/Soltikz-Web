import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AIUsageManagementService {
  /**
   * Retrieves paginated AI usage logs
   */
  public static async getUsageLogs(skip = 0, take = 50) {
    const usage = await prisma.aIUsage.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        conversation: {
          select: {
            userId: true
          }
        }
      }
    });

    const total = await prisma.aIUsage.count();

    return { usage, total };
  }

  /**
   * Aggregates AI stats (e.g. total tokens, cost)
   */
  public static async getStats() {
    const usages = await prisma.aIUsage.findMany({
      select: { totalTokens: true, estimatedCost: true, provider: true }
    });

    const totalTokens = usages.reduce((acc, curr) => acc + curr.totalTokens, 0);
    const totalCost = usages.reduce((acc, curr) => acc + Number(curr.estimatedCost), 0);
    
    // Group by provider
    const providerUsage = usages.reduce((acc, curr) => {
      acc[curr.provider] = (acc[curr.provider] || 0) + curr.totalTokens;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTokens,
      totalCost,
      providerUsage
    };
  }
}
