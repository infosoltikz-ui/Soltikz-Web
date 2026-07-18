import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();

export class ResumeManagementService {
  /**
   * Get paginated resumes across the platform
   */
  public static async getResumes(skip = 0, take = 50, search = '') {
    const where = search ? {
      title: { contains: search, mode: 'insensitive' as any }
    } : {};

    const resumes = await prisma.resume.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      }
    });

    const total = await prisma.resume.count({ where });

    return { resumes, total };
  }

  /**
   * Delete a resume
   */
  public static async deleteResume(adminId: string, resumeId: string) {
    const resume = await prisma.resume.delete({
      where: { id: resumeId }
    });

    await AuditLogService.logAction(adminId, 'RESUME_DELETED', 'RESUME', resumeId, { title: resume.title });
    return resume;
  }
}
