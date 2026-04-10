import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getFacultyDashboard, acceptProposal, rejectProposal, addFeedback, updateProgress, assignDeadline } from '../controllers/faculty.controller.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('faculty', 'hod'));

router.get('/dashboard', getFacultyDashboard);
router.put('/proposals/:id/accept', acceptProposal);
router.put('/proposals/:id/reject', rejectProposal);
router.post('/proposals/:id/feedback', addFeedback);
router.put('/proposals/:id/progress', updateProgress);
router.post('/deadlines', assignDeadline);

export default router;
