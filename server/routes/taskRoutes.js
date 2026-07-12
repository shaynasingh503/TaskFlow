import { Router } from 'express';
import { addComment, createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js';
import { authorize, protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = Router(); router.use(protect);
router.route('/').get(getTasks).post(authorize('admin'), upload.array('attachments', 4), createTask);
router.route('/:id').get(getTask).put(upload.array('attachments', 4), updateTask).delete(authorize('admin'), deleteTask);
router.post('/:id/comments', addComment);
export default router;
