import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { createToken } from '../utils/token.js';

const response = (res, user, status = 200) => res.status(status).json({ token: createToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, designation: user.designation, phone: user.phone, avatar: user.avatar } });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'employee', department, designation, phone } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('Name, email, and password are required.'); }
  if (await User.findOne({ email })) { res.status(409); throw new Error('An account with this email already exists.'); }
  if (await User.exists({ role: 'admin' })) { res.status(403); throw new Error('Public registration is disabled. Ask an administrator to create your account.'); }
  if (role !== 'admin') { res.status(400); throw new Error('Use role "admin" when creating the first account.'); }
  const user = await User.create({ name, email, password, role, department, designation, phone });
  response(res, user, 201);
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !await user.comparePassword(password) || !user.isActive) { res.status(401); throw new Error('Invalid email or password.'); }
  response(res, user);
});
export const me = asyncHandler(async (req, res) => res.json({ user: req.user }));
export const logout = (req, res) => res.json({ message: 'Logged out successfully.' });
