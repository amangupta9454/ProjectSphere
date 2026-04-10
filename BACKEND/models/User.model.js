import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'hod', 'admin'],
      required: true,
    },
    profilePhoto: {
      url: String,
      publicId: String,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false, // Default to false for faculty; true for others or manually set
    },
    otpHash: String,
    otpExpiry: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
  },
  { timestamps: true, discriminatorKey: 'role' }
);

export const User = mongoose.model('User', userSchema);

// Discriminators (Student)
export const Student = User.discriminator(
  'student',
  new mongoose.Schema({
    course: {
      type: String,
      enum: ['B.E.', 'B.Tech', 'M.Tech', 'BCA', 'MCA'],
      required: true,
    },
    branch: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'ME', 'CE'],
      required: true,
    },
    year: {
      type: String,
      enum: ['1', '2', '3', '4'],
      default: '4',
    },
    section: {
      type: String,
      enum: ['A', 'B', 'C'],
      default: 'A',
    },
    enrollmentNumber: String,
    isBanned: { type: Boolean, default: false },
    banReason: String,
    githubId: String,
    linkedinId: String,
    portfolioLink: String,
    resume: {
      url: String,
      publicId: String,
    },
  })
);

// Discriminators (Faculty)
export const Faculty = User.discriminator(
  'faculty',
  new mongoose.Schema({
    department: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'ME', 'CE', 'MBA', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical'],
      required: true,
    },
    designation: String,
    employeeId: String,
    rejectionReason: String,
    specialization: String,
    maxStudents: { type: Number, default: 5 },
  })
);

// Hod and Admin discriminator can just use the base schema or have their own
export const Hod = User.discriminator('hod', new mongoose.Schema({}));
export const Admin = User.discriminator('admin', new mongoose.Schema({}));
