import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Hod } from '../BACKEND/models/Hod.model.js';
import { Faculty } from '../BACKEND/models/Faculty.model.js';

dotenv.config({ path: '../BACKEND/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const h = await Hod.findOne({ email: 'hod.cs@hietgroup.org' });
  console.log("Found HOD:", h.email, h.department);

  const req = { user: h };
  const unapprovedFaculty = await Faculty.find({ isApproved: false, isEmailVerified: true, department: req.user.department });
  console.log("Unapproved Faculty:", unapprovedFaculty.length);
  
  process.exit(0);
}

run();
