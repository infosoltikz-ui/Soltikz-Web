import { PrismaClient } from '@prisma/client';
import { PlanService } from './PlanService';

const prisma = new PrismaClient();

export type FeatureLimit = 'resumes' | 'coverLetters' | 'aiGenerations' | 'atsScans';

export class UsageTrackingService {
  /**
   * Initializes or fetches usage for a user
   */
  public static async getUsage(userId: string) {
    let usage = await prisma.usage.findUnique({ where: { userId } });
    if (!usage) {
      usage = await prisma.usage.create({ data: { userId } });
    }
    return usage;
  }

  /**
   * Check if user is within limits for a specific feature
   */
  public static async checkLimit(userId: string, feature: FeatureLimit, amountToConsume: number = 1) {
    const usage = await this.getUsage(userId);
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });

    const planName = subscription ? subscription.plan : 'Free';
    const plan = await PlanService.getPlanByName(planName);
    
    if (!plan) throw new Error('Plan configuration not found.');

    const limits = plan.limits as any;
    const limit = limits[feature];

    if (limit === -1) return true; // Unlimited

    let currentUsage = 0;
    switch(feature) {
      case 'resumes': currentUsage = usage.resumeCount; break;
      case 'coverLetters': currentUsage = usage.coverLetterCount; break;
      case 'aiGenerations': currentUsage = usage.resumeAnalyzerCount; break; // Map aiGenerations to resumeAnalyzerCount
      case 'atsScans': currentUsage = usage.atsScans; break;
    }

    if (currentUsage + amountToConsume > limit) {
      throw new Error(`Usage limit exceeded for ${feature}. Please upgrade your plan to continue.`);
    }

    return true;
  }

  /**
   * Increment usage counter for a given feature
   */
  public static async incrementUsage(userId: string, feature: FeatureLimit | 'exports', amount: number = 1) {
    const updateData: any = {};
    if (feature === 'resumes') updateData.resumeCount = { increment: amount };
    if (feature === 'coverLetters') updateData.coverLetterCount = { increment: amount };
    if (feature === 'atsScans') updateData.atsScans = { increment: amount };
    if (feature === 'exports') updateData.exports = { increment: amount };
    if (feature === 'aiGenerations') updateData.resumeAnalyzerCount = { increment: amount }; 

    await this.getUsage(userId); // ensure usage exists

    return prisma.usage.update({
      where: { userId },
      data: updateData
    });
  }
}
