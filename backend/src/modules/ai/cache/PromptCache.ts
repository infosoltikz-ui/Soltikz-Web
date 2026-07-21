import { PrismaClient, AIProvider } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class PromptCache {
  /**
   * Generates a unique hash for a request to check cache.
   */
  public static generateHash(provider: AIProvider, model: string, systemPrompt: string, userPrompt: string): string {
    const data = `${provider}:${model}:${systemPrompt}:${userPrompt}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Fetch cached response if it exists and hasn't expired.
   */
  public static async getCache(hashKey: string): Promise<string | null> {
    const cached = await prisma.aICache.findUnique({
      where: { hashKey },
    });

    if (!cached) return null;

    if (new Date() > cached.expiresAt) {
      // Clean up expired cache asynchronously
      this.clearCache(hashKey).catch(console.error);
      return null;
    }

    return cached.response;
  }

  /**
   * Store a response in the cache.
   * TTL default is 24 hours.
   */
  public static async setCache(
    hashKey: string,
    provider: AIProvider,
    model: string,
    response: string,
    tokens: number,
    ttlInSeconds: number = 86400
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlInSeconds * 1000);

    await prisma.aICache.upsert({
      where: { hashKey },
      update: {
        response,
        tokens,
        expiresAt,
        updatedAt: new Date() // if we had an updatedAt
      } as any,
      create: {
        hashKey,
        provider,
        model,
        response,
        tokens,
        expiresAt,
      },
    });
  }

  /**
   * Clear a specific cache entry.
   */
  public static async clearCache(hashKey: string): Promise<void> {
    await prisma.aICache.delete({
      where: { hashKey }
    });
  }

  /**
   * Clear all expired caches.
   */
  public static async clearExpiredCaches(): Promise<number> {
    const result = await prisma.aICache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  }
}
