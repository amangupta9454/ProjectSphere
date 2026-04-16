import { Announcement } from '../models/Announcement.model.js';

// GET /api/announcements — all authenticated users
export const getAnnouncements = async (req, res) => {
  try {
    const { audience } = req.query;
    let filter = {};

    // Students only see 'all' and 'student' targeted announcements
    if (req.user.role === 'student') {
      filter.targetAudience = { $in: ['all', 'student'] };
    }
    // Faculty only see 'all' and 'faculty'
    else if (req.user.role === 'faculty') {
      filter.targetAudience = { $in: ['all', 'faculty'] };
    }
    // Admin and HOD see everything
    if (audience && audience !== 'all') filter.targetAudience = audience;

    const announcements = await Announcement.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .limit(50);

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m getAnnouncements:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/announcements — admin, hod, faculty
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetAudience, pinned } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required.' });

    const pRole = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);
    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      targetAudience: targetAudience || 'all',
      pinned: pinned || false,
      createdBy: req.user._id,
      createdModel: pRole,
      createdByName: req.user.name,
      createdByRole: req.user.role,
    });

    console.log(`\x1b[32m[SUCCESS]\x1b[0m Announcement created by ${req.user.email}: "${title}"`);
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m createAnnouncement:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/announcements/:id — admin deletes any; others only their own
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    // Only admin or the original creator can delete
    if (req.user.role !== 'admin' && announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement.' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Announcement deleted by ${req.user.email}`);
    res.status(200).json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('\x1b[31m[ERROR]\x1b[0m deleteAnnouncement:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/announcements/:id/pin — admin or creator can toggle pin
export const togglePin = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    if (req.user.role !== 'admin' && announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    announcement.pinned = !announcement.pinned;
    await announcement.save();
    res.status(200).json({ message: `Announcement ${announcement.pinned ? 'pinned' : 'unpinned'}`, announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
