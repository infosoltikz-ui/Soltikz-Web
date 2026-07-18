import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from './SubscriptionService';

const prisma = new PrismaClient();

export class WebhookService {
  /**
   * Validates Razorpay Webhook Signature
   */
  public static validateWebhookSignature(payload: string, signature: string, secret: string) {
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  }

  /**
   * Processes the webhook payload from Razorpay
   */
  public static async processWebhook(event: string, payload: any) {
    switch(event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(payload);
        break;
      // Add more events like subscription.charged, etc.
    }
  }

  private static async handlePaymentCaptured(payload: any) {
    const orderId = payload.payload.payment.entity.order_id;
    // In a real flow, this webhook acts as a fallback if the frontend verify step fails or is skipped.
    // For now, our verify flow in PaymentService handles the actual subscription update.
    console.log('Webhook received payment.captured for order:', orderId);
  }

  private static async handlePaymentFailed(payload: any) {
    const orderId = payload.payload.payment.entity.order_id;
    await prisma.payment.updateMany({
      where: { razorpayOrderId: orderId },
      data: { status: 'FAILED' }
    });
  }
}
