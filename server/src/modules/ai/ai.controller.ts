import { Request, Response } from 'express';
import { AIService } from './services/AIService';
import { PrismaClient, AIProvider } from '@prisma/client';

const prisma = new PrismaClient();

export class AIController {
  
  public static async generate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { promptType, variables, resumeId, conversationId } = req.body;

      if (!promptType || !variables) {
        return res.status(400).json({ error: 'Missing promptType or variables' });
      }

      const response = await AIService.generate(userId, resumeId, promptType, variables, conversationId);

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[AIController] Generate error:', error);
      return res.status(500).json({ error: error.message || 'Generation failed' });
    }
  }

  public static async stream(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { promptType, variables, resumeId, conversationId } = req.body;

      if (!promptType || !variables) {
        return res.status(400).json({ error: 'Missing promptType or variables' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await AIService.stream(
        userId,
        resumeId,
        promptType,
        variables,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
        },
        (response) => {
          res.write(`data: ${JSON.stringify({ type: 'done', response })}\n\n`);
          res.end();
        },
        (error) => {
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
          res.end();
        },
        conversationId
      );

    } catch (error: any) {
      console.error('[AIController] Stream error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }

  public static async getSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      let settings = await prisma.aISettings.findUnique({
        where: { userId },
      });

      if (!settings) {
        settings = await prisma.aISettings.create({
          data: {
            userId,
            provider: 'OPENAI',
            preferredModel: 'gpt-4o-mini',
          },
        });
      }

      return res.status(200).json(settings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async updateSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { provider, preferredModel, temperature, maxTokens, stream, language, tone } = req.body;

      const settings = await prisma.aISettings.upsert({
        where: { userId },
        update: {
          provider,
          preferredModel,
          temperature,
          maxTokens,
          stream,
          language,
          tone,
        },
        create: {
          userId,
          provider: provider || 'OPENAI',
          preferredModel: preferredModel || 'gpt-4o-mini',
          temperature,
          maxTokens,
          stream,
          language,
          tone,
        },
      });

      return res.status(200).json(settings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const history = await prisma.aIConversation.findMany({
        where: { userId },
        include: {
          messages: true,
          usage: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(history);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const conversation = await prisma.aIConversation.findUnique({
        where: { id: id as string },
        include: { messages: true },
      });
      return res.status(200).json(conversation);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- Platform Endpoints ---

  public static async getHealth(req: Request, res: Response) {
    try {
      const { ProviderHealthService } = await import('./health/ProviderHealthService');
      const health = await ProviderHealthService.checkAll();
      return res.status(200).json(health);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      
      const { AIAnalytics } = await import('./analytics/AIAnalytics');
      const stats = await AIAnalytics.getAnalytics(userId);
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getPrompts(req: Request, res: Response) {
    try {
      const prompts = await prisma.aIPrompt.findMany({
        orderBy: [{ category: 'asc' }, { version: 'desc' }]
      });
      return res.status(200).json(prompts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async clearCache(req: Request, res: Response) {
    try {
      const { PromptCache } = await import('./cache/PromptCache');
      const count = await PromptCache.clearExpiredCaches();
      return res.status(200).json({ message: `Cleared ${count} expired caches` });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
