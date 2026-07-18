import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminDashboardService {
  /**
   * Retrieves high-level KPIs and dashboard overview metrics.
   */
  public static async getOverview() {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { status: 'ACTIVE' }
    });
    
    // For revenue, we sum successful payments
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true }
    });
    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + curr.amount, 0);

    const totalResumes = await prisma.resume.count();
    const totalCoverLetters = await prisma.coverLetter.count();
    const totalAiGenerations = await prisma.aIUsage.count();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newUsersToday = await prisma.user.count({
      where: { createdAt: { gte: today } }
    });

    return {
      totalUsers,
      activeUsers,
      newUsersToday,
      totalRevenue,
      totalResumes,
      totalCoverLetters,
      totalAiGenerations,
      serverStatus: 'ONLINE',
      storageUsage: '124 GB', // Mocked or calculated
    };
  }

  /**
   * Get revenue trend (e.g. for charts)
   */
  public static async getRevenueTrend() {
    // Basic implementation - ideally you aggregate by month/day
    // Grouping by date in Prisma requires raw queries or complex aggregations.
    // For now, we return mock trend data or recent payments.
    const recentPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    
    return recentPayments;
  }
}
