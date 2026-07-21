import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

const prisma = new PrismaClient();

export class SystemSettingsService {
  /**
   * Retrieves all system settings
   */
  public static async getSettings() {
    return prisma.systemSetting.findMany();
  }

  /**
   * Update a setting
   */
  public static async updateSetting(adminId: string, key: string, value: string) {
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value, updatedBy: adminId },
      create: { key, value, updatedBy: adminId }
    });

    await AuditLogService.logAction(adminId, 'SETTING_UPDATED', 'SETTING', key, { newValue: value });
    return setting;
  }
}
