import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { PaymentController } from '../controllers/PaymentController';
import { BillingController } from '../controllers/BillingController';
import { InvoiceController } from '../controllers/InvoiceController';
import { UsageController } from '../controllers/UsageController';
import { WebhookController } from '../controllers/WebhookController';
import { protect } from '../../../middlewares/auth.middleware';

const router = Router();

// Subscription Routes
router.post('/subscription/create', protect, SubscriptionController.create);
router.post('/subscription/cancel', protect, SubscriptionController.cancel);

// Payment Routes
router.post('/payment/create-order', protect, PaymentController.createOrder);
router.post('/payment/verify', protect, PaymentController.verifyPayment);

// Billing & Invoice Routes
router.get('/billing', protect, BillingController.getDashboard);
router.get('/invoices', protect, InvoiceController.listInvoices);
router.get('/invoices/:paymentId/download', protect, InvoiceController.downloadInvoice);

// Usage Routes
router.get('/usage', protect, UsageController.getUsage);

// Webhook Routes (No authMiddleware because it's called by Razorpay)
router.post('/webhook/razorpay', WebhookController.handleRazorpayWebhook);

export default router;
