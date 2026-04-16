import mongoose from 'mongoose';

const projectProposalSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true, minlength: 10, maxlength: 120 },
    description: { type: String, required: true, minlength: 100, maxlength: 1000 },
    department: { type: String, enum: ['Computer Science', 'Electrical', 'Mechanical Polytechnic', 'BCA', 'BBA', 'MBA', 'MCA', 'B.Ed', 'M.Ed'], required: true },
    teamSize: { type: Number, default: 1 },
    teamMembers: [{
      name: String,
      email: String,
      mobileNumber: String,
      course: String,
      branch: String,
      section: String,
    }],
    referenceLinks: [String],
    targets: [{
      title: String,
      description: String,
      status: { type: String, enum: ['Completed', 'Ongoing', 'Pending'], default: 'Pending' },
      createdAt: { type: Date, default: Date.now }
    }],
    finalSubmission: {
      liveLink: String,
      githubLink: String,
      linkedinLink: String,
      submittedAt: Date,
      status: {
        type: String,
        enum: ['Not Submitted', 'Under Review', 'Accepted', 'Rejected'],
        default: 'Not Submitted'
      },
      rejectionReason: String,
    },
    supervisorRequested: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        'Pending HOD Review',
        'HOD Approved',
        'Rejected (HOD)',
        'Faculty Assigned',
        'Faculty Accepted',
        'Rejected (Faculty)',
        'Submitted',
      ],
      default: 'Pending HOD Review',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    hodReview: {
      action: String,
      comment: String,
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hod' },
    },
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    facultyReview: {
      action: String,
      comment: String,
      reviewedAt: Date,
    },
    // Faculty feedback log — appended over time
    facultyFeedback: [
      {
        message: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
      },
    ],
    // Linked deadline (optional)
    deadline: { type: mongoose.Schema.Types.ObjectId, ref: 'Deadline' },
  },
  { timestamps: true }
);

export const ProjectProposal = mongoose.model('ProjectProposal', projectProposalSchema);
