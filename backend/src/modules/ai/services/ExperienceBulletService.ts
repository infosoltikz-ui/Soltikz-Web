import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface ExperienceBulletOptions {
  expId: string;
  jobTitle?: string;
  company?: string;
  experienceLevel?: string;
  responsibilities?: string;
  technologies?: string;
  targetRole?: string;
  writingStyle?: string;
  bulletCount?: string;
  additionalNotes?: string;
}

export class ExperienceBulletService {
  public static async generateBullets(
    userId: string,
    resumeId: string,
    options: ExperienceBulletOptions,
    conversationId?: string
  ) {
    if (!options.expId) {
      throw new Error('expId is required');
    }

    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        experiences: {
          where: { id: options.expId }
        }
      }
    });

    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    const experience = resume.experiences[0];
    if (!experience) {
      throw new Error('Experience not found in this resume.');
    }

    // 2. Prepare AI Variables
    const variables: Record<string, string> = {
      existingDescription: experience.description || 'None',
      jobTitle: options.jobTitle || experience.jobTitle || 'Not specified',
      company: options.company || experience.companyName || 'Not specified',
      experienceLevel: options.experienceLevel || 'Mid-Level',
      responsibilities: options.responsibilities || 'None',
      technologies: options.technologies || 'None',
      targetRole: options.targetRole || 'Not specified',
      writingStyle: options.writingStyle || 'ATS Optimized',
      bulletCount: options.bulletCount || '5',
      additionalNotes: options.additionalNotes || 'None'
    };

    // 3. Delegate to AIService
    return await AIService.generate(
      userId,
      resumeId,
      'EXPERIENCE_BULLETS',
      variables,
      conversationId
    );
  }
}
