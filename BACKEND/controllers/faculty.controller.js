import { ProjectProposal } from '../models/Proposal.model.js';
import { FileSubmission } from '../models/File.model.js';
import { Deadline } from '../models/Deadline.model.js';
import { Notification } from '../models/Notification.model.js';
import { Faculty } from '../models/Faculty.model.js';
import { Student } from '../models/Student.model.js';
import { DeadlineExtensionRequest } from '../models/DeadlineExtensionRequest.model.js';
// NOTE: No sendEmail import — students receive NO emails from faculty per project rules.
// Only in-portal notifications are sent.

// ── getFacultyDashboard ───────────────────────────────────────────────────────
export const getFacultyDashboard = async (req, res) => {
  try {
    const activeProjects = await ProjectProposal.find({
      assignedFaculty: req.user._id,
      status: { $in: ['Faculty Accepted', 'Submitted'] }
    }).populate('studentId', 'name email branch course year section mobileNumber profilePhoto');

    const pendingProposals = await ProjectProposal.find({
      assignedFaculty: req.user._id, status: 'Faculty Assigned'
    }).populate('studentId', 'name email branch course year section mobileNumber');

    const projectFiles = {};
    await Promise.all(activeProjects.map(async (p) => {
      const files = await FileSubmission.find({ projectId: p._id }).sort({ createdAt: -1 });
      projectFiles[p._id.toString()] = files;
    }));

    const recentSubmissions = await FileSubmission.find({
      projectId: { $in: activeProjects.map(p => p._id) }
    }).populate('studentId', 'name').sort({ createdAt: -1 }).limit(10);

    const deadlines = await Deadline.find({
      $or: [
        { isActive: true, $or: [{ targetRoles: 'all' }, { targetRoles: 'faculty' }] },
        { isActive: true, createdBy: req.user._id }
      ]
    }).sort({ dueDate: 1 }).limit(10);

    const notifs = await Notification.find({ userId: req.user._id, isRead: false }).sort({ createdAt: -1 }).limit(20);
    const allNotifs = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);

    // Analytics
    const completedProjects = await ProjectProposal.countDocuments({
      assignedFaculty: req.user._id,
      'finalSubmission.status': 'Accepted'
    });

    // Extension requests for this faculty's supervised projects
    const projectIds = activeProjects.map(p => p._id);
    const extensionRequests = await DeadlineExtensionRequest.find({
      projectId: { $in: projectIds }, status: 'Pending'
    }).populate('studentId', 'name email').populate('deadlineId', 'title dueDate').populate('projectId', 'title');

    // Student heads count
    const allProjects = await ProjectProposal.find({ assignedFaculty: req.user._id, status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] } }).select('teamMembers studentId');
    const totalStudentHeads = allProjects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);

    res.status(200).json({
      profile: req.user,
      activeProjects,
      pendingProposals,
      projectFiles,
      recentSubmissions,
      deadlines,
      notifications: allNotifs,
      unreadCount: notifs.length,
      completedProjects,
      extensionRequests,
      totalStudentHeads,
      maxStudents: req.user.maxStudents || 60,
    });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getFacultyDashboard:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── acceptProposal ────────────────────────────────────────────────────────────
