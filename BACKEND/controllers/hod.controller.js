import { ProjectProposal } from '../models/Proposal.model.js';
import { Faculty } from '../models/Faculty.model.js';
import { Student } from '../models/Student.model.js';
import { Hod } from '../models/Hod.model.js';
import { Notification } from '../models/Notification.model.js';
import { Deadline } from '../models/Deadline.model.js';
import { DeadlineExtensionRequest } from '../models/DeadlineExtensionRequest.model.js';
import { sendEmail } from '../config/nodemailer.js';
import { proposalApprovedEmail, proposalRejectedByHodEmail } from '../utils/emailTemplates.js';
import bcrypt from 'bcrypt';

// ── getHodDashboard ────────────────────────────────────────────────────────────
export const getHodDashboard = async (req, res) => {
  try {
    if (!req.user.department) {
      return res.status(400).json({ message: 'HOD department is not configured.' });
    }
    const dept = req.user.department;

    const [unapprovedFaculty, pendingProposals, approvedNeedingAssignment, students] = await Promise.all([
      Faculty.find({ isApproved: false, isEmailVerified: true, department: dept }),
      ProjectProposal.find({ status: 'Pending HOD Review', department: dept })
        .populate('studentId', 'name email branch course year section mobileNumber')
        .sort({ createdAt: -1 }),
      ProjectProposal.find({
        status: { $in: ['HOD Approved', 'Pending Faculty Assignment', 'Rejected (Faculty)'] },
        department: dept
      }).populate('studentId', 'name email branch course year section'),
      Student.find({ branch: dept }).select('name branch year section course email mobileNumber createdAt')
    ]);

    const branchStats = students.reduce((acc, s) => {
      acc[s.branch] = (acc[s.branch] || 0) + 1; return acc;
    }, {});

    const stats = {
      totalStudents: students.length,
      totalFaculty: await Faculty.countDocuments({ isApproved: true, department: dept }),
      activeProjects: await ProjectProposal.countDocuments({ status: { $in: ['Faculty Accepted', 'Submitted'] }, department: dept }),
      pendingReview: pendingProposals.length,
      pendingFacultyAssignment: await ProjectProposal.countDocuments({ status: 'Pending Faculty Assignment', department: dept }),
      branchStats,
    };

    const recentActivity = await ProjectProposal.find({ department: dept })
      .sort({ updatedAt: -1 }).limit(10)
      .populate('studentId', 'name branch')
      .populate('assignedFaculty', 'name');

    res.status(200).json({ profile: req.user, unapprovedFaculty, pendingProposals, approvedNeedingAssignment, stats, recentActivity });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getHodDashboard:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── getAllProjects ──────────────────────────────────────────────────────────────
export const getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { department: req.user.department };
    if (status && status !== 'all') filter.status = status;
    const projects = await ProjectProposal.find(filter)
      .populate('studentId', 'name email branch course year section mobileNumber')
      .populate('assignedFaculty', 'name email department designation')
      .sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getAllStudents ──────────────────────────────────────────────────────────────
export const getAllStudents = async (req, res) => {
  try {
    const { year, section, search } = req.query;
    let filter = { branch: req.user.department };
    if (year) filter.year = year;
    if (section) filter.section = section;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const students = await Student.find(filter).select('-password -otpHash -refreshToken').sort({ name: 1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getFacultyWorkload (student-head count: leader + members) ──────────────────
export const getFacultyWorkload = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isApproved: true, department: req.user.department })
      .select('name email department designation maxStudents');
    const workload = await Promise.all(faculty.map(async (f) => {
      const projects = await ProjectProposal.find({
        assignedFaculty: f._id,
        status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] }
      }).select('teamMembers');
      // Count student heads = leader (1) + team members per project
      const studentCount = projects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);
      const projectCount = projects.length;
      return { ...f.toObject(), projectCount, studentCount, maxStudents: f.maxStudents || 60 };
    }));
    res.status(200).json(workload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── approveFaculty ─────────────────────────────────────────────────────────────
export const approveFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await Notification.create({ userId: faculty._id, userModel: 'Faculty', message: 'Your faculty account has been approved by HOD. You can now log in.', type: 'approval' });
    res.status(200).json({ message: 'Faculty approved successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── rejectFaculty ──────────────────────────────────────────────────────────────
export const rejectFaculty = async (req, res) => {
  try {
    const { reason } = req.body;
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, { isApproved: false, rejectionReason: reason }, { new: true });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.status(200).json({ message: 'Faculty rejected', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getApprovedFacultyList ─────────────────────────────────────────────────────
export const getApprovedFacultyList = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isApproved: true, department: req.user.department })
      .select('name email department designation maxStudents');
    // Attach student count to each
    const withCounts = await Promise.all(faculty.map(async (f) => {
      const projects = await ProjectProposal.find({
        assignedFaculty: f._id,
        status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] }
      }).select('teamMembers');
      const studentCount = projects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);
      return { ...f.toObject(), studentCount, maxStudents: f.maxStudents || 60, available: studentCount < (f.maxStudents || 60) };
    }));
    res.status(200).json(withCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── approveProposal (supports skipFacultyAssignment) ───────────────────────────
export const approveProposal = async (req, res) => {
  try {
    const { skipFacultyAssignment, facultyId } = req.body;
    const proposal = await ProjectProposal.findById(req.params.id).populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const hodReview = { action: 'Approved', reviewedAt: Date.now(), reviewedBy: req.user._id };

    if (facultyId) {
      // Validate faculty capacity
      const faculty = await Faculty.findById(facultyId);
      if (!faculty || !faculty.isApproved) return res.status(400).json({ message: 'Invalid or unapproved faculty.' });
      const existingProjects = await ProjectProposal.find({ assignedFaculty: facultyId, status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] } }).select('teamMembers');
      const currentStudentCount = existingProjects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);
      const newStudentCount = 1 + (proposal.teamMembers?.length || 0);
      const maxCapacity = faculty.maxStudents || 60;
      if (currentStudentCount + newStudentCount > maxCapacity) {
        return res.status(400).json({ message: `Faculty capacity exceeded! ${faculty.name} can supervise at most ${maxCapacity} students (currently ${currentStudentCount}).` });
      }
      proposal.status = 'Faculty Assigned';
      proposal.assignedFaculty = facultyId;
      proposal.hodReview = hodReview;
      await proposal.save();

      await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Your project "${proposal.title}" has been approved by HOD and faculty "${faculty.name}" has been assigned.`, type: 'approval' });
      await Notification.create({ userId: facultyId, userModel: 'Faculty', message: `You have been assigned to supervise "${proposal.title}".`, type: 'assignment' });

      // Email to student: HOD Approved
      const { subject, html } = proposalApprovedEmail(proposal.studentId.name, proposal.title, req.user.name);
      sendEmail(proposal.studentId.email, subject, html);

      return res.status(200).json({ message: 'Proposal approved and faculty assigned.', proposal });
    }

    // Skip For Now or just HOD approve
    proposal.status = skipFacultyAssignment ? 'Pending Faculty Assignment' : 'HOD Approved';
    proposal.hodReview = hodReview;
    await proposal.save();

    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Your project "${proposal.title}" has been approved by HOD. Faculty will be assigned shortly.`, type: 'approval' });

    // Email to student: HOD Approved
    const { subject, html } = proposalApprovedEmail(proposal.studentId.name, proposal.title, req.user.name);
    sendEmail(proposal.studentId.email, subject, html);

    res.status(200).json({ message: skipFacultyAssignment ? 'Proposal approved. Faculty assignment pending.' : 'Proposal approved by HOD.', proposal });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m approveProposal:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── rejectProposal ─────────────────────────────────────────────────────────────
export const rejectProposal = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.length < 20) return res.status(400).json({ message: 'Reason must be at least 20 chars' });
    const proposal = await ProjectProposal.findByIdAndUpdate(req.params.id, {
      status: 'Rejected (HOD)',
      hodReview: { action: 'Rejected', comment: reason, reviewedAt: Date.now(), reviewedBy: req.user._id }
    }, { new: true }).populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Your project "${proposal.title}" was rejected by HOD. Reason: ${reason}`, type: 'rejection' });

    // Email student about rejection
    const { subject, html } = proposalRejectedByHodEmail(proposal.studentId.name, proposal.title, reason);
    sendEmail(proposal.studentId.email, subject, html);

    res.status(200).json({ message: 'Proposal rejected by HOD', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── assignFacultyToProposal ────────────────────────────────────────────────────
export const assignFacultyToProposal = async (req, res) => {
  try {
    const { facultyId } = req.body;
    const proposal = await ProjectProposal.findById(req.params.id).populate('studentId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const validStatuses = ['HOD Approved', 'Pending Faculty Assignment', 'Rejected (Faculty)'];
    if (!validStatuses.includes(proposal.status)) {
      return res.status(400).json({ message: `Proposal must be in one of [${validStatuses.join(', ')}] before assigning faculty.` });
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty || !faculty.isApproved) return res.status(400).json({ message: 'Invalid or unapproved faculty selected.' });

    // ── Capacity check: count student heads (leader + team members) ──
    const existingProjects = await ProjectProposal.find({
      assignedFaculty: facultyId,
      status: { $in: ['Faculty Assigned', 'Faculty Accepted', 'Submitted'] }
    }).select('teamMembers');
    const currentStudentCount = existingProjects.reduce((sum, p) => sum + 1 + (p.teamMembers?.length || 0), 0);
    const newStudentCount = 1 + (proposal.teamMembers?.length || 0);
    const maxCapacity = faculty.maxStudents || 60;
    if (currentStudentCount + newStudentCount > maxCapacity) {
      return res.status(400).json({
        message: `Supervision capacity exceeded! ${faculty.name} can supervise at most ${maxCapacity} students (currently ${currentStudentCount}, adding ${newStudentCount}).`
      });
    }

    proposal.assignedFaculty = facultyId;
    proposal.status = 'Faculty Assigned';
    await proposal.save();

    await Notification.create({ userId: proposal.studentId._id, userModel: 'Student', message: `Faculty "${faculty.name}" has been assigned to your project "${proposal.title}".`, type: 'assignment' });
    await Notification.create({ userId: facultyId, userModel: 'Faculty', message: `You have been assigned to supervise "${proposal.title}".`, type: 'assignment' });

    res.status(200).json({ message: 'Faculty assigned successfully', proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── addTimelineComment (HOD can comment on student timeline entries) ────────────
export const addTimelineComment = async (req, res) => {
  try {
    const { message } = req.body;
    const { proposalId, entryId } = req.params;
    if (!message || message.trim().length < 2) return res.status(400).json({ message: 'Comment must be at least 2 characters.' });

    const proposal = await ProjectProposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found.' });

    const entry = proposal.timeline.id(entryId);
    if (!entry) return res.status(404).json({ message: 'Timeline entry not found.' });

    entry.comments.push({
      message: message.trim(),
      addedBy: req.user._id,
      addedModel: 'Hod',
      addedByName: req.user.name,
    });
    await proposal.save();

    await Notification.create({ userId: proposal.studentId, userModel: 'Student', message: `HOD commented on your timeline milestone: "${message.substring(0, 60)}..."`, type: 'feedback' });

    res.status(201).json({ message: 'Comment added', timeline: proposal.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── getExtensionRequests (HOD reviews all extension requests) ───────────────────
export const getExtensionRequests = async (req, res) => {
  try {
    const requests = await DeadlineExtensionRequest.find()
      .populate('studentId', 'name email branch course')
      .populate('projectId', 'title department')
      .populate('deadlineId', 'title dueDate')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── reviewExtensionRequest (HOD approve/reject) ────────────────────────────────
export const reviewExtensionRequest = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
    const request = await DeadlineExtensionRequest.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('deadlineId', 'title dueDate');
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    request.status = status;
    request.remarks = remarks || '';
    request.reviewedBy = req.user._id;
    request.reviewedByModel = 'Hod';
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

// ── addStudent (HOD can add) ───────────────────────────────────────────────────
export const addStudent = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, course, branch, year, section } = req.body;
    const userExists = await Student.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    let profilePhoto = {};
    if (req.file) profilePhoto = { url: req.file.path, publicId: req.file.filename };
    const student = await Student.create({ name, email, password: hashedPassword, mobileNumber, course, branch, year, section, role: 'student', isEmailVerified: true, profilePhoto });
    res.status(201).json({ message: 'Student created successfully.', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── addFaculty (HOD can add) ───────────────────────────────────────────────────
export const addFaculty = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, department, designation, employeeId } = req.body;
    const userExists = await Faculty.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    let profilePhoto = {};
    if (req.file) profilePhoto = { url: req.file.path, publicId: req.file.filename };
    const faculty = await Faculty.create({ name, email, password: hashedPassword, mobileNumber, department, designation, employeeId, role: 'faculty', isEmailVerified: true, isApproved: true, profilePhoto });
    res.status(201).json({ message: 'Faculty created successfully.', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── toggleStudentBan ───────────────────────────────────────────────────────────
export const toggleStudentBan = async (req, res) => {
  try {
    const { isBanned, banReason } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { isBanned, banReason: isBanned ? banReason : '' }, { new: true }).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    res.status(200).json({ message: `Student access ${isBanned ? 'revoked' : 'restored'}.`, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── exportProjectsExcel ────────────────────────────────────────────────────────
import ExcelJS from 'exceljs';

export const exportProjectsExcel = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { department: req.user.department };
    if (status && status !== 'all') filter.status = status;
    const projects = await ProjectProposal.find(filter)
      .populate('studentId', 'name email branch course year section mobileNumber')
      .sort({ updatedAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projects');
    worksheet.columns = [
      { header: 'Project Title', key: 'title', width: 30 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Status', key: 'status', width: 25 },
      { header: 'Leader Name', key: 'leaderName', width: 20 },
      { header: 'Mobile', key: 'mobileNumber', width: 15 },
      { header: 'Course', key: 'course', width: 10 },
      { header: 'Branch', key: 'branch', width: 10 },
      { header: 'Section', key: 'section', width: 10 },
      { header: "Members' Name", key: 'members', width: 30 },
      { header: 'Project Submitted', key: 'submitted', width: 20 }
    ];

    projects.forEach((p) => {
      worksheet.addRow({
        title: p.title, department: p.department, status: p.status,
        leaderName: p.studentId?.name || 'N/A', mobileNumber: p.studentId?.mobileNumber || 'N/A',
        course: p.studentId?.course || 'N/A', branch: p.studentId?.branch || 'N/A',
        section: p.studentId?.section || 'N/A',
        members: p.teamMembers?.map(m => m.name).join(', ') || 'None',
        submitted: p.finalSubmission?.status || 'Not Submitted'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=projects-export-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── updateProjectSubmission ────────────────────────────────────────────────────
export const updateProjectSubmission = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const proposal = await ProjectProposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Project not found' });
    if (!proposal.finalSubmission) proposal.finalSubmission = { status: 'Not Submitted' };
    proposal.finalSubmission.status = status;
    proposal.finalSubmission.rejectionReason = status === 'Rejected' ? rejectionReason : '';
    await proposal.save();
    await Notification.create({ userId: proposal.studentId, userModel: 'Student', message: `Your final submission status is now: ${status}.`, type: 'general' });
    res.status(200).json({ message: `Submission status updated to ${status}`, proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
