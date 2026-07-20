import { Router } from 'express';
import { MasterProfileController } from '../modules/master-profile/MasterProfileController';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Phase 1.15: Integration with Existing Authentication
// All Master Profile routes are protected
router.use(protect);

router.get('/', MasterProfileController.getProfile);
router.put('/auto-save', MasterProfileController.updateProfile);

export default router;
