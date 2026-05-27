import { ProjectProposal } from '../models/Proposal.model.js';
import { Student } from '../models/Student.model.js';
import { Faculty } from '../models/Faculty.model.js';
import { FileSubmission } from '../models/File.model.js';
import { Deadline } from '../models/Deadline.model.js';
import { Notification } from '../models/Notification.model.js';
import { DeadlineExtensionRequest } from '../models/DeadlineExtensionRequest.model.js';
import cloudinary from '../config/cloudinary.js';

export const getStudentDashboard = async (req, res) => {
  try {
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id })
      .populate('assignedFaculty', 'name email department designation');

    // Merge: global role-based deadlines + faculty-targeted project deadlines
    const globalDeadlines = await Deadline.find({
      isActive: true,
      $or: [{ targetRoles: 'all' }, { targetRoles: 'student' }]
    }).sort({ dueDate: 1 });

    let projectDeadlines = [];
    if (proposal) {
      projectDeadlines = await Deadline.find({
        isActive: true,
        targetProjects: proposal._id
      }).sort({ dueDate: 1 });
    }

    // Merge and deduplicate deadlines by _id
    const seen = new Set();
    const deadlines = [...globalDeadlines, ...projectDeadlines]
      .filter(d => { const key = d._id.toString(); if (seen.has(key)) return false; seen.add(key); return true; })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 10);

    let submissions = [];
    if (proposal) {
      submissions = await FileSubmission.find({ projectId: proposal._id }).sort({ createdAt: -1 });
    }
    const { notifications, unreadCount } = await getNotificationsForUser(req.user._id);
    console.log(`\x1b[36m[STUDENT]\x1b[0m Dashboard loaded for: ${req.user.email}`);
    res.status(200).json({ profile: req.user, proposal, submissions, deadlines, notifications, unreadCount });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getStudentDashboard:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getNotificationsForUser = async (userId) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(10);
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  return { notifications, unreadCount };
};

