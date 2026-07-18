import { Request, Response } from 'express';
import { GrammarToneService } from './services/GrammarToneService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GrammarToneController {
  public static async optimize(req: Request, res: Response) {
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

      if (!options?.content) {
        return res.status(400).json({ error: 'options.content is required' });
      }

      const response = await GrammarToneService.optimize(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[GrammarToneController.optimize] Error:', error.message);
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

      if (!options?.content) {
        return res.status(400).json({ error: 'options.content is required' });
      }

      const response = await GrammarToneService.optimize(
        userId,
        resumeId,
        options,
        conversationId
      );

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('[GrammarToneController.stream] Error:', error.message);
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
      console.error('[GrammarToneController.getHistory] Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}
