import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export class ResumeAnalyzerService {
  /**
   * Analyzes a resume using AI to provide a comprehensive evaluation report.
   */
  public static async analyze(
    userId: string,
    resumeId: string,
    conversationId?: string
  ) {
    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        skills: true,
        projects: true,
        achievements: true,
        summary: true,
      }
    });

    if (!resume) throw new Error('Resume not found or access denied.');

    // 2. Format Resume Content
    const resumeContent = JSON.stringify(resume, null, 2);

    // 3. Prepare AI Variables
    const variables: Record<string, string> = {
      resumeContent: resumeContent
    };

    // 4. Delegate to AIService
    const result = await AIService.generate(
      userId,
      resumeId,
      'RESUME_ANALYZER',
      variables,
      conversationId
    );

    // 5. Parse JSON
    try {
      const jsonMatch = result.response.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : result.response;
      
      const parsed = JSON.parse(jsonString);
      return {
        ...result,
        analysis: parsed
      };
    } catch (e) {
      console.error('Failed to parse Resume Analyzer response:', e);
      throw new Error('Failed to generate Resume Analyzer report.');
    }
  }

  public static async streamAnalyze(
    userId: string,
    resumeId: string,
    onChunk: (chunk: string) => void,
    conversationId?: string
  ) {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        achievements: true,
        summary: true,
      }
    });

    if (!resume) throw new Error('Resume not found or access denied.');

    const resumeContent = JSON.stringify(resume, null, 2);

    const variables: Record<string, string> = {
      resumeContent: resumeContent
    };

    return await AIService.stream(
      userId,
      resumeId,
      'RESUME_ANALYZER',
      variables,
      onChunk,
      undefined,
      undefined,
      conversationId
    );
  }
}
