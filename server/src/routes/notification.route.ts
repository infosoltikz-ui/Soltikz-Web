import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead } from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // All notification routes are protected

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/:id/read', markAsRead);

export default router;
