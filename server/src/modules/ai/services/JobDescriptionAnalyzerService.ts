import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export class JobDescriptionAnalyzerService {
  /**
   * Automatically collects resume data, merges with the job description, and analyzes it.
   */
  public static async analyze(
    userId: string,
    resumeId: string,
    jobDescription: string,
    conversationId?: string
  ) {
    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        experiences: {
          orderBy: { startDate: 'desc' }
        },
        educations: {
          orderBy: { startDate: 'desc' }
        },
        skills: true,
        projects: true,
        achievements: true,
        summary: true,
      }
    });

    if (!resume) throw new Error('Resume not found or access denied.');

    // 2. Format Resume Content
    const contentParts = [];
    
    if (resume.personal) {
      contentParts.push(`Job Title: ${resume.personal.title || ''}`);
    }

    if (resume.summary?.content) {
      contentParts.push(`Summary:\n${resume.summary.content}`);
    }

    if (resume.skills && resume.skills.length > 0) {
      contentParts.push(`Skills:\n${resume.skills.map(s => s.name).join(', ')}`);
    }

    if (resume.experiences && resume.experiences.length > 0) {
      const exp = resume.experiences.map(e => `${e.jobTitle} at ${e.companyName}\n${e.description || ''}`).join('\n\n');
      contentParts.push(`Experience:\n${exp}`);
    }

    if (resume.projects && resume.projects.length > 0) {
      const proj = resume.projects.map(p => `${p.title}\n${p.description || ''}`).join('\n\n');
      contentParts.push(`Projects:\n${proj}`);
    }

    const resumeContent = contentParts.join('\n\n---\n\n');

    // 3. Prepare AI Variables
    const variables: Record<string, string> = {
      jobDescription: jobDescription,
      resumeContent: resumeContent
    };

    // 4. Delegate to AIService
    // Ensure the AI outputs JSON. We can configure ProviderManager to use JSON mode if supported,
    // but the system prompt already asks for JSON format only.
    const result = await AIService.generate(
      userId,
      resumeId,
      'JOB_ANALYZER',
      variables,
      conversationId
    );

    // 5. Parse JSON
    try {
      // Find the JSON block if it's wrapped in markdown
      const jsonMatch = result.response.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : result.response;
      
      const parsed = JSON.parse(jsonString);
      return {
        ...result,
        analysis: parsed
      };
    } catch (e) {
      console.error('Failed to parse AI job analysis response:', e);
      // Fallback
      return {
        ...result,
        analysis: {
          score: 50,
          missingSkills: [],
          matchedSkills: [],
          recommendations: ['AI returned an invalid format. Please try again.']
        }
      };
    }
  }

  public static async streamAnalyze(
    userId: string,
    resumeId: string,
    jobDescription: string,
    onChunk: (chunk: string) => void,
    conversationId?: string
  ) {
    // Similar to above, but using AIService.stream
    // Since stream is for text, streaming a JSON response might be tricky to parse on the fly on the frontend.
    // For this implementation, we will just use the standard stream, and the frontend will wait to parse the final result.
    
    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        skills: true,
        projects: true,
        summary: true,
      }
    });

    if (!resume) throw new Error('Resume not found or access denied.');

    // 2. Format Resume Content
    const contentParts = [];
    if (resume.personal) contentParts.push(`Job Title: ${resume.personal.title || ''}`);
    if (resume.summary?.content) contentParts.push(`Summary:\n${resume.summary.content}`);
    if (resume.skills.length > 0) contentParts.push(`Skills:\n${resume.skills.map(s => s.name).join(', ')}`);
    if (resume.experiences.length > 0) contentParts.push(`Experience:\n${resume.experiences.map(e => `${e.jobTitle} at ${e.companyName}\n${e.description || ''}`).join('\n\n')}`);
    
    const resumeContent = contentParts.join('\n\n---\n\n');

    const variables: Record<string, string> = {
      jobDescription: jobDescription,
      resumeContent: resumeContent
    };

    return await AIService.stream(
      userId,
      resumeId,
      'JOB_ANALYZER',
      variables,
      onChunk,
      undefined,
      undefined,
      conversationId
    );
  }
}