export const acceptProposal = async (req, res) => {
  try {
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { status: 'Faculty Accepted', facultyReview: { action: 'Accepted', reviewedAt: Date.now() } },
      { new: true }
    ).populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    // Notification only — no email to student per policy
    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Faculty "${req.user.name}" has accepted your project "${proposal.title}". You may now upload files.`, type: 'approval' });

    res.status(200).json({ message: 'Proposal accepted', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── rejectProposal ────────────────────────────────────────────────────────────
export const rejectProposal = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.length < 20) return res.status(400).json({ message: 'Reason must be at least 20 characters' });
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { status: 'Rejected (Faculty)', facultyReview: { action: 'Rejected', comment: reason, reviewedAt: Date.now() }, assignedFaculty: null },
      { new: true }
    ).populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    // Notification only — no email to student per policy
    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Your project "${proposal.title}" was rejected by faculty. Reason: ${reason}. HOD will reassign.`, type: 'rejection' });

    res.status(200).json({ message: 'Proposal rejected', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── rejectFinalSubmission ─────────────────────────────────────────────────────
export const rejectFinalSubmission = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim().length < 20) return res.status(400).json({ message: 'Rejection reason must be at least 20 characters.' });
    const proposal = await ProjectProposal.findOne({ _id: req.params.id, assignedFaculty: req.user._id })
      .populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Project not found or not assigned to you.' });
    if (proposal.status !== 'Submitted') return res.status(400).json({ message: 'Project is not in Submitted state.' });

    proposal.finalSubmission.status = 'Rejected';
    proposal.finalSubmission.rejectionReason = reason.trim();
    proposal.status = 'Faculty Accepted';
    await proposal.save();

    // Notification only — no email to student per policy
    await Notification.create({
      userId: proposal.studentId._id, userModel: 'Student',
      message: `Your final submission for "${proposal.title}" was rejected by ${req.user.name}. Reason: ${reason.trim().substring(0, 80)}...`,
      type: 'rejection'
    });

    res.status(200).json({ message: 'Submission rejected. Student can now re-submit.', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── addFeedback ───────────────────────────────────────────────────────────────
export const addFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 5) return res.status(400).json({ message: 'Feedback message must be at least 5 characters' });
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { $push: { facultyFeedback: { message: message.trim(), addedBy: req.user._id, addedAt: new Date() } } },
      { new: true }
    );
    if (!proposal) return res.status(404).json({ message: 'Proposal not found or you are not the assigned faculty' });
    await Notification.create({ userId: proposal.studentId, userModel: 'Student', message: `New feedback from your supervisor on "${proposal.title}": "${message.substring(0, 60)}..."`, type: 'feedback' });
    res.status(200).json({ message: 'Feedback added', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── updateProgress ────────────────────────────────────────────────────────────
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    if (progress < 0 || progress > 100) return res.status(400).json({ message: 'Progress must be 0–100' });
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { progress },
      { new: true }
    );
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    res.status(200).json({ message: 'Progress updated', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── assignDeadline ────────────────────────────────────────────────────────────
export const assignDeadline = async (req, res) => {
  try {
    const { title, description, dueDate, targetProjects } = req.body;
    const validProjects = await ProjectProposal.find({ _id: { $in: targetProjects }, assignedFaculty: req.user._id });
    if (validProjects.length !== targetProjects.length) return res.status(403).json({ message: 'You can only assign deadlines to projects you supervise.' });
    const deadline = await Deadline.create({
      title, description, dueDate,
      targetRoles: [],
      targetProjects,
      createdBy: req.user._id,
      createdModel: 'Faculty',
      isActive: true,
    });
    const studentIds = validProjects.map(p => p.studentId);
    const notifications = studentIds.map(userId => ({
      userId, userModel: 'Student',
      message: `New targeted deadline from your supervisor: "${title}" — Due ${new Date(dueDate).toLocaleDateString()}`,
      type: 'deadline'
    }));
    await Notification.insertMany(notifications);
    res.status(201).json({ message: 'Targeted deadline assigned successfully', deadline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── rescheduleDeadline ────────────────────────────────────────────────────────
export const rescheduleDeadline = async (req, res) => {
  try {
    const { newDate } = req.body;
    const deadline = await Deadline.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!deadline) return res.status(404).json({ message: 'Deadline not found or not created by you.' });
    const oldDate = deadline.dueDate;
    deadline.dueDate = newDate;
    await deadline.save();
    // Notify students linked to this deadline
    if (deadline.targetProjects?.length) {
      const projects = await ProjectProposal.find({ _id: { $in: deadline.targetProjects } }).select('studentId');
      const notifications = projects.map(p => ({
        userId: p.studentId, userModel: 'Student',
        message: `Deadline "${deadline.title}" has been rescheduled to ${new Date(newDate).toLocaleDateString()}.`,
        type: 'deadline'
      }));
      await Notification.insertMany(notifications);
    }
    res.status(200).json({ message: 'Deadline rescheduled', deadline, oldDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── addTimelineComment (faculty can comment on student timeline) ───────────────
export const addTimelineComment = async (req, res) => {
  try {
    const { message } = req.body;
    const { proposalId, entryId } = req.params;
    if (!message || message.trim().length < 2) return res.status(400).json({ message: 'Comment must be at least 2 characters.' });

    const proposal = await ProjectProposal.findOne({ _id: proposalId, assignedFaculty: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found or not assigned to you.' });

    const entry = proposal.timeline.id(entryId);
    if (!entry) return res.status(404).json({ message: 'Timeline entry not found.' });

    entry.comments.push({
      message: message.trim(),
      addedBy: req.user._id,
      addedModel: 'Faculty',
      addedByName: req.user.name,
    });
    await proposal.save();

    await Notification.create({ userId: proposal.studentId, userModel: 'Student', message: `Your supervisor commented on your timeline: "${message.substring(0, 60)}..."`, type: 'feedback' });

    res.status(201).json({ message: 'Comment added', timeline: proposal.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── reviewExtensionRequest (faculty can approve/reject) ────────────────────────
export const reviewExtensionRequest = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
    const request = await DeadlineExtensionRequest.findById(req.params.id)
      .populate('studentId', 'name email').populate('deadlineId', 'title dueDate');
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    request.status = status;
    request.remarks = remarks || '';
    request.reviewedBy = req.user._id;
    request.reviewedByModel = 'Faculty';
    request.reviewedAt = new Date();

    if (status === 'Approved') {
      await Deadline.findByIdAndUpdate(request.deadlineId._id, { dueDate: request.requestedDate });
      await Notification.create({ userId: request.studentId._id, userModel: 'Student', message: `Your deadline extension request was approved. New deadline: ${new Date(request.requestedDate).toLocaleDateString()}.`, type: 'deadline' });
    } else {
      await Notification.create({ userId: request.studentId._id, userModel: 'Student', message: `Your deadline extension request was rejected. ${remarks ? 'Reason: ' + remarks : ''}`, type: 'deadline' });
    }
    await request.save();
    res.status(200).json({ message: `Extension request ${status.toLowerCase()}.`, request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getMyStudents (all student heads supervised by faculty) ───────────────────
export const getMyStudents = async (req, res) => {
  try {
    const projects = await ProjectProposal.find({
      assignedFaculty: req.user._id,
      status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] }
    }).populate('studentId', 'name email branch course year section mobileNumber profilePhoto').select('studentId teamMembers title status progress finalSubmission timeline');

    const result = projects.map(p => ({
      _id: p._id,
      projectTitle: p.title,
      projectStatus: p.status,
      progress: p.progress || 0,
      finalSubmissionStatus: p.finalSubmission?.status || 'Not Submitted',
      latestMilestone: p.timeline?.length ? p.timeline[p.timeline.length - 1].milestoneStatus : null,
      leader: p.studentId,
      teamMembers: p.teamMembers || [],
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
