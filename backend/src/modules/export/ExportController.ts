import { Request, Response } from 'express';
import { ExportService } from './services/ExportService';
import { ShareResumeService } from './services/ShareResumeService';
import { ExportAnalyticsService } from './services/ExportAnalyticsService';
import { z } from 'zod';

export class ExportController {
  
  public static async exportFormat(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const resumeId = req.params.resumeId as string;
      const { format, options } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!['PDF', 'DOCX', 'HTML', 'JSON'].includes(format)) {
        return res.status(400).json({ error: 'Invalid format' });
      }

      const result = await ExportService.exportResume(userId, resumeId, format as any, options || {});

      if (format === 'JSON' || format === 'HTML') {
        res.setHeader('Content-Type', format === 'JSON' ? 'application/json' : 'text/html');
        return res.send(result);
      } else {
        res.setHeader('Content-Type', format === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=resume.${format.toLowerCase()}`);
        return res.send(result);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      res.status(500).json({ error: error.message || 'Failed to export resume' });
    }
  }

  public static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const resumeId = req.params.resumeId as string;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const history = await ExportService.getHistory(userId, resumeId);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch history' });
    }
  }

  public static async createShareLink(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const resumeId = req.params.resumeId as string;
      const { type, expiresInDays, password } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const share = await ShareResumeService.createShareLink(userId, resumeId, { type, expiresInDays, password });
      
      const qrCode = await ShareResumeService.generateQRCode(share.url);

      res.json({ share, qrCode });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create share link' });
    }
  }

  public static async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const analytics = await ExportAnalyticsService.getAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch analytics' });
    }
  }
}
