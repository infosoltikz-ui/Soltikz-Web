import { AIService } from './AIService';

export class ResumeTailoringService {
  /**
   * Tailors a specific section of the resume based on the job description and missing skills.
   */
  public static async tailorSection(
    userId: string,
    resumeId: string,
    jobDescription: string,
    sectionType: 'summary' | 'experience' | 'skills' | 'projects' | 'achievement',
    originalContent: string,
    missingSkills: string[],
    conversationId?: string
  ) {
    // 1. Prepare AI Variables
    const variables: Record<string, string> = {
      jobDescription: jobDescription,
      sectionType: sectionType,
      originalContent: originalContent,
      missingSkills: missingSkills.join(', ') || 'None provided'
    };

    // 2. Delegate to AIService
    return await AIService.generate(
      userId,
      resumeId,
      'RESUME_TAILORING',
      variables,
      conversationId
    );
  }

  public static async streamTailorSection(
    userId: string,
    resumeId: string,
    jobDescription: string,
    sectionType: 'summary' | 'experience' | 'skills' | 'projects' | 'achievement',
    originalContent: string,
    missingSkills: string[],
    onChunk: (chunk: string) => void,
    conversationId?: string
  ) {
    const variables: Record<string, string> = {
      jobDescription: jobDescription,
      sectionType: sectionType,
      originalContent: originalContent,
      missingSkills: missingSkills.join(', ') || 'None provided'
    };

    return await AIService.stream(
      userId,
      resumeId,
      'RESUME_TAILORING',
      variables,
      onChunk,
      undefined,
      undefined,
      conversationId
    );
  }
}
