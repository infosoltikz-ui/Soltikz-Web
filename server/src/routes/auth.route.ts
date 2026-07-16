import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email', verifyEmail);

export default router;
