import { ProjectProposal } from '../models/Proposal.model.js';
import { FileSubmission } from '../models/File.model.js';
import { Deadline } from '../models/Deadline.model.js';
import { Notification } from '../models/Notification.model.js';

export const getFacultyDashboard = async (req, res) => {
  try {
    const activeProjects = await ProjectProposal.find({
      assignedFaculty: req.user._id,
      status: { $in: ['Faculty Accepted', 'Submitted'] }
    }).populate('studentId', 'name email branch course year section');

    const pendingProposals = await ProjectProposal.find({
      assignedFaculty: req.user._id, status: 'Faculty Assigned'
    }).populate('studentId', 'name email branch course');

    const recentSubmissions = await FileSubmission.find({
      projectId: { $in: activeProjects.map(p => p._id) }
    }).populate('studentId', 'name').sort({ createdAt: -1 }).limit(10);

    const deadlines = await Deadline.find({
      isActive: true, $or: [{ targetRoles: 'all' }, { targetRoles: 'faculty' }]
    }).sort({ dueDate: 1 }).limit(5);

    const notifs = await Notification.find({ userId: req.user._id, isRead: false }).sort({ createdAt: -1 }).limit(10);

    console.log(`\x1b[36m[FACULTY]\x1b[0m Dashboard: ${req.user.email} | Active: ${activeProjects.length} | Pending: ${pendingProposals.length}`);
    res.status(200).json({ profile: req.user, activeProjects, pendingProposals, recentSubmissions, deadlines, notifications: notifs });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getFacultyDashboard:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const acceptProposal = async (req, res) => {
  try {
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { status: 'Faculty Accepted', facultyReview: { action: 'Accepted', reviewedAt: Date.now() } },
      { new: true }
    );
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    await Notification.create({ userId: proposal.studentId, message: `Faculty "${req.user.name}" has accepted your project "${proposal.title}". You may now upload files.`, type: 'approval' });
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Faculty accepted proposal: ${proposal.title}`);
    res.status(200).json({ message: 'Proposal accepted', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m acceptProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const rejectProposal = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.length < 20) return res.status(400).json({ message: 'Reason must be at least 20 characters' });
    const proposal = await ProjectProposal.findOneAndUpdate(
      { _id: req.params.id, assignedFaculty: req.user._id },
      { status: 'Rejected (Faculty)', facultyReview: { action: 'Rejected', comment: reason, reviewedAt: Date.now() }, assignedFaculty: null },
      { new: true }
    );
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    await Notification.create({ userId: proposal.studentId, message: `Your project "${proposal.title}" was rejected by faculty. Reason: ${reason}. HOD will reassign.`, type: 'rejection' });
    console.log(`\x1b[31m[INFO]\x1b[0m Faculty rejected proposal: ${proposal.title}`);
    res.status(200).json({ message: 'Proposal rejected', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m rejectProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

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
    await Notification.create({ userId: proposal.studentId, message: `New feedback from your supervisor on "${proposal.title}": "${message.substring(0, 60)}..."`, type: 'feedback' });
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Feedback added to: "${proposal.title}"`);
    res.status(200).json({ message: 'Feedback added', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m addFeedback:', error.message);
    res.status(500).json({ message: error.message });
  }
};

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
    await Notification.create({ userId: proposal.studentId, message: `Your project progress has been updated to ${progress}% by your supervisor.`, type: 'general' });
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Progress updated to ${progress}% for: "${proposal.title}"`);
    res.status(200).json({ message: 'Progress updated', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m updateProgress:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const assignDeadline = async (req, res) => {
  try {
    const { title, description, dueDate, targetProjects } = req.body;
    
    // Verify faculty owns these projects
    const validProjects = await ProjectProposal.find({
      _id: { $in: targetProjects },
      assignedFaculty: req.user._id
    });

    if (validProjects.length !== targetProjects.length) {
      return res.status(403).json({ message: 'You can only assign deadlines to projects you supervise.' });
    }

    const deadline = await Deadline.create({
      title, description, dueDate,
      targetRoles: [],
      targetProjects,
      createdBy: req.user._id,
    });

    // Notify students of targeted deadline
    const studentIds = validProjects.map(p => p.studentId);
    const notifications = studentIds.map(userId => ({
      userId,
      message: `New targeted deadline from your supervisor: "${title}" — Due ${new Date(dueDate).toLocaleDateString()}`,
      type: 'deadline'
    }));
    await Notification.insertMany(notifications);

    console.log(`\x1b[32m[SUCCESS]\x1b[0m Faculty ${req.user.email} assigned deadline "${title}" to ${targetProjects.length} projects`);
    res.status(201).json({ message: 'Targeted deadline assigned successfully', deadline });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m assignDeadline:', error.message);
    res.status(500).json({ message: error.message });
  }
};
