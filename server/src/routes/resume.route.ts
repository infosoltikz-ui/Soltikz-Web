import { Router } from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  archiveResume,
  restoreResume,
  toggleFavorite,
} from '../controllers/resume.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createResumeSchema, updateResumeSchema, getResumesQuerySchema } from '../validators/resume.validator';

const router = Router();

router.use(protect); // All resume routes require authentication

router
  .route('/')
  .get(validate(getResumesQuerySchema), getResumes)
  .post(validate(createResumeSchema), createResume);

router
  .route('/:id')
  .get(getResumeById)
  .put(validate(updateResumeSchema), updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);
router.post('/:id/archive', archiveResume);
router.post('/:id/restore', restoreResume);
router.post('/:id/favorite', toggleFavorite);

export default router;
