import { PrismaClient } from '@prisma/client';
import { PDFGeneratorService } from './PDFGeneratorService';
import { DOCXGeneratorService } from './DOCXGeneratorService';
import { HTMLExportService } from './HTMLExportService';
import { JSONExportService } from './JSONExportService';
import { ExportAnalyticsService } from './ExportAnalyticsService';

const prisma = new PrismaClient();

export class ExportService {
  /**
   * Main export handler
   */
  public static async exportResume(userId: string, resumeId: string, format: 'PDF' | 'DOCX' | 'HTML' | 'JSON', options: any = {}) {
    const startTime = Date.now();
    let bufferOrString: Buffer | string | null = null;
    let error: string | null = null;

    try {
      // 1. Fetch Resume
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId },
        include: {
          personal: true,
          summary: true,
          experiences: true,
          educations: true,
          skills: true,
          projects: true,
          certifications: true,
          languages: true,
          achievements: true,
          awards: true,
          interests: true,
          references: true
        }
      });

      if (!resume) throw new Error('Resume not found or unauthorized');

      // 2. Generate Format
      switch (format) {
        case 'PDF':
          bufferOrString = await PDFGeneratorService.generatePDF(resume, options);
          break;
        case 'DOCX':
          bufferOrString = await DOCXGeneratorService.generateDOCX(resume);
          break;
        case 'HTML':
          bufferOrString = HTMLExportService.generateHTML(resume, options);
          break;
        case 'JSON':
          bufferOrString = JSONExportService.generateJSON(resume);
          break;
        default:
          throw new Error('Unsupported format');
      }

      // 3. Log History
      const durationMs = Date.now() - startTime;
      const fileSize = bufferOrString ? (typeof bufferOrString === 'string' ? Buffer.byteLength(bufferOrString) : bufferOrString.length) : 0;

      await prisma.exportHistory.create({
        data: {
          userId,
          resumeId,
          format,
          template: options.template || resume.selectedTemplate || 'modern',
          fileSize,
          durationMs,
          status: 'SUCCESS'
        }
      });

      // 4. Log Analytics
      await ExportAnalyticsService.logEvent(userId, resumeId, `EXPORT_${format}`, {
        template: options.template,
        durationMs,
        fileSize
      });

      return bufferOrString;

    } catch (e: any) {
      // Log Failure
      await prisma.exportHistory.create({
        data: {
          userId,
          resumeId,
          format,
          template: options.template || 'modern',
          durationMs: Date.now() - startTime,
          status: 'FAILED',
          error: e.message
        }
      });
      throw e;
    }
  }

  public static async getHistory(userId: string, resumeId: string) {
    return prisma.exportHistory.findMany({
      where: { userId, resumeId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