export const submitProposal = async (req, res) => {
  try {
    const { title, description, domain, teamSize, teamMembers, referenceLinks } = req.body;
    const existingProposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (existingProposal) return res.status(400).json({ message: 'Proposal already exists. You can only update it.' });
    const proposal = await ProjectProposal.create({
      studentId: req.user._id, title, description, domain: domain || '',
      department: req.user.branch,
      teamSize: teamSize || 1, teamMembers: teamMembers || [],
      referenceLinks: referenceLinks || []
    });
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Proposal submitted: "${title}" by ${req.user.email}`);
    res.status(201).json({ message: 'Project proposal submitted successfully', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m submitProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const { title, description, domain, teamSize, teamMembers, referenceLinks } = req.body;
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found' });
    if (!['Rejected (HOD)', 'Rejected (Faculty)'].includes(proposal.status)) {
      return res.status(400).json({ message: 'You can only update a rejected proposal' });
    }
    proposal.title = title || proposal.title;
    proposal.description = description || proposal.description;
    if (domain !== undefined) proposal.domain = domain;
    proposal.department = req.user.branch; // always enforce strict department
    if (teamSize !== undefined) proposal.teamSize = teamSize;
    if (teamMembers) proposal.teamMembers = teamMembers;
    proposal.referenceLinks = referenceLinks || proposal.referenceLinks;
    proposal.status = 'Pending HOD Review';
    await proposal.save();
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Proposal resubmitted: "${proposal.title}"`);
    res.status(200).json({ message: 'Proposal updated and resubmitted for review', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m updateProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { fileType } = req.body;
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(400).json({ message: 'Submit a proposal first before uploading.' });
    if (['Rejected (HOD)', 'Rejected (Faculty)'].includes(proposal.status)) {
      return res.status(400).json({ message: 'Cannot upload files for a rejected proposal.' });
    }
    
    const submissions = [];
    for (const file of req.files) {
      const lastFile = await FileSubmission.findOne({ projectId: proposal._id, fileType }).sort({ version: -1 });
      const version = lastFile ? lastFile.version + 1 : 1;
      const fileSubmission = await FileSubmission.create({
        studentId: req.user._id, projectId: proposal._id, fileType,
        fileName: file.originalname, cloudinaryUrl: file.path,
        publicId: file.filename, version
      });
      submissions.push(fileSubmission);
      console.log(`\x1b[32m[SUCCESS]\x1b[0m File uploaded: ${file.originalname} (${fileType}) v${version}`);
    }
    
    res.status(201).json({ message: 'Files uploaded successfully', files: submissions });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m uploadFile:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const submissions = await FileSubmission.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ files: submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isApproved: true, isEmailVerified: true, department: req.user.branch })
      .select('name email department designation specialization maxStudents');
    
    const facultyWithCounts = await Promise.all(faculty.map(async (f) => {
      const activeProjectsCount = await ProjectProposal.countDocuments({
        assignedFaculty: f._id,
        status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] }
      });
      // Count student heads: leader (1) + team members
      const activeProjects = await ProjectProposal.find({ assignedFaculty: f._id, status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] } }).select('teamMembers');
      const studentHeadCount = activeProjects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);
      const maxCap = f.maxStudents || 60;
      return {
        ...f.toObject(),
        activeProjectsCount,
        studentHeadCount,
        isAvailable: studentHeadCount < maxCap,
        maxStudents: maxCap
      };
    }));

    res.status(200).json({ faculty: facultyWithCounts });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getAvailableFaculty:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const requestSupervisor = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(400).json({ message: 'No proposal found.' });
    if (proposal.assignedFaculty) return res.status(400).json({ message: 'Supervisor already assigned.' });
    if (proposal.supervisorRequested) return res.status(400).json({ message: 'Supervisor request already pending.' });

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found.' });

    proposal.supervisorRequested = true;
    proposal.assignedFaculty = facultyId; // requested supervisor
    await proposal.save();

    await Notification.create({
      userId: facultyId,
      userModel: 'Faculty',
      message: `Student ${req.user.name} has requested you as a supervisor for "${proposal.title}".`,
      type: 'general'
    });

    res.status(200).json({ message: 'Supervisor requested successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectTargets = async (req, res) => {
  try {
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    res.status(200).json({ targets: proposal.targets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProjectTarget = async (req, res) => {
  try {
    const { title, description } = req.body;
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    
    proposal.targets.push({ title, description });
    await proposal.save();
    res.status(201).json({ message: 'Target added successfully', targets: proposal.targets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProjectTarget = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { status } = req.body;
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    
    const target = proposal.targets.id(targetId);
    if (!target) return res.status(404).json({ message: 'Target not found.' });

    target.status = status;
    await proposal.save();
    res.status(200).json({ message: 'Target updated', targets: proposal.targets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFinalProject = async (req, res) => {
  try {
    const { liveLink, githubLink, linkedinLink } = req.body;
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    if (proposal.status !== 'Faculty Accepted') {
      return res.status(400).json({ message: 'Project must be active/accepted before final submission.' });
    }

    proposal.finalSubmission = {
      liveLink,
      githubLink,
      linkedinLink,
      submittedAt: new Date()
    };
    proposal.status = 'Submitted';
    await proposal.save();

    if (proposal.assignedFaculty) {
      await Notification.create({
        userId: proposal.assignedFaculty,
        userModel: 'Faculty',
        message: `Final project submitted for "${proposal.title}".`,
        type: 'submission'
      });
    }

    res.status(200).json({ message: 'Final project submitted successfully', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { githubId, linkedinId, portfolioLink } = req.body;
    let updateFields = { githubId, linkedinId, portfolioLink };

    if (req.file) {
      if (req.user.resume && req.user.resume.publicId) {
        await cloudinary.uploader.destroy(req.user.resume.publicId);
      }
      updateFields.resume = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile updated successfully', profile: student });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m updateStudentProfile:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── addTimelineEntry (student logs a project milestone) ─────────────────────
export const addTimelineEntry = async (req, res) => {
  try {
    const { milestoneStatus, remarks } = req.body;
    const validStatuses = ['PROJECT STARTED', 'PROTOTYPE CREATED', 'PROJECT COMPLETE', 'REPORT PREPARED', 'PROJECT SUBMITTED'];
    if (!validStatuses.includes(milestoneStatus)) return res.status(400).json({ message: 'Invalid milestone status.' });

    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    if (!['Faculty Accepted', 'Submitted', 'Faculty Assigned'].includes(proposal.status)) {
      return res.status(400).json({ message: 'Timeline updates are available after faculty accepts your project.' });
    }

    proposal.timeline.push({ milestoneStatus, remarks: remarks || '', timestamp: new Date() });
    await proposal.save();

    // Notify faculty and HOD
    if (proposal.assignedFaculty) {
      await Notification.create({ userId: proposal.assignedFaculty, userModel: 'Faculty', message: `${req.user.name} updated project milestone to "${milestoneStatus}" on "${proposal.title}".`, type: 'general' });
    }

    res.status(201).json({ message: 'Timeline entry added', timeline: proposal.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── addTimelineComment (student can comment on their own timeline entries) ────
export const addTimelineComment = async (req, res) => {
  try {
    const { message } = req.body;
    const { entryId } = req.params;
    if (!message || message.trim().length < 2) return res.status(400).json({ message: 'Comment too short.' });

    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });

    const entry = proposal.timeline.id(entryId);
    if (!entry) return res.status(404).json({ message: 'Timeline entry not found.' });

    entry.comments.push({
      message: message.trim(),
      addedBy: req.user._id,
      addedModel: 'Student',
      addedByName: req.user.name,
    });
    await proposal.save();
    res.status(201).json({ message: 'Comment added', timeline: proposal.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getTimeline (get timeline for student's proposal) ─────────────────────────
export const getTimeline = async (req, res) => {
  try {
    const proposal = await ProjectProposal.findOne({ studentId: req.user._id }).select('timeline title status');
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });
    res.status(200).json({ timeline: proposal.timeline, projectTitle: proposal.title, projectStatus: proposal.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── requestDeadlineExtension ─────────────────────────────────────────────────
export const requestDeadlineExtension = async (req, res) => {
  try {
    const { deadlineId, requestedDate, reason } = req.body;
    if (!reason || reason.length < 20) return res.status(400).json({ message: 'Reason must be at least 20 characters.' });

    const proposal = await ProjectProposal.findOne({ studentId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'No proposal found.' });

    const deadline = await Deadline.findById(deadlineId);
    if (!deadline) return res.status(404).json({ message: 'Deadline not found.' });

    // Check for duplicate pending request
    const existing = await DeadlineExtensionRequest.findOne({ studentId: req.user._id, deadlineId, status: 'Pending' });
    if (existing) return res.status(400).json({ message: 'You already have a pending extension request for this deadline.' });

    let documentUrl = '';
    let documentPublicId = '';
    if (req.file) {
      documentUrl = req.file.path;
      documentPublicId = req.file.filename;
    }

    const request = await DeadlineExtensionRequest.create({
      projectId: proposal._id,
      studentId: req.user._id,
      deadlineId,
      requestedDate,
      reason,
      documentUrl,
      documentPublicId,
    });

    // Notify faculty if assigned
    if (proposal.assignedFaculty) {
      await Notification.create({ userId: proposal.assignedFaculty, userModel: 'Faculty', message: `${req.user.name} requested a deadline extension for "${deadline.title}". Review it in your dashboard.`, type: 'deadline' });
    }

    res.status(201).json({ message: 'Extension request submitted successfully.', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getMyExtensionRequests ────────────────────────────────────────────────────
export const getMyExtensionRequests = async (req, res) => {
  try {
    const requests = await DeadlineExtensionRequest.find({ studentId: req.user._id })
      .populate('deadlineId', 'title dueDate').sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
