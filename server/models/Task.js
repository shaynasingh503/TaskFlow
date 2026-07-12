import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({ name: String, path: String }, { _id: false });
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  deadline: { type: Date, required: true },
  attachments: [attachmentSchema]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
