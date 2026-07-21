import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BillingManagementService {
  /**
   * Get paginated payments
   */
  public static async getPayments(skip = 0, take = 50) {
    const payments = await prisma.payment.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        subscription: true
      }
    });

    const total = await prisma.payment.count();

    return { payments, total };
  }

  /**
   * Get subscriptions
   */
  public static async getSubscriptions(skip = 0, take = 50) {
    const subscriptions = await prisma.subscription.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const total = await prisma.subscription.count();
    
    return { subscriptions, total };
  }
}
