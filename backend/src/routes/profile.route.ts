import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  updatePassword
} from '../controllers/profile.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema, updatePasswordSchema } from '../validators/profile.validator';
import { upload } from '../lib/cloudinary';

const router = Router();

router.use(protect); // All profile routes are protected

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.put('/password', validate(updatePasswordSchema), updatePassword);

export default router;
