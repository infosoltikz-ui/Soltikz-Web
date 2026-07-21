import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class JobDescriptionAnalyzerService {
  /**
   * Analyzes a Job Description, extracting structured data and saving it to the DB.
   * Utilizes JD hashing to avoid redundant AI calls.
   */
  public static async analyze(
    userId: string,
    resumeId: string,
    jobDescriptionText: string,
    sourceType: string = 'Paste',
    fileName?: string,
    conversationId?: string
  ) {
    // 1. Generate Hash for caching
    const jdHash = crypto.createHash('sha256').update(jobDescriptionText).digest('hex');

    // 2. Check for cached version
    const existingJd = await prisma.jobDescription.findUnique({
      where: { resumeId },
      include: { analysis: true }
    });

    if (
      existingJd && 
      existingJd.jdHash === jdHash && 
      existingJd.analysisStatus === 'Completed' && 
      existingJd.analysis?.structuredData
    ) {
      return {
        success: true,
        cached: true,
        jobDescription: existingJd,
        analysis: existingJd.analysis.structuredData
      };
    }

    // 3. Upsert Job Description with 'Processing' state
    const jd = await prisma.jobDescription.upsert({
      where: { resumeId },
      update: {
        text: jobDescriptionText,
        jdHash,
        sourceType,
        fileName,
        analysisStatus: 'Processing'
      },
      create: {
        resumeId,
        text: jobDescriptionText,
        jdHash,
        sourceType,
        fileName,
        analysisStatus: 'Processing'
      }
    });

    try {
      // 4. Delegate to AIService using JOB_DESCRIPTION_EXTRACTOR
      const startTime = Date.now();
      const result = await AIService.generate(
        userId,
        resumeId,
        'JOB_DESCRIPTION_EXTRACTOR',
        { jobDescription: jobDescriptionText },
        conversationId
      );
      const analysisTime = Date.now() - startTime;

      // 5. Parse JSON
      const jsonMatch = result.response.match(/```(?:json)?\n([\s\S]*?)\n```/i);
      const jsonString = jsonMatch ? jsonMatch[1] : result.response;
      
      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (e) {
        // Find first { and last } if regex fails
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace >= 0) {
            parsedData = JSON.parse(jsonString.substring(firstBrace, lastBrace + 1));
        } else {
            throw new Error('AI output is not valid JSON');
        }
      }

      // 6. Update Job Description and Create/Update Job Analysis
      const updatedJd = await prisma.jobDescription.update({
        where: { id: jd.id },
        data: {
          companyName: parsedData.company || null,
          jobTitle: parsedData.role || null,
          experienceLevel: parsedData.experience || null,
          analysisStatus: 'Completed',
          analysis: {
            upsert: {
              create: {
                structuredData: parsedData,
                rawResponse: result.response,
                tokenUsage: result.tokens?.total || 0,
                analysisTime,
                aiModel: result.model || 'unknown',
                analysisVersion: '1.0.0',
                promptVersion: '1.0.0'
              },
              update: {
                structuredData: parsedData,
                rawResponse: result.response,
                tokenUsage: result.tokens?.total || 0,
                analysisTime,
                aiModel: result.model || 'unknown',
                analysisVersion: '1.0.0',
                promptVersion: '1.0.0'
              }
            }
          }
        },
        include: { analysis: true }
      });

      return {
        success: true,
        cached: false,
        jobDescription: updatedJd,
        analysis: parsedData
      };
      
    } catch (error: any) {
      console.error('Failed to analyze JD:', error);
      
      // Update status to Failed on error
      await prisma.jobDescription.update({
        where: { id: jd.id },
        data: { analysisStatus: 'Failed' }
      });
      
      throw new Error(error.message || 'Failed to analyze job description');
    }
  }
}
