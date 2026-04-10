import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure env vars are loaded before configuring (works even if called before index.js dotenv)
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Startup validation
const { cloud_name, api_key } = cloudinary.config();
if (!api_key || !cloud_name) {
  console.error('\x1b[31m[CLOUDINARY ERROR]\x1b[0m Missing CLOUDINARY_API_KEY or CLOUDINARY_CLOUD_NAME in .env');
} else {
  console.log(`\x1b[32m[CLOUDINARY]\x1b[0m Configured for cloud: "${cloud_name}"`);
}

export default cloudinary;
