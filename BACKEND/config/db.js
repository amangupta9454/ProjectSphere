import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Compatibility options are no longer strictly required in Mongoose 6+, but we'll ensure simple connect
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // DO NOT process.exit(1) on Vercel/Serverless as it kills the instance
  }
};
