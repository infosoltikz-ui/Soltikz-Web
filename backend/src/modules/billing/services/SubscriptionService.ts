import { PrismaClient } from '@prisma/client';
import { PlanService } from './PlanService';

const prisma = new PrismaClient();

export class SubscriptionService {
  /**
   * Retrieves the current active subscription for a user.
   */
  public static async getActiveSubscription(userId: string) {
    return prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Upgrades or Downgrades a user's subscription plan.
   * Called typically after a successful payment webhook or trial setup.
   */
  public static async updateSubscription(userId: string, planName: string, billingCycle: 'MONTHLY' | 'YEARLY') {
    const plan = await PlanService.getPlanByName(planName);
    if (!plan) throw new Error('Invalid plan name.');

    // Cancel existing active subscription if any
    const existing = await this.getActiveSubscription(userId);
    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: 'CANCELLED', expiryDate: new Date() }
      });
    }

    // Calculate next billing date
    const startDate = new Date();
    const nextBillingDate = new Date(startDate);
    if (billingCycle === 'MONTHLY') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // Create new subscription
    return prisma.subscription.create({
      data: {
        userId,
        plan: planName,
        status: 'ACTIVE',
        billingCycle,
        startDate,
        nextBillingDate,
        expiryDate: nextBillingDate,
      }
    });
  }

  /**
   * Cancels the active subscription. It will remain active until expiryDate.
   */
  public static async cancelSubscription(userId: string) {
    const active = await this.getActiveSubscription(userId);
    if (!active) throw new Error('No active subscription found.');

    return prisma.subscription.update({
      where: { id: active.id },
      data: {
        status: 'PENDING_CANCELLATION'
      }
    });
  }

  /**
   * Resumes a subscription that was pending cancellation.
   */
  public static async resumeSubscription(userId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'PENDING_CANCELLATION' },
      orderBy: { createdAt: 'desc' }
    });
    if (!sub) throw new Error('No subscription pending cancellation found.');

    return prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'ACTIVE' }
    });
  }
}
