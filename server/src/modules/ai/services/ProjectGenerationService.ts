import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface ProjectGenerationOptions {
  projectId: string;
  role?: string;
  features?: string;
  targetJobRole?: string;
  writingStyle?: string;
  descriptionLength?: string;
  additionalNotes?: string;
}

export class ProjectGenerationService {
  public static async generateProjectDescription(
    userId: string,
    resumeId: string,
    options: ProjectGenerationOptions,
    conversationId?: string
  ) {
    if (!options.projectId) {
      throw new Error('projectId is required');
    }

    // 1. Fetch Resume & Project Context
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        projects: {
          where: { id: options.projectId }
        }
      }
    });

    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    const project = resume.projects[0];
    if (!project) {
      throw new Error('Project not found in this resume.');
    }

    // 2. Prepare AI Variables
    const variables: Record<string, string> = {
      projectName: project.title || 'Not specified',
      startDate: project.startDate || 'Not specified',
      endDate: project.endDate || 'Not specified',
      existingDescription: project.description || 'None',
      role: options.role || 'Not specified',
      features: options.features || 'None',
      targetJobRole: options.targetJobRole || 'Not specified',
      writingStyle: options.writingStyle || 'Professional',
      descriptionLength: options.descriptionLength || 'Medium',
      additionalNotes: options.additionalNotes || 'None'
    };

    // 3. Delegate to AIService
    // We use a generic 'PROJECT' prompt category which should be seeded in the prompt registry
    return await AIService.generate(
      userId,
      resumeId,
      'PROJECT',
      variables,
      conversationId
    );
  }
}
