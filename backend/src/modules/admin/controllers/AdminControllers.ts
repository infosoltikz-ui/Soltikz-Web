import { Request, Response } from 'express';
import { AdminDashboardService } from '../services/AdminDashboardService';
import { UserManagementService } from '../services/UserManagementService';
import { ResumeManagementService } from '../services/ResumeManagementService';
import { BillingManagementService } from '../services/BillingManagementService';
import { AIUsageManagementService } from '../services/AIUsageManagementService';
import { AuditLogService } from '../services/AuditLogService';
import { SystemSettingsService } from '../services/SystemSettingsService';

export class AdminDashboardController {
  public static async getDashboard(req: Request, res: Response) {
    try {
      const data = await AdminDashboardService.getOverview();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminUserController {
  public static async getUsers(req: Request, res: Response) {
    try {
      const data = await UserManagementService.getUsers(req.query as any);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async getUserDetails(req: Request, res: Response) {
    try {
      const data = await UserManagementService.getUserDetails(req.params.id as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async suspendUser(req: Request, res: Response) {
    try {
      const adminId = (req as any).user.id;
      const { reason } = req.body;
      const data = await UserManagementService.suspendUser(adminId, req.params.id as string, reason as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminResumeController {
  public static async getResumes(req: Request, res: Response) {
    try {
      const { skip, take, search } = req.query;
      const data = await ResumeManagementService.getResumes(Number(skip) || 0, Number(take) || 50, search as string || '');
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminBillingController {
  public static async getPayments(req: Request, res: Response) {
    try {
      const { skip, take } = req.query;
      const data = await BillingManagementService.getPayments(Number(skip) || 0, Number(take) || 50);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async getSubscriptions(req: Request, res: Response) {
    try {
      const { skip, take } = req.query;
      const data = await BillingManagementService.getSubscriptions(Number(skip) || 0, Number(take) || 50);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminAIUsageController {
  public static async getUsageLogs(req: Request, res: Response) {
    try {
      const { skip, take } = req.query;
      const data = await AIUsageManagementService.getUsageLogs(Number(skip) || 0, Number(take) || 50);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async getStats(req: Request, res: Response) {
    try {
      const data = await AIUsageManagementService.getStats();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminSettingsController {
  public static async getSettings(req: Request, res: Response) {
    try {
      const data = await SystemSettingsService.getSettings();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async updateSetting(req: Request, res: Response) {
    try {
      const adminId = (req as any).user.id;
      const { key, value } = req.body;
      const data = await SystemSettingsService.updateSetting(adminId, key, value);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export class AdminAuditLogController {
  public static async getLogs(req: Request, res: Response) {
    try {
      const { skip, take } = req.query;
      const data = await AuditLogService.getLogs(Number(skip) || 0, Number(take) || 50);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
