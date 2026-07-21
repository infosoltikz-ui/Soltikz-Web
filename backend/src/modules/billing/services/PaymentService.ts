import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from './SubscriptionService';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export class PaymentService {
  /**
   * Creates a new Razorpay Order for a subscription plan
   */
  public static async createOrder(userId: string, planName: string, billingCycle: 'MONTHLY' | 'YEARLY', amount: number) {
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "USD",
      receipt: `receipt_${userId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Save a pending payment in DB
    await prisma.payment.create({
      data: {
        userId,
        amount,
        currency: 'USD',
        status: 'PENDING',
        razorpayOrderId: order.id,
      }
    });

    return order;
  }

  /**
   * Verifies the Razorpay signature and captures the payment.
   * Then updates the user's subscription.
   */
  public static async verifyPayment(
    userId: string, 
    razorpayOrderId: string, 
    razorpayPaymentId: string, 
    signature: string,
    planName: string,
    billingCycle: 'MONTHLY' | 'YEARLY'
  ) {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      // Mark payment as failed
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: { status: 'FAILED' }
      });
      throw new Error('Payment verification failed.');
    }

    // Capture Payment successful
    const subscription = await SubscriptionService.updateSubscription(userId, planName, billingCycle);

    const updatedPayment = await prisma.payment.updateMany({
      where: { razorpayOrderId },
      data: { 
        status: 'SUCCESS',
        razorpayPaymentId,
        subscriptionId: subscription.id
      }
    });

    return { success: true, subscription };
  }
}
