import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface SkillsGenerationOptions {
  targetJobTitle?: string;
  industry?: string;
  experienceLevel?: string;
  targetTechnologies?: string;
  skillCategory?: string;
  additionalNotes?: string;
}

export class SkillsGenerationService {
  public static async generateSkills(
    userId: string,
    resumeId: string,
    options: SkillsGenerationOptions,
    conversationId?: string
  ) {
    // 1. Fetch Resume Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        skills: true,
        experiences: true,
      }
    });

    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    // 2. Prepare context from resume
    const currentSkills = resume.skills.map(s => s.name).join(', ');
    
    // We can extract job titles to infer experience
    const pastRoles = resume.experiences.map(e => e.jobTitle).filter(Boolean).join(', ');

    // 3. Prepare AI Variables matching the PromptRegistry requirements
    const variables: Record<string, string> = {
      targetJobTitle: options.targetJobTitle || 'Not specified',
      industry: options.industry || 'Not specified',
      experienceLevel: options.experienceLevel || 'Not specified',
      currentSkills: currentSkills || 'None',
      targetTechnologies: options.targetTechnologies || 'None',
      skillCategory: options.skillCategory || 'All',
      additionalNotes: options.additionalNotes || 'None',
      pastRoles: pastRoles || 'None'
    };

    // 4. Delegate to AIService
    return await AIService.generate(
      userId,
      resumeId,
      'SKILLS', // Using a new category for Skills
      variables,
      conversationId
    );
  }
}
