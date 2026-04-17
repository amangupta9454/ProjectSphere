import { ProjectProposal } from '../models/Proposal.model.js';
import { FileSubmission } from '../models/File.model.js';
import { Deadline } from '../models/Deadline.model.js';
import { Notification } from '../models/Notification.model.js';
import { Faculty } from '../models/Faculty.model.js';
import { Student } from '../models/Student.model.js';
import { sendEmail } from '../config/nodemailer.js';

// ── Email templates ──────────────────────────────────────────────────────────
const emailTemplates = {
  proposalAccepted: (studentName, projectTitle, facultyName) => ({
    subject: `✅ Project Accepted by ${facultyName} — "${projectTitle}"`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#16a34a">🎉 Your Project Has Been Accepted!</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Great news! Faculty <strong>${facultyName}</strong> has accepted your project proposal:</p>
      <div style="background:#dcfce7;border-left:4px solid #16a34a;padding:12px 16px;border-radius:8px;margin:16px 0">
        <strong>${projectTitle}</strong>
      </div>
      <p>You can now upload files and work on your final project submission.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="color:#6b7280;font-size:13px">FYP Portal — ProjectSphere</p>
    </div>`
  }),
  proposalRejected: (studentName, projectTitle, facultyName, reason) => ({
    subject: `❌ Project Rejected by ${facultyName} — "${projectTitle}"`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#dc2626">Project Rejected</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Unfortunately, faculty <strong>${facultyName}</strong> has rejected your project <strong>"${projectTitle}"</strong>.</p>
      <div style="background:#fee2e2;border-left:4px solid #dc2626;padding:12px 16px;border-radius:8px;margin:16px 0">
        <strong>Reason:</strong> ${reason}
      </div>
      <p>The HOD will reassign a supervisor. Please await further instructions.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="color:#6b7280;font-size:13px">FYP Portal — ProjectSphere</p>
    </div>`
  }),
  submissionRejected: (studentName, projectTitle, facultyName, reason) => ({
    subject: `🔄 Final Submission Rejected — "${projectTitle}"`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px">
      <h2 style="color:#d97706">Final Submission Requires Revision</h2>
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your final project submission for <strong>"${projectTitle}"</strong> has been reviewed by <strong>${facultyName}</strong> and requires revisions.</p>
      <div style="background:#fef3c7;border-left:4px solid #d97706;padding:12px 16px;border-radius:8px;margin:16px 0">
        <strong>Rejection Reason:</strong> ${reason}
      </div>
      <p>Please re-upload your corrected files in the Submission tab of your dashboard.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
      <p style="color:#6b7280;font-size:13px">FYP Portal — ProjectSphere</p>
    </div>`
  }),
};

// ── getFacultyDashboard ───────────────────────────────────────────────────────
export const getFacultyDashboard = async (req, res) => {
  try {
    const activeProjects = await ProjectProposal.find({
      assignedFaculty: req.user._id,
      status: { $in: ['Faculty Accepted', 'Submitted'] }
    }).populate('studentId', 'name email branch course year section mobileNumber');

    const pendingProposals = await ProjectProposal.find({
      assignedFaculty: req.user._id, status: 'Faculty Assigned'
    }).populate('studentId', 'name email branch course year section mobileNumber');

    // For each active project, get its uploaded files
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

    const notifs = await Notification.find({ userId: req.user._id, isRead: false }).sort({ createdAt: -1 }).limit(10);

    console.log(`\x1b[36m[FACULTY]\x1b[0m Dashboard: ${req.user.email} | Active: ${activeProjects.length} | Pending: ${pendingProposals.length}`);
    res.status(200).json({ profile: req.user, activeProjects, pendingProposals, projectFiles, recentSubmissions, deadlines, notifications: notifs });
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

    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Faculty "${req.user.name}" has accepted your project "${proposal.title}". You may now upload files.`, type: 'approval' });

    // Send confirmation email
    const { subject, html } = emailTemplates.proposalAccepted(proposal.studentId.name, proposal.title, req.user.name);
    sendEmail(proposal.studentId.email, subject, html);

    console.log(`\x1b[32m[SUCCESS]\x1b[0m Faculty accepted proposal: ${proposal.title}`);
    res.status(200).json({ message: 'Proposal accepted', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m acceptProposal:', error.message);
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

    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Your project "${proposal.title}" was rejected by faculty. Reason: ${reason}. HOD will reassign.`, type: 'rejection' });

    // Send rejection email
    const { subject, html } = emailTemplates.proposalRejected(proposal.studentId.name, proposal.title, req.user.name, reason);
    sendEmail(proposal.studentId.email, subject, html);

    console.log(`\x1b[31m[INFO]\x1b[0m Faculty rejected proposal: ${proposal.title}`);
    res.status(200).json({ message: 'Proposal rejected', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m rejectProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── rejectFinalSubmission ─────────────────────────────────────────────────────
export const rejectFinalSubmission = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim().length < 20) {
      return res.status(400).json({ message: 'Rejection reason must be at least 20 characters.' });
    }
    const proposal = await ProjectProposal.findOne({ _id: req.params.id, assignedFaculty: req.user._id })
      .populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Project not found or not assigned to you.' });
    if (proposal.status !== 'Submitted') {
      return res.status(400).json({ message: 'Project is not in Submitted state.' });
    }

    // Mark submission as rejected, reset status so student can re-upload
    proposal.finalSubmission.status = 'Rejected';
    proposal.finalSubmission.rejectionReason = reason.trim();
    proposal.status = 'Faculty Accepted'; // reset so student can re-submit
    await proposal.save();

    await Notification.create({
      userId: proposal.studentId._id, userModel: 'Student',
      message: `Your final submission for "${proposal.title}" was rejected by ${req.user.name}. Reason: ${reason.trim().substring(0, 80)}...`,
      type: 'rejection'
    });

    // Send rejection email
    const { subject, html } = emailTemplates.submissionRejected(proposal.studentId.name, proposal.title, req.user.name, reason);
    sendEmail(proposal.studentId.email, subject, html);

    console.log(`\x1b[31m[INFO]\x1b[0m Final submission rejected for: "${proposal.title}"`);
    res.status(200).json({ message: 'Submission rejected. Student can now re-submit.', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m rejectFinalSubmission:', error.message);
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
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Feedback added to: "${proposal.title}"`);
    res.status(200).json({ message: 'Feedback added', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m addFeedback:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── updateProgress (kept for backward compat but no longer used in UI) ────────
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
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Faculty ${req.user.email} assigned deadline "${title}" to ${targetProjects.length} projects`);
    res.status(201).json({ message: 'Targeted deadline assigned successfully', deadline });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m assignDeadline:', error.message);
    res.status(500).json({ message: error.message });
  }
};
