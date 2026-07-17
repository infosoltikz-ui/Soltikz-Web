import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RateLimitService {
  /**
   * Check if a user has exceeded their rate limit.
   * Using a basic sliding window / counter implementation.
   */
  public static async checkRateLimit(userId: string, type: 'MINUTE' | 'HOUR' | 'DAY', limit: number): Promise<boolean> {
    const now = new Date();
    
    // Determine the reset time based on the type
    const resetAt = new Date(now);
    if (type === 'MINUTE') resetAt.setMinutes(now.getMinutes() + 1);
    else if (type === 'HOUR') resetAt.setHours(now.getHours() + 1);
    else if (type === 'DAY') resetAt.setDate(now.getDate() + 1);

    // Upsert the rate limit record
    const record = await prisma.aIRateLimit.upsert({
      where: {
        userId_type: {
          userId,
          type
        }
      },
      update: {},
      create: {
        userId,
        type,
        count: 0,
        resetAt
      }
    });

    // Check if window has expired
    if (now > record.resetAt) {
      // Reset the counter
      await prisma.aIRateLimit.update({
        where: { id: record.id },
        data: {
          count: 1,
          resetAt
        }
      });
      return true; // Allowed
    }

    // Check limit
    if (record.count >= limit) {
      return false; // Rate limited
    }

    // Increment
    await prisma.aIRateLimit.update({
      where: { id: record.id },
      data: {
        count: { increment: 1 }
      }
    });

    return true; // Allowed
  }
}
