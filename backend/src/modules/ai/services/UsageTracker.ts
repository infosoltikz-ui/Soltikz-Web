import { PrismaClient, AIProvider } from '@prisma/client';
import { CostCalculator } from './CostCalculator';

const prisma = new PrismaClient();

export interface TrackUsageParams {
  conversationId: string;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latency: number;
}

export class UsageTracker {
  public static async track(params: TrackUsageParams): Promise<void> {
    try {
      const totalTokens = params.promptTokens + params.completionTokens;
      const estimatedCost = CostCalculator.calculate(
        params.provider,
        params.model,
        params.promptTokens,
        params.completionTokens
      );

      await prisma.aIUsage.create({
        data: {
          conversationId: params.conversationId,
          provider: params.provider,
          model: params.model,
          promptTokens: params.promptTokens,
          completionTokens: params.completionTokens,
          totalTokens,
          estimatedCost: estimatedCost,
          latency: params.latency,
        },
      });
    } catch (error) {
      console.error('[UsageTracker] Failed to track usage:', error);
      // We don't throw here to avoid failing the main generation request
    }
  }
}
