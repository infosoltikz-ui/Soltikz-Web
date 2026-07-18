import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from './SubscriptionService';
import { UsageTrackingService } from './UsageTrackingService';

const prisma = new PrismaClient();

export class BillingService {
  /**
   * Generates a dashboard summary for the user
   */
  public static async getBillingDashboardSummary(userId: string) {
    const subscription = await SubscriptionService.getActiveSubscription(userId);
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    const usage = await UsageTrackingService.getUsage(userId);
    
    let pendingCancellation = false;
    if (!subscription) {
      const pendingSub = await prisma.subscription.findFirst({
        where: { userId, status: 'PENDING_CANCELLATION' },
        orderBy: { createdAt: 'desc' }
      });
      if (pendingSub) pendingCancellation = true;
    }

    return {
      currentPlan: subscription?.plan || 'Free',
      status: subscription?.status || (pendingCancellation ? 'PENDING_CANCELLATION' : 'INACTIVE'),
      nextBillingDate: subscription?.nextBillingDate,
      billingCycle: subscription?.billingCycle,
      usage,
      invoices,
    };
  }
}
