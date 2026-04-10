import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { createDeadline, getAllDeadlines, deleteDeadline, getDeadlinesForUser } from '../controllers/deadline.controller.js';

const router = express.Router();
router.use(protect);

// HOD-only
router.post('/', authorizeRoles('hod', 'admin'), createDeadline);
router.get('/', authorizeRoles('hod', 'admin'), getAllDeadlines);
router.delete('/:id', authorizeRoles('hod', 'admin'), deleteDeadline);

// All authenticated users
router.get('/my', getDeadlinesForUser);

export default router;
