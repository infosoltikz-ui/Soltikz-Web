import { Router } from 'express';
import { CoverLetterController } from '../modules/cover-letter/CoverLetterController';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All cover letter routes require authentication
router.use(protect);

router.get('/templates', CoverLetterController.getTemplates);
router.get('/analytics', CoverLetterController.getAnalytics);

router.post('/stream', CoverLetterController.stream);
router.post('/save', CoverLetterController.save);
router.get('/', CoverLetterController.getAll);

router.get('/:id', CoverLetterController.getById);
router.put('/:id', CoverLetterController.update);
router.delete('/:id', CoverLetterController.deleteLetter);
router.post('/:id/export', CoverLetterController.exportFormat);

export default router;
