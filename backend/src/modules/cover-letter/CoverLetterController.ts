import { Request, Response } from 'express';
import { CoverLetterService } from './services/CoverLetterService';
import { CoverLetterExportService } from './services/CoverLetterExportService';
import { CoverLetterAnalyticsService } from './services/CoverLetterAnalyticsService';
import { CoverLetterTemplateService } from './services/CoverLetterTemplateService';

export class CoverLetterController {
  
  public static async stream(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { resumeId, jobDescription, companyName, position, tone, length } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await CoverLetterService.streamGeneration(
        userId,
        resumeId,
        { jobDescription, companyName, position, tone, length },
        (chunk) => {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        },
        (response) => {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        },
        (error) => {
          console.error('Stream error:', error);
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        }
      );
    } catch (error: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Failed to stream cover letter' });
      }
    }
  }

  public static async save(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { resumeId, content, companyName, position, jobDescription, tone, length, template } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const cl = await CoverLetterService.saveCoverLetter(userId, resumeId, {
        content, companyName, position, jobDescription, tone, length, template
      });

      res.status(201).json(cl);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to save cover letter' });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { content, template } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const updated = await CoverLetterService.updateCoverLetter(userId, id as string, content, template);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update cover letter' });
    }
  }

  public static async exportFormat(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { format } = req.body;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const cl = await CoverLetterService.getCoverLetter(userId, id as string);

      await CoverLetterAnalyticsService.logAction(userId, 'EXPORT', {
        template: cl.template,
        metadata: { format }
      });

      if (format === 'HTML') {
        const html = CoverLetterExportService.generateHTML(cl.content || '', cl.template);
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      } else if (format === 'PDF') {
        const pdf = await CoverLetterExportService.generatePDF(cl.content || '', cl.template);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cover_letter.pdf`);
        return res.send(pdf);
      } else if (format === 'DOCX') {
        const docx = await CoverLetterExportService.generateDOCX(cl.content || '', cl.template);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=cover_letter.docx`);
        return res.send(docx);
      } else {
        return res.status(400).json({ error: 'Invalid format' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to export cover letter' });
    }
  }

  public static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const list = await CoverLetterService.getUserCoverLetters(userId);
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch cover letters' });
    }
  }

  public static async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const cl = await CoverLetterService.getCoverLetter(userId, id as string);
      res.json(cl);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch cover letter' });
    }
  }

  public static async deleteLetter(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await CoverLetterService.deleteCoverLetter(userId, id as string);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete cover letter' });
    }
  }

  public static async getTemplates(req: Request, res: Response) {
    try {
      const templates = CoverLetterTemplateService.getTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch templates' });
    }
  }

  public static async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const analytics = await CoverLetterAnalyticsService.getAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch analytics' });
    }
  }
}
