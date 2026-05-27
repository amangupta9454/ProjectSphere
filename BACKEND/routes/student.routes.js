import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  getStudentDashboard, submitProposal, updateProposal, uploadFile, getFiles,
  getAvailableFaculty, requestSupervisor, getProjectTargets, addProjectTarget,
  updateProjectTarget, submitFinalProject, updateStudentProfile,
  addTimelineEntry, addTimelineComment, getTimeline,
  requestDeadlineExtension, getMyExtensionRequests
} from '../controllers/student.controller.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('student'));

router.get('/dashboard',                                     getStudentDashboard);
router.put('/profile',       upload.single('resume'),        updateStudentProfile);
router.post('/proposal',                                     submitProposal);
router.put('/proposal',                                      updateProposal);
router.post('/files/upload', upload.array('files', 5),       uploadFile);
router.get('/files',                                         getFiles);

router.get('/faculty/available',                             getAvailableFaculty);
router.post('/faculty/request/:facultyId',                   requestSupervisor);

router.get('/targets',                                       getProjectTargets);
router.post('/targets',                                      addProjectTarget);
router.put('/targets/:targetId',                             updateProjectTarget);

router.post('/submit-final',                                 submitFinalProject);

// Timeline
router.get('/timeline',                                      getTimeline);
router.post('/timeline',                                     addTimelineEntry);
router.post('/timeline/:entryId/comment',                    addTimelineComment);

// Deadline Extension Requests
router.post('/extensions',   upload.single('document'),      requestDeadlineExtension);
router.get('/extensions',                                    getMyExtensionRequests);

export default router;
