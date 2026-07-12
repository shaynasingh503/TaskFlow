import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true }
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('Comment', commentSchema);
