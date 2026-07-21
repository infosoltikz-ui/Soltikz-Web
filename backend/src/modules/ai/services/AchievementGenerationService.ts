import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface AchievementGenerationOptions {
  achievementId: string;
  jobTitle?: string;
  company?: string;
  project?: string;
  responsibilities?: string;
  technologies?: string;
  targetRole?: string;
  writingStyle?: string;
  achievementCount?: string;
  additionalNotes?: string;
}

export class AchievementGenerationService {
  public static async generateAchievement(
    userId: string,
    resumeId: string,
    options: AchievementGenerationOptions,
    conversationId?: string
  ) {
    if (!options.achievementId) {
      throw new Error('achievementId is required');
    }

    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        achievements: {
          where: { id: options.achievementId }
        }
      }
    });

    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    const achievement = resume.achievements[0];
    if (!achievement) {
      throw new Error('Achievement not found in this resume.');
    }

    // 2. Prepare AI Variables
    const variables: Record<string, string> = {
      achievementTitle: achievement.title || 'Not specified',
      achievementDate: achievement.achievementDate || 'Not specified',
      existingDescription: achievement.description || 'None',
      jobTitle: options.jobTitle || 'Not specified',
      company: options.company || 'Not specified',
      project: options.project || 'Not specified',
      responsibilities: options.responsibilities || 'None',
      technologies: options.technologies || 'None',
      targetRole: options.targetRole || 'Not specified',
      writingStyle: options.writingStyle || 'Professional',
      achievementCount: options.achievementCount || '3',
      additionalNotes: options.additionalNotes || 'None'
    };

    // 3. Delegate to AIService
    // We use a generic 'ACHIEVEMENT' prompt category
    return await AIService.generate(
      userId,
      resumeId,
      'ACHIEVEMENT',
      variables,
      conversationId
    );
  }
}
