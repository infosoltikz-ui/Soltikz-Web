import { PrismaClient } from '@prisma/client';
import { AIService } from './AIService';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class ResumeOptimizationService {
  /**
   * Generates optimization suggestions for a Resume Draft against a Job Analysis.
   * Utilizes hashing to avoid redundant AI calls.
   */
  public static async generateOptimization(
    userId: string,
    resumeId: string,
    targetSection: string = 'All',
    conversationId?: string
  ) {
    // 1. Load Resume Draft
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: {
        personal: true,
        summary: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        certifications: true,
      }
    });

    if (!resume) throw new Error('Resume not found');

    // 2. Load Job Analysis
    const jobDescription = await prisma.jobDescription.findUnique({
      where: { resumeId },
      include: { analysis: true }
    });

    if (!jobDescription || !jobDescription.analysis?.structuredData) {
      throw new Error('Job Analysis not found. Please analyze a Job Description first.');
    }

    // 3. Generate Hashes for caching
    // We only hash the relevant content that would affect the AI output.
    const resumePayload = {
      personal: resume.personal,
      summary: resume.summary,
      experiences: resume.experiences,
      educations: resume.educations,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications
    };
    
    const resumeHash = crypto.createHash('sha256').update(JSON.stringify(resumePayload)).digest('hex');
    const jobAnalysisHash = crypto.createHash('sha256').update(JSON.stringify(jobDescription.analysis.structuredData)).digest('hex');

    // 4. Check for cached version
    // Find the latest optimization for this resume and target section
    const existingOptimization = await prisma.resumeOptimization.findFirst({
      where: { 
        resumeId,
        targetSection
      },
      orderBy: { createdAt: 'desc' }
    });

    if (
      existingOptimization && 
      existingOptimization.resumeHash === resumeHash && 
      existingOptimization.jobAnalysisHash === jobAnalysisHash && 
      existingOptimization.status === 'Completed' && 
      existingOptimization.structuredSuggestions
    ) {
      return {
        success: true,
        cached: true,
        optimization: existingOptimization
      };
    }

    // 5. Create a new Optimization record with 'Processing' state
    const version = existingOptimization ? existingOptimization.version + 1 : 1;
    
    let optimizationRecord = await prisma.resumeOptimization.create({
      data: {
        resumeId,
        status: 'Processing',
        resumeHash,
        jobAnalysisHash,
        targetSection,
        version
      }
    });

    // 6. Call AI Service
    const startTime = Date.now();
    try {
      const result = await AIService.generate(
        userId,
        resumeId,
        'RESUME_OPTIMIZER',
        {
          resumeDraft: JSON.stringify(resumePayload, null, 2),
          jobAnalysis: JSON.stringify(jobDescription.analysis.structuredData, null, 2),
          targetSection
        },
        conversationId
      );

      const latency = Date.now() - startTime;

      // 7. Parse Response
      let parsedData = null;
      try {
        let cleanResponse = result.response.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```/, '').replace(/```$/, '').trim();
        }
        parsedData = JSON.parse(cleanResponse);
      } catch (parseError) {
        throw new Error('AI returned malformed JSON');
      }

      // 8. Update DB with 'Completed' status and data
      optimizationRecord = await prisma.resumeOptimization.update({
        where: { id: optimizationRecord.id },
        data: {
          structuredSuggestions: parsedData,
          rawResponse: result.response,
          status: 'Completed',
          tokenUsage: result.tokens?.total || 0,
          latency,
          aiModel: result.model || 'unknown',
          promptVersion: '1.0.0'
        }
      });

      return {
        success: true,
        cached: false,
        optimization: optimizationRecord
      };

    } catch (error: any) {
      // 9. Update DB with 'Failed' status
      await prisma.resumeOptimization.update({
        where: { id: optimizationRecord.id },
        data: {
          status: 'Failed',
          rawResponse: error.message,
          latency: Date.now() - startTime
        }
      });
      throw error;
    }
  }
  
  /**
   * Retrieves the history of optimizations for a specific resume.
   */
  public static async getOptimizationHistory(resumeId: string) {
    return prisma.resumeOptimization.findMany({
      where: { resumeId, status: 'Completed' },
      orderBy: { version: 'desc' }
    });
  }
}
