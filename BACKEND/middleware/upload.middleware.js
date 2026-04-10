import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // ✅ Use the pre-configured instance

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'fyp/documents';
    const name = file.originalname.toLowerCase();
    const mime = file.mimetype.toLowerCase();

    const userId = req.user ? req.user._id : 'unregistered';

    if (file.fieldname === 'profilePhoto' || mime.includes('image')) {
      folder = `fyp/profiles/${userId}`;
    } else if (mime.includes('pdf') || name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.doc')) {
      folder = `fyp/documents/${userId}`;
    } else if (mime.includes('presentation') || name.endsWith('.ppt') || name.endsWith('.pptx')) {
      folder = `fyp/presentations/${userId}`;
    } else if (mime.includes('zip') || mime.includes('tar') || name.endsWith('.zip') || name.endsWith('.rar')) {
      folder = `fyp/code/${userId}`;
    } else {
      folder = `fyp/misc/${userId}`;
    }

    return {
      folder,
      public_id: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      resource_type: 'auto',
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});
