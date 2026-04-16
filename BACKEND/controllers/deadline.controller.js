import { Deadline } from '../models/Deadline.model.js';
import { Notification } from '../models/Notification.model.js';
import { Student } from '../models/Student.model.js';
import { Faculty } from '../models/Faculty.model.js';

// Helper: create notifications for all users of given roles
const notifyUsers = async (roles, message, type = 'deadline') => {
  let notifications = [];
  if (roles.includes('all') || roles.includes('student')) {
      const students = await Student.find({}).select('_id');
      notifications.push(...students.map(u => ({ userId: u._id, userModel: 'Student', message, type })));
  }
  if (roles.includes('all') || roles.includes('faculty')) {
      const faculty = await Faculty.find({}).select('_id');
      notifications.push(...faculty.map(u => ({ userId: u._id, userModel: 'Faculty', message, type })));
  }
  if (notifications.length > 0) {
      await Notification.insertMany(notifications);
  }
};

export const createDeadline = async (req, res) => {
  console.log('\x1b[36m[HOD]\x1b[0m POST /api/hod/deadlines →', req.body?.title);
  try {
    const { title, description, dueDate, targetRoles } = req.body;
    const pRole = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);
    
    const deadline = await Deadline.create({
      title, description, dueDate,
      targetRoles: targetRoles || ['all'],
      createdBy: req.user._id,
      createdModel: pRole,
    });

    // Notify all target users
    const label = targetRoles?.includes('all') ? ['student', 'faculty'] : (targetRoles || ['student', 'faculty']);
    await notifyUsers(label, `New deadline: "${title}" — Due ${new Date(dueDate).toLocaleDateString()}`, 'deadline');

    console.log('\x1b[32m[SUCCESS]\x1b[0m Deadline created:', title, '| Due:', dueDate);
    res.status(201).json({ message: 'Deadline created and notifications sent', deadline });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m createDeadline:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllDeadlines = async (req, res) => {
  try {
    const deadlines = await Deadline.find({ isActive: true }).sort({ dueDate: 1 }).populate('createdBy', 'name');
    res.status(200).json(deadlines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeadline = async (req, res) => {
  try {
    await Deadline.findByIdAndDelete(req.params.id);
    console.log('\x1b[33m[INFO]\x1b[0m Deadline deleted:', req.params.id);
    res.status(200).json({ message: 'Deadline removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeadlinesForUser = async (req, res) => {
  try {
    const role = req.user.role;
    const deadlines = await Deadline.find({
      isActive: true,
      $or: [{ targetRoles: 'all' }, { targetRoles: role }]
    }).sort({ dueDate: 1 });
    res.status(200).json(deadlines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
