import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface ExperienceRewriteOptions {
  targetJobTitle?: string;
  writingStyle?: string;
  tone?: string;
  bulletCount?: string;
  additionalNotes?: string;
}

export class ExperienceRewriteService {
  public static async rewriteExperience(
    userId: string,
    resumeId: string,
    experienceId: string,
    options: ExperienceRewriteOptions,
    conversationId?: string
  ) {
    // 1. Fetch Resume Context & Target Experience
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        experiences: {
          where: { id: experienceId }
        },
        skills: true
      }
    });

    if (!resume || resume.experiences.length === 0) {
      throw new Error('Experience not found or access denied.');
    }

    const experience = resume.experiences[0];

    // Normalize skills
    const skillsList = resume.skills
      .map(s => s.name)
      .filter(Boolean)
      .join(', ');

    // 2. Prepare AI Variables matching the PromptRegistry requirements
    const variables: Record<string, string> = {
      jobTitle: experience.jobTitle,
      company: experience.companyName,
      industry: 'Not specified', // Might pass from frontend if we had it, fallback is okay
      existingDescription: experience.description || 'No existing description',
      skills: skillsList || 'Not specified',
      targetRole: options.targetJobTitle || experience.jobTitle,
      writingStyle: options.writingStyle || 'Professional',
      tone: options.tone || 'Professional',
      bulletCount: options.bulletCount || '3-5',
      additionalNotes: options.additionalNotes || 'None'
    };

    // 3. Delegate to AIService
    return await AIService.generate(
      userId,
      resumeId,
      'EXPERIENCE', // Using a new category for Experience
      variables,
      conversationId
    );
  }
}
