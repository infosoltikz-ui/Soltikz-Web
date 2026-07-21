import { Request, Response } from 'express';
import { AchievementGenerationService } from './services/AchievementGenerationService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AchievementGenerationController {
  public static async generate(req: Request, res: Response) {
    try {
      const { resumeId, options, conversationId } = req.body;
      // @ts-ignore
      const userId = req.user?.id;

      if (!resumeId) {
        return res.status(400).json({ error: 'resumeId is required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!options?.achievementId) {
        return res.status(400).json({ error: 'options.achievementId is required' });
      }

      const response = await AchievementGenerationService.generateAchievement(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[AchievementGenerationController.generate] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  public static async stream(req: Request, res: Response) {
    try {
      const { resumeId, options, conversationId } = req.body;
      // @ts-ignore
      const userId = req.user?.id;

      if (!resumeId) {
        return res.status(400).json({ error: 'resumeId is required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!options?.achievementId) {
        return res.status(400).json({ error: 'options.achievementId is required' });
      }

      // Default to generate if stream not fully separate in AIService
      const response = await AchievementGenerationService.generateAchievement(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[AchievementGenerationController.stream] Error:', error.message);
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

      const history = await prisma.aIConversation.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { messages: true }
      });

      return res.status(200).json(history);
    } catch (error: any) {
      console.error('[AchievementGenerationController.getHistory] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
