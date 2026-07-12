import { Router } from 'express';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js';
import { authorize, protect } from '../middleware/auth.js';
const router = Router(); router.use(protect, authorize('admin'));
router.route('/').get(getEmployees).post(createEmployee); router.route('/:id').put(updateEmployee).delete(deleteEmployee);
export default router;
