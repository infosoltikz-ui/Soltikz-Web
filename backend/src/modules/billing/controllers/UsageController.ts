import { Request, Response } from 'express';
import { UsageTrackingService } from '../services/UsageTrackingService';

export class UsageController {
  public static async getUsage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const usage = await UsageTrackingService.getUsage(userId);
      res.json(usage);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
