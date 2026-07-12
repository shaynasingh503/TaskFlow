import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

export const adminDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  const [totalEmployees, pendingTasks, completedTasks, overdueTasks, recentTasks] = await Promise.all([
    User.countDocuments({ role: 'employee', isActive: true }),
    Task.countDocuments({ status: { $ne: 'completed' } }),
    Task.countDocuments({ status: 'completed' }),
    Task.countDocuments({ status: { $ne: 'completed' }, deadline: { $lt: today } }),
    Task.find().sort({ updatedAt: -1 }).limit(6).populate('assignedTo', 'name').populate('assignedBy', 'name')
  ]);
  res.json({ totalEmployees, pendingTasks, completedTasks, overdueTasks, recentTasks });
});
export const employeeDashboard = asyncHandler(async (req, res) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
  const filter = { assignedTo: req.user._id };
  const [todayTasks, pending, completed, upcoming, notifications] = await Promise.all([
    Task.find({ ...filter, deadline: { $gte: today, $lt: new Date(today.getTime() + 86400000) } }).sort({ priority: -1 }),
    Task.countDocuments({ ...filter, status: { $ne: 'completed' } }),
    Task.countDocuments({ ...filter, status: 'completed' }),
    Task.find({ ...filter, status: { $ne: 'completed' }, deadline: { $gte: today, $lte: nextWeek } }).sort({ deadline: 1 }).limit(5),
    Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5)
  ]);
  res.json({ todayTasks, pending, completed, upcoming, notifications });
});
export const getNotifications = asyncHandler(async (req, res) => res.json(await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })));
export const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true }, { new: true });
  if (!notification) { res.status(404); throw new Error('Notification not found.'); }
  res.json(notification);
});
