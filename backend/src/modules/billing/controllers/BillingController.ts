import { Request, Response } from 'express';
import { BillingService } from '../services/BillingService';

export class BillingController {
  public static async getDashboard(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const summary = await BillingService.getBillingDashboardSummary(userId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
