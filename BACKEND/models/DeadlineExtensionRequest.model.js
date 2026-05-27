import mongoose from 'mongoose';

const deadlineExtensionRequestSchema = new mongoose.Schema(
  {
    projectId:  { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectProposal', required: true },
    studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    deadlineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deadline', required: true },
    requestedDate: { type: Date, required: true },
    reason:     { type: String, required: true, minlength: 20 },
    documentUrl: { type: String, default: '' },
    documentPublicId: { type: String, default: '' },
    status:     { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    remarks:    { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'reviewedByModel' },
    reviewedByModel: { type: String, enum: ['Faculty', 'Hod', 'Admin'] },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const DeadlineExtensionRequest = mongoose.model('DeadlineExtensionRequest', deadlineExtensionRequestSchema);
