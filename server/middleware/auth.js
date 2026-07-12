import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
  if (!token) { res.status(401); throw new Error('Not authorized. Please log in.'); }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user?.isActive) { res.status(401); throw new Error('This account is inactive.'); }
    next();
  } catch (error) {
    if (!res.headersSent) { res.status(401); throw new Error('Invalid or expired token.'); }
  }
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) { res.status(403); throw new Error('You do not have permission for this action.'); }
  next();
};
