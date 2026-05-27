import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  getFacultyDashboard, acceptProposal, rejectProposal, addFeedback,
  updateProgress, assignDeadline, rejectFinalSubmission, addTimelineComment,
  rescheduleDeadline, reviewExtensionRequest, getMyStudents
} from '../controllers/faculty.controller.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('faculty', 'hod'));

router.get('/dashboard',                                     getFacultyDashboard);
router.get('/students',                                      getMyStudents);
router.put('/proposals/:id/accept',                          acceptProposal);
router.put('/proposals/:id/reject',                          rejectProposal);
router.post('/proposals/:id/feedback',                       addFeedback);
router.put('/proposals/:id/progress',                        updateProgress);
router.put('/proposals/:id/reject-submission',               rejectFinalSubmission);
router.post('/proposals/:proposalId/timeline/:entryId/comment', addTimelineComment);
router.post('/deadlines',                                    assignDeadline);
router.put('/deadlines/:id/reschedule',                      rescheduleDeadline);
router.put('/extensions/:id/review',                         reviewExtensionRequest);

export default router;
