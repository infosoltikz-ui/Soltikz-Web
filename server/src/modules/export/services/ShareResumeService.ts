import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export class ShareResumeService {
  /**
   * Generates a unique shareable link for a resume.
   */
  public static async createShareLink(userId: string, resumeId: string, options: { type: string, expiresInDays?: number, password?: string }) {
    const token = crypto.randomBytes(16).toString('hex');
    let expiresAt: Date | undefined;
    
    if (options.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + options.expiresInDays);
    }

    const share = await prisma.resumeShare.create({
      data: {
        userId,
        resumeId,
        token,
        type: options.type,
        passwordHash: options.password ? crypto.createHash('sha256').update(options.password).digest('hex') : null,
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/shared/${token}`,
        expiresAt
      }
    });

    return share;
  }

  /**
   * Gets details for a shared resume token
   */
  public static async getShareDetails(token: string) {
    const share = await prisma.resumeShare.findUnique({
      where: { token },
      include: {
        resume: {
          include: {
            personal: true,
            summary: true,
            experiences: true,
            educations: true,
            skills: true,
            projects: true,
          }
        }
      }
    });

    if (!share) throw new Error('Share link not found');
    
    if (share.expiresAt && share.expiresAt < new Date()) {
      throw new Error('Share link has expired');
    }

    // Increment views
    await prisma.resumeShare.update({
      where: { id: share.id },
      data: { views: { increment: 1 } }
    });

    return share;
  }

  /**
   * Generates a Data URL of a QR Code for the given URL
   */
  public static async generateQRCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Failed to generate QR code', error);
      throw new Error('Failed to generate QR code');
    }
  }
}
