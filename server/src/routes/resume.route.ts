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
  updatePersonal,
  updateSummary,
} from '../controllers/resume.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { 
  createResumeSchema, 
  updateResumeSchema, 
  getResumesQuerySchema,
  updatePersonalSchema,
  updateSummarySchema
} from '../validators/resume.validator';

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
router.put('/:id/personal', validate(updatePersonalSchema), updatePersonal);
router.put('/:id/summary', validate(updateSummarySchema), updateSummary);

export default router;
