import { Router } from 'express';
import { adminDashboard, employeeDashboard, getNotifications, readNotification } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/auth.js';
const router = Router(); router.use(protect);
router.get('/admin', authorize('admin'), adminDashboard); router.get('/employee', authorize('employee'), employeeDashboard);
router.get('/notifications', getNotifications); router.patch('/notifications/:id/read', readNotification);
export default router;
