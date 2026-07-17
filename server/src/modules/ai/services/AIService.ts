import { PrismaClient, AIProvider as PrismaAIProvider } from '@prisma/client';
import { ProviderManager } from './ProviderManager';
import { PromptRegistry } from '../prompts/PromptRegistry';
import { PromptCache } from '../cache/PromptCache';
import { RateLimitService } from '../rate-limit/RateLimitService';
import { AISecurityService } from '../security/AISecurityService';
import { ProviderHealthService } from '../health/ProviderHealthService';
import { CostMonitor } from '../monitoring/CostMonitor';
import { UsageTracker } from './UsageTracker';
import { CostCalculator } from './CostCalculator';
import { GenerateResponse } from '../providers/AIProvider.interface';

const prisma = new PrismaClient();

export class AIService {
  public static async generate(
    userId: string,
    resumeId: string | undefined,
    promptCategory: string,
    variables: Record<string, string>,
    conversationId?: string
  ): Promise<GenerateResponse> {
    
    // 1. Load Settings
    const settings = await prisma.aISettings.findUnique({
      where: { userId },
    });
    
    let providerEnum = settings?.provider || 'OPENAI';
    const model = settings?.preferredModel;
    const temperature = settings?.temperature || 0.7;
    const maxTokens = settings?.maxTokens || 1000;

    // 2. Security & Rate Limiting
    const isAllowed = await RateLimitService.checkRateLimit(userId, 'MINUTE', 20); // 20 requests per minute
    if (!isAllowed) throw new Error('Rate limit exceeded. Please try again later.');

    const withinBudget = await CostMonitor.checkCostLimit(userId, 10.00);
    if (!withinBudget) throw new Error('Monthly AI budget exceeded.');

    // 3. Load & Validate Prompt
    const promptDef = await PromptRegistry.getPrompt(promptCategory, providerEnum);
    if (!promptDef) throw new Error(`Prompt definition not found for category: ${promptCategory}`);
    
    PromptRegistry.validateVariables(promptDef, variables);
    const systemPrompt = promptDef.systemPrompt;
    let userPrompt = PromptRegistry.substitute(promptDef.userPrompt, variables);
    
    AISecurityService.validatePrompt(userPrompt);

    // 4. Provider Health & Fallback
    const health = await ProviderHealthService.getHealthStatus(providerEnum);
    if (health.status === 'OFFLINE') {
      const fallback = await ProviderHealthService.getFallbackProvider(providerEnum);
      if (fallback) {
        providerEnum = fallback;
      } else {
        throw new Error('All AI providers are currently offline.');
      }
    }

    // 5. Check Cache
    const hashKey = PromptCache.generateHash(providerEnum, model || 'default', systemPrompt, userPrompt);
    const cachedResponse = await PromptCache.getCache(hashKey);
    if (cachedResponse) {
      return {
        success: true,
        provider: providerEnum,
        model: model || 'default',
        message: 'Returned from cache',
        tokens: { prompt: 0, completion: 0, total: 0 },
        latency: 0,
        cost: 0,
        response: cachedResponse,
      };
    }

    // 6. Choose Provider & Generate
    const providerManager = ProviderManager.getInstance();
    const aiProvider = providerManager.getProvider(providerEnum);

    try {
      const response = await aiProvider.generate({
        systemPrompt,
        userPrompt,
        model,
        temperature,
        maxTokens,
      });

      response.response = AISecurityService.sanitizeOutput(response.response);

      // Save Cache
      await PromptCache.setCache(hashKey, providerEnum, response.model, response.response, response.tokens.total);

      // Save Conversation & Audit
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        const conv = await prisma.aIConversation.create({
          data: {
            userId,
            resumeId,
            provider: providerEnum as PrismaAIProvider,
            title: `Generated ${promptCategory}`,
          },
        });
        activeConversationId = conv.id;
      }

      await prisma.aIMessage.createMany({
        data: [
          { conversationId: activeConversationId, role: 'USER', content: userPrompt, tokens: response.tokens.prompt },
          { conversationId: activeConversationId, role: 'ASSISTANT', content: response.response, tokens: response.tokens.completion }
        ]
      });

      await UsageTracker.track({
        conversationId: activeConversationId,
        provider: providerEnum as PrismaAIProvider,
        model: response.model,
        promptTokens: response.tokens.prompt,
        completionTokens: response.tokens.completion,
        latency: response.latency,
      });

      await prisma.aIAuditLog.create({
        data: {
          userId,
          conversationId: activeConversationId,
          promptId: promptDef.id,
          provider: providerEnum as PrismaAIProvider,
          model: response.model,
          tokens: response.tokens.total,
          latency: response.latency,
          cost: response.cost,
          status: 'SUCCESS'
        }
      });

      return response;
    } catch (error: any) {
      await prisma.aIAuditLog.create({
        data: {
          userId,
          conversationId,
          promptId: promptDef.id,
          provider: providerEnum as PrismaAIProvider,
          model: model || 'unknown',
          tokens: 0,
          latency: 0,
          cost: 0,
          status: 'FAILED',
          errorMessage: error.message
        }
      });
      throw error;
    }
  }

  public static async stream(
    userId: string,
    resumeId: string | undefined,
    promptCategory: string,
    variables: Record<string, string>,
    onChunk: (chunk: string) => void,
    onComplete?: (response: GenerateResponse) => void,
    onError?: (error: any) => void,
    conversationId?: string
  ): Promise<void> {
    
    const settings = await prisma.aISettings.findUnique({
      where: { userId },
    });
    
    let providerEnum = settings?.provider || 'OPENAI';
    const model = settings?.preferredModel;
    const temperature = settings?.temperature || 0.7;
    const maxTokens = settings?.maxTokens || 1000;

    try {
      const isAllowed = await RateLimitService.checkRateLimit(userId, 'MINUTE', 20);
      if (!isAllowed) throw new Error('Rate limit exceeded.');

      const withinBudget = await CostMonitor.checkCostLimit(userId, 10.00);
      if (!withinBudget) throw new Error('Monthly AI budget exceeded.');

      const promptDef = await PromptRegistry.getPrompt(promptCategory, providerEnum);
      if (!promptDef) throw new Error(`Prompt definition not found: ${promptCategory}`);
      
      PromptRegistry.validateVariables(promptDef, variables);
      const systemPrompt = promptDef.systemPrompt;
      const userPrompt = PromptRegistry.substitute(promptDef.userPrompt, variables);
      
      AISecurityService.validatePrompt(userPrompt);

      const health = await ProviderHealthService.getHealthStatus(providerEnum);
      if (health.status === 'OFFLINE') {
        const fallback = await ProviderHealthService.getFallbackProvider(providerEnum);
        if (fallback) providerEnum = fallback;
        else throw new Error('All AI providers are currently offline.');
      }

      // Stream doesn't check cache (streams are dynamic) but could if needed.
      const providerManager = ProviderManager.getInstance();
      const aiProvider = providerManager.getProvider(providerEnum);
      
      let fullContent = '';
      const startTime = Date.now();

      await aiProvider.stream({
        systemPrompt,
        userPrompt,
        model,
        temperature,
        maxTokens,
        onChunk: (chunk) => {
          const safeChunk = AISecurityService.sanitizeOutput(chunk);
          fullContent += safeChunk;
          onChunk(safeChunk);
        },
        onComplete: async () => {
          const latency = Date.now() - startTime;
          const promptTokens = aiProvider.estimateTokens(systemPrompt + userPrompt);
          const completionTokens = aiProvider.estimateTokens(fullContent);
          const totalTokens = promptTokens + completionTokens;
          
          let cost = 0;
          if (model) {
             cost = CostCalculator.calculate(providerEnum as any, model, promptTokens, completionTokens);
          }

          let activeConversationId = conversationId;
          if (!activeConversationId) {
            const conv = await prisma.aIConversation.create({
              data: { userId, resumeId, provider: providerEnum as PrismaAIProvider, title: `Generated ${promptCategory}` },
            });
            activeConversationId = conv.id;
          }

          await prisma.aIAuditLog.create({
            data: {
              userId,
              conversationId: activeConversationId,
              promptId: promptDef.id,
              provider: providerEnum as PrismaAIProvider,
              model: model || 'unknown',
              tokens: totalTokens,
              latency,
              cost,
              status: 'SUCCESS'
            }
          });

          if (onComplete) {
            onComplete({
              success: true,
              provider: providerEnum,
              model: model || 'default',
              message: 'Stream completed successfully',
              tokens: { prompt: promptTokens, completion: completionTokens, total: totalTokens },
              latency,
              cost,
              response: fullContent
            });
          }
        },
        onError: async (err) => {
          await prisma.aIAuditLog.create({
            data: {
              userId,
              conversationId,
              promptId: promptDef.id,
              provider: providerEnum as PrismaAIProvider,
              model: model || 'unknown',
              tokens: 0,
              latency: 0,
              cost: 0,
              status: 'FAILED',
              errorMessage: err.message
            }
          });
          console.error('[AIService] Stream Error:', err);
          if (onError) onError(err);
        }
      });
    } catch (e: any) {
      if (onError) onError(e);
    }
  }
}
