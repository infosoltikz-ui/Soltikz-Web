import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  public static async createOrder(req: Request, res: Response) {
    try {
      const { planName, billingCycle, amount } = req.body;
      const userId = (req as any).user.id;
      
      const order = await PaymentService.createOrder(userId, planName, billingCycle, amount);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async verifyPayment(req: Request, res: Response) {
    try {
      const { razorpayOrderId, razorpayPaymentId, signature, planName, billingCycle } = req.body;
      const userId = (req as any).user.id;
      
      const result = await PaymentService.verifyPayment(
        userId, 
        razorpayOrderId, 
        razorpayPaymentId, 
        signature, 
        planName, 
        billingCycle
      );
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
