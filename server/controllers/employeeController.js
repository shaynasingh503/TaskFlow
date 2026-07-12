import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
  res.json(employees);
});
export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, department, designation, phone } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('Name, email, and temporary password are required.'); }
  if (await User.findOne({ email })) { res.status(409); throw new Error('An account with this email already exists.'); }
  const employee = await User.create({ name, email, password, department, designation, phone, role: 'employee' });
  res.status(201).json(await User.findById(employee._id).select('-password'));
});
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
  if (!employee) { res.status(404); throw new Error('Employee not found.'); }
  ['name', 'email', 'department', 'designation', 'phone', 'isActive', 'avatar'].forEach((key) => { if (req.body[key] !== undefined) employee[key] = req.body[key]; });
  if (req.body.password) employee.password = req.body.password;
  await employee.save();
  res.json(await User.findById(employee._id).select('-password'));
});
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findOneAndDelete({ _id: req.params.id, role: 'employee' });
  if (!employee) { res.status(404); throw new Error('Employee not found.'); }
  res.json({ message: 'Employee removed.' });
});
