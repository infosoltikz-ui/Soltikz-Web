import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';

const prisma = new PrismaClient();

export interface GrammarToneOptions {
  content: string;
  tone?: string;
  writingStyle?: string;
  englishVariant?: string;
  optimizationLevel?: string;
  preserveKeywords?: boolean;
  additionalInstructions?: string;
}

export class GrammarToneService {
  public static async optimize(
    userId: string,
    resumeId: string,
    options: GrammarToneOptions,
    conversationId?: string
  ) {
    if (!options.content) {
      throw new Error('Content is required for grammar optimization');
    }

    // 1. Verify Resume Context (just access control)
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId }
    });

    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    // 2. Prepare AI Variables
    const variables: Record<string, string> = {
      content: options.content,
      tone: options.tone || 'Professional',
      writingStyle: options.writingStyle || 'Clear and Concise',
      englishVariant: options.englishVariant || 'US English',
      optimizationLevel: options.optimizationLevel || 'Moderate',
      preserveKeywords: options.preserveKeywords ? 'Yes, strictly preserve original keywords.' : 'Optional, improve as needed.',
      additionalInstructions: options.additionalInstructions || 'None'
    };

    // 3. Delegate to AIService
    // Note: We need to register GRAMMAR_TONE prompt type if it doesn't exist.
    return await AIService.generate(
      userId,
      resumeId,
      'GRAMMAR_TONE',
      variables,
      conversationId
    );
  }
}
