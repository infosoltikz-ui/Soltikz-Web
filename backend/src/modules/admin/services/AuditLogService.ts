import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditLogService {
  /**
   * Logs an action performed by an admin or user.
   */
  public static async logAction(
    userId: string | null,
    action: string,
    entityType: string | null = null,
    entityId: string | null = null,
    metadata: any = null,
    ipAddress: string | null = null
  ) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress,
      }
    });
  }

  /**
   * Retrieves recent audit logs
   */
  public static async getLogs(skip = 0, take = 50) {
    const logs = await prisma.auditLog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const total = await prisma.auditLog.count();
    return { logs, total };
  }
}
