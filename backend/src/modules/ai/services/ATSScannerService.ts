import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export class ATSScannerService {
  /**
   * Scans a resume using AI to provide an ATS compatibility report.
   */
  public static async scan(
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
    // We send a structured representation of the resume
    const resumeContent = JSON.stringify(resume, null, 2);

    // 3. Prepare AI Variables
    const variables: Record<string, string> = {
      resumeContent: resumeContent
    };

    // 4. Delegate to AIService
    const result = await AIService.generate(
      userId,
      resumeId,
      'ATS_SCANNER',
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
        scan: parsed
      };
    } catch (e) {
      console.error('Failed to parse ATS Scanner response:', e);
      throw new Error('Failed to generate ATS scan report.');
    }
  }

  public static async streamScan(
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
      'ATS_SCANNER',
      variables,
      onChunk,
      undefined,
      undefined,
      conversationId
    );
  }
}
