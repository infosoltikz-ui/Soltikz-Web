import { Request, Response } from 'express';
import { ATSScannerService } from './services/ATSScannerService';
import { ATSScoreService } from './services/ATSScoreService';
import { AIService } from './services/AIService';

export class ATSController {
  public static async scan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId, conversationId } = req.body;

      if (!resumeId) {
        res.status(400).json({ error: 'Resume ID is required' });
        return;
      }

      const result = await ATSScannerService.scan(
        userId,
        resumeId,
        conversationId
      );

      // Normalize the score
      const normalizedScan = ATSScoreService.normalizeScore(result.scan);

      res.status(200).json({ 
        scan: normalizedScan,
        metadata: {
          conversationId: result.conversationId,
          tokens: result.tokens
        }
      });
    } catch (error: any) {
      console.error('ATS Scan Error:', error);
      res.status(500).json({ error: error.message || 'Failed to scan resume' });
    }
  }

  public static async streamScan(req: Request, res: Response): Promise<void> {
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

      const result = await ATSScannerService.streamScan(
        userId,
        resumeId,
        onChunk,
        conversationId
      );

      res.write(`data: ${JSON.stringify({ done: true, metadata: result })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('ATS Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'Failed to stream' })}\n\n`);
      res.end();
    }
  }

  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId } = req.query;

      const history = await AIService.getHistory(
        userId,
        resumeId as string,
        'ATS_SCANNER',
        10
      );

      res.status(200).json({ history });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch ATS history' });
    }
  }
}
