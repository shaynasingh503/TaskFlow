import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

const populated = (query) => query.populate('assignedTo', 'name email department designation avatar').populate('assignedBy', 'name email');
const notify = (userId, title, message) => Notification.create({ userId, title, message });

export const getTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'employee' ? { assignedTo: req.user._id } : {};
  const tasks = await populated(Task.find(filter).sort({ deadline: 1 }));
  res.json(tasks);
});
export const getTask = asyncHandler(async (req, res) => {
  const task = await populated(Task.findById(req.params.id));
  if (!task) { res.status(404); throw new Error('Task not found.'); }
  if (req.user.role === 'employee' && String(task.assignedTo._id) !== String(req.user._id)) { res.status(403); throw new Error('You cannot view this task.'); }
  const comments = await Comment.find({ taskId: task._id }).populate('userId', 'name avatar').sort({ createdAt: 1 });
  res.json({ ...task.toObject(), comments });
});
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority, deadline } = req.body;
  if (!title || !description || !assignedTo || !deadline) { res.status(400); throw new Error('Title, description, assignee, and deadline are required.'); }
  const attachments = (req.files || []).map((file) => ({ name: file.originalname, path: `/uploads/${file.filename}` }));
  const task = await Task.create({ title, description, assignedTo, assignedBy: req.user._id, priority, deadline, attachments });
  await notify(assignedTo, 'New task assigned', `You have been assigned “${title}”.`);
  res.status(201).json(await populated(Task.findById(task._id)));
});
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error('Task not found.'); }
  const isAssignee = String(task.assignedTo) === String(req.user._id);
  if (req.user.role === 'employee' && !isAssignee) { res.status(403); throw new Error('You cannot update this task.'); }
  const employeeFields = ['status', 'progress'];
  const adminFields = ['title', 'description', 'assignedTo', 'priority', 'status', 'progress', 'deadline'];
  (req.user.role === 'admin' ? adminFields : employeeFields).forEach((key) => { if (req.body[key] !== undefined) task[key] = req.body[key]; });
  if (Number(task.progress) === 100) task.status = 'completed';
  if (task.status === 'completed') task.progress = 100;
  if (req.files?.length) task.attachments.push(...req.files.map((file) => ({ name: file.originalname, path: `/uploads/${file.filename}` })));
  await task.save();
  if (isAssignee && req.user.role === 'employee') await notify(task.assignedBy, 'Task progress updated', `${req.user.name} updated “${task.title}” to ${task.progress}% complete.`);
  res.json(await populated(Task.findById(task._id)));
});
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) { res.status(404); throw new Error('Task not found.'); }
  await Comment.deleteMany({ taskId: task._id });
  res.json({ message: 'Task deleted.' });
});
export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error('Task not found.'); }
  const allowed = req.user.role === 'admin' || String(task.assignedTo) === String(req.user._id);
  if (!allowed) { res.status(403); throw new Error('You cannot comment on this task.'); }
  if (!req.body.message?.trim()) { res.status(400); throw new Error('Comment cannot be empty.'); }
  const comment = await Comment.create({ taskId: task._id, userId: req.user._id, message: req.body.message });
  res.status(201).json(await comment.populate('userId', 'name avatar'));
});
