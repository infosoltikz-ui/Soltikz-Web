import { PrismaClient, Prisma } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();

export class UserManagementService {
  /**
   * Retrieves a paginated list of users with optional filtering and search.
   */
  public static async getUsers(query: { search?: string; status?: string; role?: string; skip?: number; take?: number }) {
    const { search, status, role, skip = 0, take = 50 } = query;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      // Prisma enum type matching might require cast if not exact string, but typically works in string
      where.status = status as any;
    }

    if (role) {
      where.adminRole = { name: role };
    }

    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        adminRole: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    return { users, total };
  }

  /**
   * Get complete user profile
   */
  public static async getUserDetails(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        settings: true,
        subscriptions: true,
        payments: true,
        resumes: { select: { id: true, title: true, status: true, createdAt: true } },
        coverLetters: { select: { id: true, title: true, companyName: true, createdAt: true } },
        usage: true,
        adminRole: true
      }
    });
    
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Suspend a user
   */
  public static async suspendUser(adminId: string, userId: string, reason: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true, status: 'SUSPENDED' }
    });

    await AuditLogService.logAction(adminId, 'USER_SUSPENDED', 'USER', userId, { reason });
    return user;
  }

  /**
   * Activate a user
   */
  public static async activateUser(adminId: string, userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false, status: 'ACTIVE' }
    });

    await AuditLogService.logAction(adminId, 'USER_ACTIVATED', 'USER', userId, {});
    return user;
  }

  /**
   * Soft Delete a user
   */
  public static async deleteUser(adminId: string, userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), status: 'INACTIVE' }
    });

    await AuditLogService.logAction(adminId, 'USER_DELETED', 'USER', userId, {});
    return user;
  }
}
