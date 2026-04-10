import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://projectsphere-ai.netlify.app' // Hardcoding exactly the domain from your error
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // As a fallback for development/testing, you can return true
    callback(null, true); 
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request logger (skip on Vercel production for cleaner logs) ──
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const color = res.statusCode >= 500 ? '\x1b[31m' : res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
      console.log(`${color}[${res.statusCode}]\x1b[0m ${req.method} ${req.originalUrl} — ${ms}ms`);
    });
    next();
  });
}

// ── Database ─────────────────────────────────────────────────
// connectDB is safe to call multiple times — Mongoose caches the connection
connectDB();

// ── Routes ───────────────────────────────────────────────────
import authRoutes             from './routes/auth.routes.js';
import studentRoutes          from './routes/student.routes.js';
import facultyRoutes          from './routes/faculty.routes.js';
import hodRoutes              from './routes/hod.routes.js';
import adminRoutes            from './routes/admin.routes.js';
import deadlineRoutes         from './routes/deadline.routes.js';
import notificationRoutes     from './routes/notification.routes.js';
import announcementRoutes     from './routes/announcement.routes.js';

app.use('/api/auth',          authRoutes);
app.use('/api/student',       studentRoutes);
app.use('/api/faculty',       facultyRoutes);
app.use('/api/hod',           hodRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/deadlines',     deadlineRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ProjectSphere API running ✅', env: process.env.NODE_ENV }));

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Start server locally (Vercel handles this in production) ───
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\x1b[32m[SERVER]\x1b[0m Running → http://localhost:${PORT}`);
    console.log('\x1b[36m[ROUTES]\x1b[0m /api/auth | /api/student | /api/faculty | /api/hod | /api/admin | /api/deadlines | /api/notifications | /api/announcements');
  });
}

// ── Export for Vercel serverless ──────────────────────────────
export default app;
