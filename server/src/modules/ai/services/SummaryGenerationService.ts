import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface SummaryGenerationOptions {
  targetJobTitle?: string;
  yearsOfExperience?: string;
  industry?: string;
  careerLevel?: string;
  writingStyle?: string;
  summaryLength?: string;
  additionalNotes?: string;
}

export class SummaryGenerationService {
  /**
   * Automatically collects resume data, merges with manual options, and generates a summary via AIService.
   */
  public static async generateSummary(
    userId: string,
    resumeId: string,
    options: SummaryGenerationOptions,
    conversationId?: string
  ) {
    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        experiences: {
          orderBy: { startDate: 'desc' },
          take: 3
        },
        educations: {
          orderBy: { startDate: 'desc' },
          take: 2
        },
        skills: true,
        projects: {
          take: 2
        }
      }
    });

    if (!resume) throw new Error('Resume not found or access denied.');

    // 2. Format Variables
    const currentJobTitle = resume.personal?.title || '';
    
    // Normalize skills to string
    const skillsList = resume.skills
      .map(s => s.name)
      .filter(Boolean)
      .join(', ');

    // Format experience
    const experienceText = resume.experiences
      .map(e => `${e.jobTitle} at ${e.companyName} (${e.startDate ? new Date(e.startDate).getFullYear() : 'N/A'} - ${e.currentlyWorking ? 'Present' : (e.endDate ? new Date(e.endDate).getFullYear() : 'N/A')})\n${e.description || ''}`)
      .join('\n\n');

    // Format education
    const educationText = resume.educations
      .map(e => `${e.degree} in ${e.fieldOfStudy} from ${e.institution}`)
      .join('\n');

    // 3. Prepare AI Variables matching the PromptRegistry requirements
    const variables: Record<string, string> = {
      jobTitle: options.targetJobTitle || currentJobTitle || 'Professional',
      yearsOfExperience: options.yearsOfExperience || 'several',
      skills: skillsList || 'Not specified',
      industry: options.industry || 'Not specified',
      careerLevel: options.careerLevel || 'Professional',
      education: educationText || 'Not specified',
      experience: experienceText || 'Not specified',
      writingStyle: options.writingStyle || 'Professional',
      summaryLength: options.summaryLength || 'Medium',
      additionalNotes: options.additionalNotes || 'None'
    };

    // 4. Delegate to AIService
    return await AIService.generate(
      userId,
      resumeId,
      'SUMMARY',
      variables,
      conversationId
    );
  }

  /**
   * Note: For streaming, we would implement streamSummary calling a similar AIService.stream 
   * However, AIService stream method needs to be implemented if not already available, 
   * but for now we follow the same architecture.
   */
}
