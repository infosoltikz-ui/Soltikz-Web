import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';

export class SubscriptionController {
  public static async create(req: Request, res: Response) {
    try {
      const { plan, billingCycle } = req.body;
      const userId = (req as any).user.id;
      // In a real flow, create subscription usually happens after payment. 
      // This endpoint can be used if there's a free plan or direct downgrade.
      const sub = await SubscriptionService.updateSubscription(userId, plan, billingCycle);
      res.json(sub);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async cancel(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const sub = await SubscriptionService.cancelSubscription(userId);
      res.json(sub);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
