import { Request, Response } from 'express';
import { JobDescriptionAnalyzerService } from './services/JobDescriptionAnalyzerService';
import { ResumeTailoringService } from './services/ResumeTailoringService';

export class JobDescriptionController {
  public static async getAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { resumeId } = req.params;
      if (!resumeId) {
        res.status(400).json({ error: 'resumeId is required.' });
        return;
      }
      
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const existingJd = await prisma.jobDescription.findUnique({
        where: { resumeId },
        include: { analysis: true }
      });
      
      if (!existingJd) {
        res.status(404).json({ error: 'No job description found for this resume.' });
        return;
      }
      
      res.status(200).json({
        jobDescription: existingJd,
        analysis: existingJd.analysis?.structuredData || null
      });
    } catch (error: any) {
      console.error('Fetch Job Description Analysis Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch job description analysis' });
    }
  }

  public static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { resumeId, jobDescription, sourceType, fileName, conversationId } = req.body;

      if (!resumeId || !jobDescription) {
        res.status(400).json({ error: 'resumeId and jobDescription are required.' });
        return;
      }

      const result = await JobDescriptionAnalyzerService.analyze(
        userId,
        resumeId,
        jobDescription,
        sourceType,
        fileName,
        conversationId
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Job Description Analysis Error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze job description' });
    }
  }

  public static async tailor(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { resumeId, jobDescription, sectionType, originalContent, missingSkills, conversationId } = req.body;

      if (!resumeId || !jobDescription || !sectionType || !originalContent) {
        res.status(400).json({ error: 'resumeId, jobDescription, sectionType, and originalContent are required.' });
        return;
      }

      const result = await ResumeTailoringService.tailorSection(
        userId,
        resumeId,
        jobDescription,
        sectionType,
        originalContent,
        missingSkills || [],
        conversationId
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Resume Tailoring Error:', error);
      res.status(500).json({ error: error.message || 'Failed to tailor resume section' });
    }
  }

  public static async streamTailor(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { resumeId, jobDescription, sectionType, originalContent, missingSkills, conversationId } = req.body;

      if (!resumeId || !jobDescription || !sectionType || !originalContent) {
        res.status(400).json({ error: 'resumeId, jobDescription, sectionType, and originalContent are required.' });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      await ResumeTailoringService.streamTailorSection(
        userId,
        resumeId,
        jobDescription,
        sectionType,
        originalContent,
        missingSkills || [],
        (chunk) => {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        },
        conversationId
      );

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Resume Tailoring Stream Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Failed to tailor resume section' });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  }
}
