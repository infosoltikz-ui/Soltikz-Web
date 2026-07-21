import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();

export class RolePermissionService {
  /**
   * Retrieves all roles and their permissions
   */
  public static async getRoles() {
    return prisma.adminRole.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });
  }

  /**
   * Assigns a role to a user
   */
  public static async assignRole(adminId: string, userId: string, roleName: string) {
    const role = await prisma.adminRole.findUnique({ where: { name: roleName } });
    if (!role) throw new Error('Role not found');

    const user = await prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id }
    });

    await AuditLogService.logAction(adminId, 'ROLE_ASSIGNED', 'USER', userId, { roleName });
    return user;
  }
}
