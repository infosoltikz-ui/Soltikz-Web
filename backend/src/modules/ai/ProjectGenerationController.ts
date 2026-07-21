import { Request, Response } from 'express';
import { ProjectGenerationService } from './services/ProjectGenerationService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectGenerationController {
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

      if (!options?.projectId) {
        return res.status(400).json({ error: 'options.projectId is required' });
      }

      const response = await ProjectGenerationService.generateProjectDescription(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[ProjectGenerationController.generate] Error:', error.message);
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

      if (!options?.projectId) {
        return res.status(400).json({ error: 'options.projectId is required' });
      }

      // Default to generate if stream not fully separate in AIService
      const response = await ProjectGenerationService.generateProjectDescription(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[ProjectGenerationController.stream] Error:', error.message);
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
      console.error('[ProjectGenerationController.getHistory] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
