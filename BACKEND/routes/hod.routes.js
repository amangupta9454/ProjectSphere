import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  getHodDashboard, approveFaculty, rejectFaculty, getApprovedFacultyList,
  approveProposal, rejectProposal, assignFacultyToProposal,
  getAllProjects, getAllStudents, getFacultyWorkload,
  addStudent, addFaculty, toggleStudentBan, exportProjectsExcel, updateProjectSubmission
} from '../controllers/hod.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('hod', 'admin'));

router.get('/dashboard', getHodDashboard);

// Faculty management
router.put('/faculty/:id/approve', approveFaculty);
router.put('/faculty/:id/reject', rejectFaculty);
router.get('/faculty/approved', getApprovedFacultyList);
router.get('/faculty/workload', getFacultyWorkload);

// Project management
router.put('/proposals/:id/approve', approveProposal);
router.put('/proposals/:id/reject', rejectProposal);
router.put('/proposals/:id/assign', assignFacultyToProposal);
router.get('/projects', getAllProjects);
router.get('/projects/export', exportProjectsExcel);
router.put('/projects/:id/submission', updateProjectSubmission);

// Student management
router.get('/students', getAllStudents);
router.post('/students/add', upload.single('profilePhoto'), addStudent);
router.put('/students/:id/ban', toggleStudentBan);

// Add faculty
router.post('/faculty/add', upload.single('profilePhoto'), addFaculty);

export default router;
