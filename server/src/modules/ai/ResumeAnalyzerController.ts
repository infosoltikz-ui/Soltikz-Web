import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResumeAnalyzerService } from './services/ResumeAnalyzerService';
import { ResumeScoreService } from './services/ResumeScoreService';

const prisma = new PrismaClient();

export class ResumeAnalyzerController {
  public static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId, conversationId } = req.body;

      if (!resumeId) {
        res.status(400).json({ error: 'Resume ID is required' });
        return;
      }

      const result = await ResumeAnalyzerService.analyze(
        userId,
        resumeId,
        conversationId
      );

      // Normalize the score/analysis
      const normalizedAnalysis = ResumeScoreService.normalizeScore(result.analysis);

      res.status(200).json({ 
        analysis: normalizedAnalysis,
        metadata: {
          conversationId: conversationId,
          tokens: result.tokens
        }
      });
    } catch (error: any) {
      console.error('Resume Analyzer Error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze resume' });
    }
  }

  public static async streamAnalyze(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId, conversationId } = req.body;

      if (!resumeId) {
        res.status(400).json({ error: 'Resume ID is required' });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const onChunk = (chunk: string) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      };

      const result = await ResumeAnalyzerService.streamAnalyze(
        userId,
        resumeId,
        onChunk,
        conversationId
      );

      res.write(`data: ${JSON.stringify({ done: true, metadata: result })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Resume Analyzer Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'Failed to stream' })}\n\n`);
      res.end();
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId } = req.query;

      const whereClause: any = { userId };
      if (resumeId) {
        whereClause.resumeId = resumeId as string;
      }
      
      whereClause.title = { contains: 'RESUME_ANALYZER' };

      const history = await prisma.aIConversation.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { messages: true }
      });

      res.status(200).json({ history });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch Resume Analyzer history' });
    }
  }
}
