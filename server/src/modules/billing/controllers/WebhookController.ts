import { Request, Response } from 'express';
import { WebhookService } from '../services/WebhookService';

export class WebhookController {
  public static async handleRazorpayWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const payload = JSON.stringify(req.body);
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

      if (!WebhookService.validateWebhookSignature(payload, signature, secret)) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      await WebhookService.processWebhook(req.body.event, req.body);
      res.json({ status: 'ok' });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
