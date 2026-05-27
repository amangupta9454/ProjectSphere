import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  getHodDashboard, getAllProjects, getAllStudents, getFacultyWorkload,
  getApprovedFacultyList, approveFaculty, rejectFaculty,
  approveProposal, rejectProposal, assignFacultyToProposal,
  addStudent, addFaculty, toggleStudentBan, exportProjectsExcel,
  updateProjectSubmission, addTimelineComment, getExtensionRequests,
  reviewExtensionRequest
} from '../controllers/hod.controller.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('hod'));

// Dashboard
router.get('/dashboard', getHodDashboard);

// Projects
router.get('/projects',                getAllProjects);
router.get('/projects/export',         exportProjectsExcel);
router.put('/projects/:id/submission', updateProjectSubmission);
router.put('/proposals/:id/approve',   approveProposal);
router.put('/proposals/:id/reject',    rejectProposal);
router.put('/proposals/:id/assign',    assignFacultyToProposal);

// Timeline comment by HOD
router.post('/proposals/:proposalId/timeline/:entryId/comment', addTimelineComment);

// Faculty
router.get('/faculty/workload',        getFacultyWorkload);
router.get('/faculty/approved',        getApprovedFacultyList);
router.put('/faculty/:id/approve',     approveFaculty);
router.put('/faculty/:id/reject',      rejectFaculty);
router.post('/faculty', upload.single('profilePhoto'), addFaculty);

// Students
router.get('/students',                getAllStudents);
router.post('/students', upload.single('profilePhoto'), addStudent);
router.put('/students/:id/ban',        toggleStudentBan);

// Extension Requests
router.get('/extensions',              getExtensionRequests);
router.put('/extensions/:id/review',   reviewExtensionRequest);

export default router;
