import { Request, Response } from 'express';
import { ExperienceRewriteService } from './services/ExperienceRewriteService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ExperienceRewriteController {
  public static async rewrite(req: Request, res: Response) {
    try {
      const { resumeId, experienceId, options, conversationId } = req.body;
      // @ts-ignore
      const userId = req.user?.id;

      if (!resumeId || !experienceId) {
        return res.status(400).json({ error: 'resumeId and experienceId are required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const response = await ExperienceRewriteService.rewriteExperience(
        userId,
        resumeId,
        experienceId,
        options || {},
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[ExperienceRewriteController.rewrite] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  public static async stream(req: Request, res: Response) {
    try {
      const { resumeId, experienceId, options, conversationId } = req.body;
      // @ts-ignore
      const userId = req.user?.id;

      if (!resumeId || !experienceId) {
        return res.status(400).json({ error: 'resumeId and experienceId are required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Same as summary, defaulting to rewrite if stream not implemented in AIService yet
      const response = await ExperienceRewriteService.rewriteExperience(
        userId,
        resumeId,
        experienceId,
        options || {},
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[ExperienceRewriteController.stream] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getHistory(req: Request, res: Response) {
    try {
      const { resumeId } = req.query;
      // @ts-ignore
      const userId = req.user?.id;

      const whereClause: any = { userId };
      if (resumeId) {
        whereClause.resumeId = resumeId as string;
      }

      // NOTE: We could add a filter for PromptCategory = EXPERIENCE if needed.
      // But we just pull from AIConversation.

      const history = await prisma.aIConversation.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { messages: true }
      });

      return res.status(200).json(history);
    } catch (error: any) {
      console.error('[ExperienceRewriteController.getHistory] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
