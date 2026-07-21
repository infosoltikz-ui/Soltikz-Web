import { PrismaClient } from '@prisma/client';
import { AIService } from '../../ai/services/AIService';
import { CoverLetterAnalyticsService } from './CoverLetterAnalyticsService';
import { GenerateResponse } from '../../ai/providers/AIProvider.interface';

const prisma = new PrismaClient();

export class CoverLetterService {
  /**
   * Generates a cover letter and streams the output directly to the client.
   * This does NOT save the cover letter automatically. 
   * It relies on the client to send the final text to a save endpoint if they want to keep it.
   */
  public static async streamGeneration(
    userId: string,
    resumeId: string,
    params: {
      jobDescription: string;
      companyName: string;
      position: string;
      tone: string;
      length: string;
    },
    onChunk: (chunk: string) => void,
    onComplete?: (response: GenerateResponse) => void,
    onError?: (error: any) => void
  ) {
    // 1. Fetch Resume Content
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      select: { content: true }
    });

    if (!resume) {
      throw new Error('Resume not found or unauthorized');
    }

    // 2. Prepare AI Variables
    const variables = {
      jobDescription: params.jobDescription,
      companyName: params.companyName,
      position: params.position,
      tone: params.tone,
      length: params.length,
      resumeContent: JSON.stringify(resume.content)
    };

    // 3. Stream AI
    await AIService.stream(
      userId,
      resumeId,
      'COVER_LETTER_GENERATOR',
      variables,
      onChunk,
      async (response) => {
        // Track analytics
        await CoverLetterAnalyticsService.logAction(userId, 'GENERATION', {
          tokens: response.tokens?.total || 0,
          cost: response.cost || 0,
          metadata: { companyName: params.companyName, position: params.position }
        });
        
        if (onComplete) onComplete(response);
      },
      onError
    );
  }

  /**
   * Saves a newly generated cover letter to the database.
   */
  public static async saveCoverLetter(
    userId: string,
    resumeId: string,
    data: {
      content: string;
      companyName: string;
      position: string;
      jobDescription: string;
      tone: string;
      length: string;
      template?: string;
    }
  ) {
    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId,
        resumeId,
        content: data.content,
        companyName: data.companyName,
        position: data.position,
        jobDescription: data.jobDescription,
        tone: data.tone,
        length: data.length,
        template: data.template || 'professional',
        title: `${data.position} at ${data.companyName}`
      }
    });

    await prisma.coverLetterHistory.create({
      data: {
        userId,
        coverLetterId: coverLetter.id,
        action: 'CREATED'
      }
    });

    return coverLetter;
  }

  /**
   * Updates an existing cover letter (e.g. after editing in the rich text editor).
   */
  public static async updateCoverLetter(
    userId: string,
    id: string,
    content: string,
    template?: string
  ) {
    const cl = await prisma.coverLetter.findUnique({ where: { id } });
    if (!cl || cl.userId !== userId) throw new Error('Unauthorized');

    const updated = await prisma.coverLetter.update({
      where: { id },
      data: { 
        content,
        ...(template ? { template } : {})
      }
    });

    await prisma.coverLetterHistory.create({
      data: {
        userId,
        coverLetterId: id,
        action: 'UPDATED'
      }
    });

    return updated;
  }

  /**
   * Retrieves all cover letters for a user.
   */
  public static async getUserCoverLetters(userId: string) {
    return prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        resume: { select: { title: true } }
      }
    });
  }

  /**
   * Retrieves a specific cover letter.
   */
  public static async getCoverLetter(userId: string, id: string) {
    const cl = await prisma.coverLetter.findUnique({
      where: { id },
      include: {
        resume: { select: { title: true } },
        histories: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!cl || cl.userId !== userId) throw new Error('Cover letter not found');
    return cl;
  }

  /**
   * Deletes a cover letter.
   */
  public static async deleteCoverLetter(userId: string, id: string) {
    const cl = await prisma.coverLetter.findUnique({ where: { id } });
    if (!cl || cl.userId !== userId) throw new Error('Unauthorized');

    await prisma.coverLetter.delete({ where: { id } });
    return { success: true };
  }
}
