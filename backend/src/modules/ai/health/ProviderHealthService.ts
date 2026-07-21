import { AIProvider } from '@prisma/client';
import { ProviderManager } from '../services/ProviderManager';

export interface ProviderHealth {
  provider: AIProvider;
  status: 'ONLINE' | 'OFFLINE';
  latency: number;
  lastCheck: Date;
}

export class ProviderHealthService {
  private static healthCache: Map<AIProvider, ProviderHealth> = new Map();

  /**
   * Check health for a specific provider
   */
  public static async checkProvider(provider: AIProvider): Promise<ProviderHealth> {
    const aiProvider = ProviderManager.getInstance().getProvider(provider);
    
    const startTime = Date.now();
    let isOnline = false;
    
    try {
      isOnline = await aiProvider.healthCheck();
    } catch (error) {
      isOnline = false;
    }
    
    const latency = Date.now() - startTime;

    const health: ProviderHealth = {
      provider,
      status: isOnline ? 'ONLINE' : 'OFFLINE',
      latency,
      lastCheck: new Date(),
    };

    this.healthCache.set(provider, health);
    return health;
  }

  /**
   * Check health for all providers
   */
  public static async checkAll(): Promise<ProviderHealth[]> {
    const providers: AIProvider[] = ['OPENAI', 'CLAUDE', 'GEMINI'];
    const results = await Promise.all(providers.map(p => this.checkProvider(p)));
    return results;
  }

  /**
   * Get the current health status from cache (or check if not cached)
   */
  public static async getHealthStatus(provider: AIProvider): Promise<ProviderHealth> {
    const cached = this.healthCache.get(provider);
    
    // Refresh if older than 5 minutes
    if (cached && (Date.now() - cached.lastCheck.getTime() < 5 * 60 * 1000)) {
      return cached;
    }
    
    return this.checkProvider(provider);
  }

  /**
   * Get the best available fallback provider if the current one is offline.
   * Priority: OPENAI -> CLAUDE -> GEMINI
   */
  public static async getFallbackProvider(currentProvider: AIProvider): Promise<AIProvider | null> {
    const priority: AIProvider[] = ['OPENAI', 'CLAUDE', 'GEMINI'];
    
    for (const p of priority) {
      if (p !== currentProvider) {
        const health = await this.getHealthStatus(p);
        if (health.status === 'ONLINE') {
          return p;
        }
      }
    }
    
    return null;
  }
}
