import { Router } from 'express';
import { 
  AdminDashboardController,
  AdminUserController,
  AdminResumeController,
  AdminBillingController,
  AdminAIUsageController,
  AdminSettingsController,
  AdminAuditLogController
} from '../controllers/AdminControllers';
import { protect } from '../../../middlewares/auth.middleware';
import { requireAdmin } from '../../../middleware/requireAdmin'; // We will create this

const router = Router();

// Apply auth and admin check to all routes in this router
router.use(protect);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', AdminDashboardController.getDashboard);

// Users
router.get('/users', AdminUserController.getUsers);
router.get('/users/:id', AdminUserController.getUserDetails);
router.patch('/users/:id/suspend', AdminUserController.suspendUser);
// (Optionally add activate, delete routes)

// Resumes
router.get('/resumes', AdminResumeController.getResumes);

// Billing & Subscriptions
router.get('/payments', AdminBillingController.getPayments);
router.get('/subscriptions', AdminBillingController.getSubscriptions);

// AI Usage
router.get('/ai/usage', AdminAIUsageController.getUsageLogs);
router.get('/ai/stats', AdminAIUsageController.getStats);

// Settings
router.get('/settings', AdminSettingsController.getSettings);
router.put('/settings', AdminSettingsController.updateSetting);

// Audit Logs
router.get('/audit', AdminAuditLogController.getLogs);

export default router;
