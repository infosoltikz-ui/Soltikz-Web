import { Router } from 'express';
import { ExportController } from '../modules/export/ExportController';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Require authentication for all export routes
router.use(protect);

router.post('/:resumeId/format', ExportController.exportFormat);
router.get('/:resumeId/history', ExportController.getHistory);
router.post('/:resumeId/share', ExportController.createShareLink);
router.get('/analytics', ExportController.getAnalytics);

export default router;
