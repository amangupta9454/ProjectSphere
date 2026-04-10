<div align="center">

<br/>

<img src="https://img.shields.io/badge/ProjectSphere-v1.0.0-06b6d4?style=for-the-badge&logo=react&logoColor=white" alt="Version" />
&nbsp;
<img src="https://img.shields.io/badge/MERN-Stack-10b981?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN" />
&nbsp;
<img src="https://img.shields.io/badge/Status-Production%20Ready-6366f1?style=for-the-badge" alt="Status" />
&nbsp;
<img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" alt="License" />

<br/><br/>

<h1>🌐 ProjectSphere</h1>
<h3><i>AI-Powered Final Year Project & Research Management System</i></h3>

<p>
  A centralized, role-based academic portal that digitalizes the complete lifecycle of final year projects —<br/>
  from proposal submission to final delivery — for Students, Faculty, HOD, and Administrators.
</p>

<br/>

<a href="#-what-is-projectsphere"><b>📖 Overview</b></a> &nbsp;|&nbsp;
<a href="#-tech-stack"><b>💻 Tech Stack</b></a> &nbsp;|&nbsp;
<a href="#-features-by-module"><b>✨ Features</b></a> &nbsp;|&nbsp;
<a href="#-how-to-run-locally"><b>⚙️ Setup</b></a> &nbsp;|&nbsp;
<a href="#-api-routes-summary"><b>🌐 API Routes</b></a> &nbsp;|&nbsp;
<a href="#-deployment"><b>🚀 Deploy</b></a>

<br/><br/>

---

</div>

<h2>🔎 What is ProjectSphere</h2>

<p>
<b>ProjectSphere</b> is a <b>full-stack, AI-assisted academic project management system</b> built for engineering colleges and universities to streamline the entire final year project (FYP) process — which, in most institutions, is still managed through paper forms, spreadsheets, and informal communication.
</p>

<p>
The platform replaces fragmented, error-prone manual workflows with a structured, digital pipeline that gives every stakeholder — students, faculty supervisors, the Head of Department, and system administrators — a dedicated, role-specific interface and a single source of truth for all project-related data.
</p>

<p><b>Key capabilities include:</b></p>

<ul>
  <li>📋 End-to-end <b>proposal lifecycle management</b> (submit → review → approve → assign → complete)</li>
  <li>👨‍🏫 <b>Supervisor assignment</b> by HOD and <b>student-initiated requests</b> directly to preferred faculty</li>
  <li>📁 <b>Cloud file uploads</b> (documents, code, presentations, research papers) with versioning via Cloudinary</li>
  <li>📊 <b>Analytics dashboards</b> tailored to each role with Recharts visualizations</li>
  <li>🔔 <b>Real-time notification system</b> for every state change in the workflow</li>
  <li>📢 <b>Cross-role announcements</b> so Admin, HOD, and Faculty can communicate to the entire institution</li>
  <li>🔐 <b>Secure authentication</b> with JWT access tokens, OTP-based email verification, and role-based route guards</li>
  <li>🎯 <b>Project milestones & target tracking</b>, with progress controlled by the supervising faculty</li>
  <li>📤 <b>Final submission portal</b> linking live demo, GitHub, and LinkedIn for the completed project</li>
  <li>📥 <b>Excel export</b> for HOD and Admin to download complete project datasets</li>
</ul>

<p>
ProjectSphere is not just a management tool — it is a <b>transparent, accountable, and professional-grade academic ecosystem</b> designed to elevate the quality of final year research and project delivery.
</p>

<br/>

<h2>👩‍🎓 Who It's For</h2>

<p>
ProjectSphere is designed for <b>four distinct user roles</b>, each with a completely isolated dashboard, permissions set, and workflow.
</p>

<br/>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Role</th>
      <th>Who They Are</th>
      <th>Core Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>🎓 Student</b></td>
      <td>Final year undergraduate or postgraduate students working on a project</td>
      <td>Submit proposals, track approval status, collaborate with supervisors, upload deliverables, and submit the final project — all in one place</td>
    </tr>
    <tr>
      <td><b>👨‍🏫 Faculty</b></td>
      <td>Academic faculty members who supervise student projects</td>
      <td>Accept/reject supervisor assignments, add feedback and progress updates, assign targeted deadlines, and manage all supervised projects from a single dashboard</td>
    </tr>
    <tr>
      <td><b>🏢 HOD</b></td>
      <td>Head of Department responsible for institutional project oversight</td>
      <td>Review and approve proposals, assign faculty, monitor all project statuses, manage faculty accounts, view analytics, and export institutional data</td>
    </tr>
    <tr>
      <td><b>🛡️ Admin</b></td>
      <td>System administrator with platform-wide access</td>
      <td>Full visibility across all users, projects, and files. Manage platform health, create announcements, access login credentials, and control user accounts</td>
    </tr>
  </tbody>
</table>

<br/>

<h2>⚕️ What Problems It Solves</h2>

<p>
In most academic institutions, final year project management suffers from several real-world issues — all of which <b>ProjectSphere</b> directly addresses:
</p>

<br/>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Problem</th>
      <th>How ProjectSphere Solves It</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <b>📝 Manual paper-based approvals</b><br/>
        <i>Proposals submitted via email or paper forms get lost, delayed, or misrouted</i>
      </td>
      <td>
        Digital proposal submission with a structured multi-stage approval pipeline (Student → HOD → Faculty). Every action is logged with timestamps and automated notifications.
      </td>
    </tr>
    <tr>
      <td>
        <b>📭 Communication gaps</b><br/>
        <i>Students don't know the status of their proposals; faculty lack a centralized feedback system</i>
      </td>
      <td>
        In-app notification inbox for every event — approvals, rejections, assignments, feedback, and deadline alerts. Cross-role announcements from Admin, HOD, and Faculty ensure clear communication.
      </td>
    </tr>
    <tr>
      <td>
        <b>📁 Unorganized file submissions</b><br/>
        <i>Students send files via email without version control or structured storage</i>
      </td>
      <td>
        Cloud-based file management system with categorized uploads (documents, code, presentations, research papers) and automatic version tracking.
      </td>
    </tr>
    <tr>
      <td>
        <b>🔍 Lack of transparency for HOD</b><br/>
        <i>No unified view of project progress, faculty workload, or pending approvals</i>
      </td>
      <td>
        A centralized HOD dashboard with real-time analytics, including branch-wise distribution, project status tracking, faculty workload insights, and downloadable reports.
      </td>
    </tr>
    <tr>
      <td>
        <b>🔒 No role-based access control</b><br/>
        <i>Unrestricted or poorly managed access across users</i>
      </td>
      <td>
        Secure authentication using JWT and strict role-based access control. Each user role has limited and protected access to only relevant data and features.
      </td>
    </tr>
    <tr>
      <td>
        <b>📊 Lack of institutional analytics</b><br/>
        <i>No data-driven insights into project performance and progress</i>
      </td>
      <td>
        Interactive dashboards with visual charts (PieCharts, BarCharts) displaying project status, domain distribution, faculty workload, and milestone completion rates.
      </td>
    </tr>
    <tr>
      <td>
        <b>🧑‍💼 Faculty overloading</b><br/>
        <i>Uneven distribution of projects among faculty members</i>
      </td>
      <td>
        Faculty workload monitoring with configurable limits and real-time project counts, ensuring balanced distribution during assignment by HOD/Admin.
      </td>
    </tr>
  </tbody>
</table>

<br/>
<h2>✨ Features by Module</h2>

<h3>🎓 Student Features</h3>

<p>
Students get a <b>7-tab dashboard</b> covering every stage of their project journey:
</p>

<ul>
  <li>
    <b>Proposal Submission</b> — Submit project proposals with title, description (100–1000 chars), domain, team size, team member details, and reference links. Re-submission is allowed after rejection.
  </li>
  <li>
    <b>Milestone Tracking</b> — Add project targets and mark them as <b>Pending</b>, <b>Ongoing</b>, or <b>Completed</b>. Progress is visualized using charts.
  </li>
  <li>
    <b>Supervisor Request</b> — Browse approved faculty and send supervision requests directly.
  </li>
  <li>
    <b>File Uploads</b> — Upload deliverables such as documents, code, presentations, and research papers with version tracking.
  </li>
  <li>
    <b>Final Submission</b> — Submit live demo, GitHub repository, and LinkedIn links once the project is approved.
  </li>
  <li>
    <b>Announcements</b> — View all important platform announcements from Admin, HOD, and Faculty.
  </li>
  <li>
    <b>Profile Management</b> — Update GitHub, LinkedIn, portfolio, and upload resume (PDF).
  </li>
</ul>

<br/>

<h3>👨‍🏫 Faculty Features</h3>

<p>
Faculty members have access to a <b>4-tab dashboard</b> for managing supervised projects:
</p>

<ul>
  <li>
    <b>Active Projects Overview</b> — View all assigned projects with student details and progress.
  </li>
  <li>
    <b>Pending Review</b> — Accept or reject supervisor requests with proper reasoning.
  </li>
  <li>
    <b>Feedback System</b> — Provide structured feedback with timestamps and notifications.
  </li>
  <li>
    <b>Progress Control</b> — Set project completion percentage (0–100%).
  </li>
  <li>
    <b>Targeted Deadlines</b> — Assign deadlines for specific projects.
  </li>
  <li>
    <b>Announcements</b> — Create and manage announcements for students and faculty.
  </li>
</ul>

<br/>

<h3>🏢 HOD Features</h3>

<p>
The HOD panel acts as a <b>central institutional management system</b>:
</p>

<ul>
  <li>
    <b>Proposal Review Queue</b> — Approve or reject proposals with mandatory feedback.
  </li>
  <li>
    <b>Faculty Approval</b> — Approve/reject faculty registrations or create accounts manually.
  </li>
  <li>
    <b>Faculty Assignment</b> — Assign faculty to approved student projects.
  </li>
  <li>
    <b>Student Management</b> — Filter students by branch/year/section and manage access.
  </li>
  <li>
    <b>Faculty Workload View</b> — Monitor active projects handled by each faculty.
  </li>
  <li>
    <b>Activity Log</b> — View recent project updates across the institution.
  </li>
  <li>
    <b>Final Submission Review</b> — Approve or reject completed project submissions.
  </li>
  <li>
    <b>Excel Export</b> — Download full project reports in Excel format.
  </li>
  <li>
    <b>Analytics Dashboard</b> — Visual insights including project status, domains, and distribution.
  </li>
  <li>
    <b>Announcements</b> — Manage institutional announcements.
  </li>
</ul>

<br/>

<h3>🛡️ Admin Features</h3>

<p>
The Admin panel is a <b>complete system control center</b>:
</p>

<ul>
  <li>
    <b>Overview Dashboard</b> — View system-wide stats, charts, and project analytics.
  </li>
  <li>
    <b>Announcements</b> — Create, pin, and delete announcements across all roles.
  </li>
  <li>
    <b>Students Panel</b> — Manage all students with filters and detailed project/file views.
  </li>
  <li>
    <b>Faculty Panel</b> — View faculty details, capacity, and supervised projects.
  </li>
  <li>
    <b>Projects Panel</b> — Access all projects with filters, team details, milestones, and submissions.
  </li>
  <li>
    <b>System Panel</b> — Manage users, monitor activity logs, and track uploaded files.
  </li>
</ul>

<br/>

<h2>📂 Project Structure</h2>

```bash
FINAL-YEAR/
│
├── 📁 FRONTEND/                          # React + Vite client application
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── Navbar.jsx                # Responsive top navigation bar
│   │   │   ├── Footer.jsx                # Dark-themed site footer
│   │   │   └── Sidebar.jsx               # Collapsible role-aware sidebar
│   │   │
│   │   ├── layouts/
│   │   │   └── PublicLayout.jsx          # Shared layout wrapper for public pages
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                  # Landing page with animations
│   │   │   ├── About.jsx                 # About/mission page
│   │   │   ├── Contact.jsx               # Contact form
│   │   │   ├── Login.jsx                 # Split-screen login + forgot password OTP flow
│   │   │   ├── StudentRegister.jsx       # Student registration with profile fields
│   │   │   ├── FacultyRegister.jsx       # Faculty registration
│   │   │   ├── VerifyOTP.jsx             # Email OTP verification page
│   │   │   ├── StudentDashboard.jsx      # 7-tab student workspace
│   │   │   ├── FacultyDashboard.jsx      # Faculty supervision dashboard
│   │   │   ├── HodDashboard.jsx          # HOD management center
│   │   │   └── AdminDashboard.jsx        # Admin command center (6 sections)
│   │   │
│   │   ├── App.jsx                       # Root router + conditional footer logic
│   │   └── main.jsx                      # Vite entry point
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── 📁 BACKEND/                           # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js                         # MongoDB Atlas connection
│   │   ├── cloudinary.js                 # Cloudinary SDK setup
│   │   └── nodemailer.js                 # Email transporter (Gmail SMTP)
│   │
│   ├── controllers/
│   │   ├── auth.controller.js            # Register, login, OTP verify, password reset
│   │   ├── student.controller.js         # Proposals, file uploads, targets, final submission
│   │   ├── faculty.controller.js         # Accept/reject, feedback, progress, deadlines
│   │   ├── hod.controller.js             # Faculty & proposal management, Excel export
│   │   ├── admin.controller.js           # Stats, full user/project/file access, system
│   │   ├── announcement.controller.js    # Shared cross-role announcement CRUD
│   │   ├── deadline.controller.js        # Global deadline management
│   │   └── notification.controller.js    # Notification read/fetch
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js            # JWT verify + role authorization guards
│   │   └── upload.middleware.js          # Multer + Cloudinary storage config
│   │
│   ├── models/
│   │   ├── User.model.js                 # Base user schema + Student/Faculty/HOD/Admin discriminators
│   │   ├── Proposal.model.js             # Project proposal with targets, feedback, submission
│   │   ├── File.model.js                 # File submission records with versioning
│   │   ├── Deadline.model.js             # Deadline model with role/project targeting
│   │   ├── Notification.model.js         # Per-user notification records
│   │   └── Announcement.model.js         # Cross-role platform announcements
│   │
│   ├── routes/
│   │   ├── auth.routes.js                # /api/auth/*
│   │   ├── student.routes.js             # /api/student/*
│   │   ├── faculty.routes.js             # /api/faculty/*
│   │   ├── hod.routes.js                 # /api/hod/*
│   │   ├── admin.routes.js               # /api/admin/*
│   │   ├── announcement.routes.js        # /api/announcements/*
│   │   ├── deadline.routes.js            # /api/deadlines/*
│   │   └── notification.routes.js        # /api/notifications/*
│   │
│   ├── utils/
│   │   └── otp.util.js                   # Secure 6-digit OTP generator
│   │
│   ├── seed.js                           # Database seeder for admin account
│   ├── index.js                          # Express server entry point
│   └── package.json
│
└── README.md
```

<br/>

<h2>💻 Tech Stack</h2>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Frontend Framework</b></td>
      <td><code>React 19</code> + <code>Vite</code></td>
      <td>Component-based user interface with fast development and hot module replacement</td>
    </tr>
    <tr>
      <td><b>Styling</b></td>
      <td><code>TailwindCSS</code></td>
      <td>Utility-first CSS framework for responsive and modern UI design</td>
    </tr>
    <tr>
      <td><b>Animations</b></td>
      <td><code>Framer Motion</code></td>
      <td>Smooth animations, transitions, and interactive UI effects</td>
    </tr>
    <tr>
      <td><b>Charts</b></td>
      <td><code>Recharts</code></td>
      <td>Data visualization using PieCharts and BarCharts</td>
    </tr>
    <tr>
      <td><b>Icons</b></td>
      <td><code>lucide-react</code> + <code>react-icons</code></td>
      <td>Scalable and consistent icon libraries for UI components</td>
    </tr>
    <tr>
      <td><b>HTTP Client</b></td>
      <td><code>axios</code></td>
      <td>Handles API requests with support for interceptors and token injection</td>
    </tr>
    <tr>
      <td><b>Notifications</b></td>
      <td><code>react-hot-toast</code></td>
      <td>Displays success and error messages for user actions</td>
    </tr>
    <tr>
      <td><b>Routing</b></td>
      <td><code>react-router-dom</code></td>
      <td>Client-side routing with protected routes for role-based access</td>
    </tr>
    <tr>
      <td><b>Backend Framework</b></td>
      <td><code>Node.js</code> + <code>Express.js</code></td>
      <td>Builds RESTful APIs and handles server-side logic</td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td><code>MongoDB Atlas</code> + <code>Mongoose</code></td>
      <td>Cloud-based NoSQL database with schema modeling</td>
    </tr>
    <tr>
      <td><b>Authentication</b></td>
      <td><code>jsonwebtoken</code> + <code>bcrypt</code></td>
      <td>Secure authentication using tokens and encrypted passwords</td>
    </tr>
    <tr>
      <td><b>File Storage</b></td>
      <td><code>Cloudinary</code> + <code>Multer</code></td>
      <td>Upload and manage files in cloud storage with URL access</td>
    </tr>
    <tr>
      <td><b>Email Service</b></td>
      <td><code>Nodemailer</code></td>
      <td>Sends OTP emails for verification and password reset</td>
    </tr>
    <tr>
      <td><b>Excel Export</b></td>
      <td><code>ExcelJS</code></td>
      <td>Generate downloadable Excel reports</td>
    </tr>
    <tr>
      <td><b>Environment Config</b></td>
      <td><code>dotenv</code></td>
      <td>Manages environment variables securely</td>
    </tr>
    <tr>
      <td><b>CORS</b></td>
      <td><code>cors</code></td>
      <td>Handles cross-origin requests between frontend and backend</td>
    </tr>
  </tbody>
</table>

<br/>
<h2>⚙️ How to Run Locally</h2>

<h3>Prerequisites</h3>

<p>Before you begin, make sure you have the following installed:</p>

<ul>
  <li><code>Node.js</code> v18 or higher</li>
  <li><code>npm</code> v9 or higher</li>
  <li>A <code>MongoDB Atlas</code> cluster</li>
  <li>A <code>Cloudinary</code> account</li>
  <li>A <code>Gmail</code> account with App Password enabled</li>
</ul>

<br/>

<h3>Step 1 — Clone the Repository</h3>

<pre><code>
git clone https://github.com/your-username/projectsphere.git
cd projectsphere
</code></pre>

<br/>

<h3>Step 2 — Setup the Backend</h3>

<pre><code>
# Navigate to backend folder
cd BACKEND

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Seed admin account
node seed.js

# Start backend server
npm run dev
</code></pre>

<p>The backend server will run at <code>http://localhost:5000</code></p>

<br/>

<h3>Step 3 — Setup the Frontend</h3>

<pre><code>
# Navigate to frontend folder
cd FRONTEND

# Install dependencies
npm install

# Start frontend server
npm run dev
</code></pre>

<p>The frontend will be available at <code>http://localhost:5173</code></p>

<br/>

<h3>Step 4 — Proxy Configuration</h3>

<p>Ensure your <code>vite.config.js</code> includes:</p>

<pre><code>
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
</code></pre>

<br/>

<hr/>

<h2>🔑 Environment Variables</h2>

<p>Create a <code>.env</code> file inside the <code>BACKEND/</code> directory:</p>

<pre><code>
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

ADMIN_EMAIL=admin@projectsphere.com
ADMIN_PASSWORD=Admin@1234
</code></pre>

<br/>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>PORT</code></td>
      <td>Backend server port</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>MONGO_URI</code></td>
      <td>MongoDB connection string</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>JWT_SECRET</code></td>
      <td>Secret key for authentication tokens</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>JWT_REFRESH_SECRET</code></td>
      <td>Secret for refresh tokens</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>CLOUDINARY_CLOUD_NAME</code></td>
      <td>Cloudinary account name</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>CLOUDINARY_API_KEY</code></td>
      <td>Cloudinary API key</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>CLOUDINARY_API_SECRET</code></td>
      <td>Cloudinary secret key</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>EMAIL_USER</code></td>
      <td>Email used for sending OTP</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>EMAIL_PASS</code></td>
      <td>Email app password</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><code>ADMIN_EMAIL</code></td>
      <td>Admin login email (for seeding)</td>
      <td>Optional</td>
    </tr>
    <tr>
      <td><code>ADMIN_PASSWORD</code></td>
      <td>Admin login password</td>
      <td>Optional</td>
    </tr>
  </tbody>
</table>

<br/>
<h2>🌐 API Routes Summary</h2>

<p>
All routes are prefixed with <code>/api</code>. Protected routes require a 
<code>Bearer &lt;token&gt;</code> in the Authorization header.
</p>

<br/>

<h3>🔐 Auth Routes — /api/auth</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>POST</code></td><td><code>/register/student</code></td><td>Register a new student</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/register/faculty</code></td><td>Register a new faculty</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/verify-otp</code></td><td>Verify email OTP</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/login</code></td><td>User login</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/forgot-password</code></td><td>Send reset OTP</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/verify-reset-otp</code></td><td>Verify reset OTP</td><td>Public</td></tr>
    <tr><td><code>POST</code></td><td><code>/reset-password</code></td><td>Reset password</td><td>Public</td></tr>
  </tbody>
</table>

<br/>

<h3>🎓 Student Routes — /api/student</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>GET</td><td>/dashboard</td><td>Get student dashboard data</td><td>Student</td></tr>
    <tr><td>POST</td><td>/proposal</td><td>Submit project proposal</td><td>Student</td></tr>
    <tr><td>PUT</td><td>/proposal</td><td>Update proposal</td><td>Student</td></tr>
    <tr><td>GET</td><td>/faculty</td><td>List faculty</td><td>Student</td></tr>
    <tr><td>POST</td><td>/supervisor/:id</td><td>Request supervisor</td><td>Student</td></tr>
    <tr><td>POST</td><td>/upload</td><td>Upload files</td><td>Student</td></tr>
    <tr><td>GET</td><td>/files</td><td>Get files</td><td>Student</td></tr>
    <tr><td>GET</td><td>/targets</td><td>Get milestones</td><td>Student</td></tr>
    <tr><td>POST</td><td>/targets</td><td>Add milestone</td><td>Student</td></tr>
    <tr><td>PUT</td><td>/targets/:id</td><td>Update milestone</td><td>Student</td></tr>
    <tr><td>POST</td><td>/submit-final</td><td>Submit final project</td><td>Student</td></tr>
    <tr><td>PUT</td><td>/profile</td><td>Update profile</td><td>Student</td></tr>
  </tbody>
</table>

<br/>

<h3>👨‍🏫 Faculty Routes — /api/faculty</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>GET</td><td>/dashboard</td><td>Faculty dashboard</td><td>Faculty</td></tr>
    <tr><td>PUT</td><td>/proposals/:id/accept</td><td>Accept project</td><td>Faculty</td></tr>
    <tr><td>PUT</td><td>/proposals/:id/reject</td><td>Reject project</td><td>Faculty</td></tr>
    <tr><td>POST</td><td>/proposals/:id/feedback</td><td>Add feedback</td><td>Faculty</td></tr>
    <tr><td>PUT</td><td>/proposals/:id/progress</td><td>Update progress</td><td>Faculty</td></tr>
    <tr><td>POST</td><td>/deadlines</td><td>Set deadlines</td><td>Faculty</td></tr>
  </tbody>
</table>

<br/>

<h3>🏢 HOD Routes — /api/hod</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>GET</td><td>/dashboard</td><td>HOD dashboard</td><td>HOD</td></tr>
    <tr><td>GET</td><td>/projects</td><td>All projects</td><td>HOD</td></tr>
    <tr><td>GET</td><td>/students</td><td>All students</td><td>HOD</td></tr>
    <tr><td>GET</td><td>/faculty/approved</td><td>Approved faculty</td><td>HOD</td></tr>
    <tr><td>PUT</td><td>/faculty/:id/approve</td><td>Approve faculty</td><td>HOD</td></tr>
    <tr><td>PUT</td><td>/proposals/:id/approve</td><td>Approve proposal</td><td>HOD</td></tr>
    <tr><td>PUT</td><td>/proposals/:id/assign-faculty</td><td>Assign faculty</td><td>HOD</td></tr>
    <tr><td>GET</td><td>/export/projects</td><td>Export data</td><td>HOD</td></tr>
  </tbody>
</table>

<br/>

<h3>🛡️ Admin Routes — /api/admin</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
      <th>Auth</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>GET</td><td>/stats</td><td>System stats</td><td>Admin</td></tr>
    <tr><td>GET</td><td>/students</td><td>All students</td><td>Admin</td></tr>
    <tr><td>GET</td><td>/faculty</td><td>All faculty</td><td>Admin</td></tr>
    <tr><td>GET</td><td>/projects/full</td><td>All projects</td><td>Admin</td></tr>
    <tr><td>DELETE</td><td>/users/:id</td><td>Delete user</td><td>Admin</td></tr>
  </tbody>
</table>

<br/>

<h2>👥 User Roles and Permissions</h2>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Action</th>
      <th>Student</th>
      <th>Faculty</th>
      <th>HOD</th>
      <th>Admin</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Submit proposal</td><td>Yes</td><td>No</td><td>No</td><td>No</td></tr>
    <tr><td>Upload files</td><td>Yes</td><td>No</td><td>No</td><td>No</td></tr>
    <tr><td>Submit final project</td><td>Yes</td><td>No</td><td>No</td><td>No</td></tr>
    <tr><td>Accept/reject project</td><td>No</td><td>Yes</td><td>No</td><td>No</td></tr>
    <tr><td>Give feedback</td><td>No</td><td>Yes</td><td>No</td><td>No</td></tr>
    <tr><td>Approve proposals</td><td>No</td><td>No</td><td>Yes</td><td>No</td></tr>
    <tr><td>Manage users</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
  </tbody>
</table>

<br/>
<h2>🧠 How Each Major Feature Works</h2>

<h3>🔐 Authentication — JWT + OTP</h3>

<p>The authentication system follows a secure multi-step flow:</p>

<ol>
  <li>
    <b>Registration</b> — User submits details. Backend generates a 6-digit OTP, hashes it using <code>bcrypt</code>, stores it with expiry, and sends it via email.
  </li>
  <li>
    <b>Email Verification</b> — User enters OTP. Backend verifies it and marks the account as verified.
  </li>
  <li>
    <b>Login</b> — Credentials are validated, and a JWT access token along with a refresh token is issued.
  </li>
  <li>
    <b>Password Reset</b> — OTP-based flow to securely reset the password.
  </li>
</ol>

<br/>

<h3>📁 File Uploads — Multer + Cloudinary</h3>

<p>File uploads are handled through a cloud-based pipeline:</p>

<ol>
  <li><code>multer</code> processes the file upload request.</li>
  <li>The file is uploaded to Cloudinary storage.</li>
  <li>File metadata (URL, type, version) is stored in the database.</li>
  <li>Authorized users can access files via generated URLs.</li>
</ol>

<br/>

<h3>📋 Proposal Approval Flow</h3>

<pre><code>
Student submits proposal
↓
Pending HOD Review
↓
HOD approves/rejects
↓
Faculty assigned
↓
Faculty accepts/rejects
↓
Student updates project
↓
Final submission
↓
HOD reviews → Accepted / Rejected
</code></pre>

<p>
Each stage updates the project status and triggers notifications. Rejected proposals can be edited and resubmitted.
</p>

<br/>

<h3>🔔 Notification System</h3>

<p>
Notifications are stored in the database and triggered on key events:
</p>

<ul>
  <li>Proposal approval or rejection</li>
  <li>Faculty assignment</li>
  <li>Feedback updates</li>
  <li>Progress updates</li>
  <li>Final submission status changes</li>
</ul>

<p>
Each user sees unread notifications in their dashboard with real-time updates and badge indicators.
</p>

<br/>

<h3>📢 Announcements System</h3>

<p>
The announcement system allows communication across roles:
</p>

<ul>
  <li>Admin, HOD, and Faculty can create announcements</li>
  <li>Announcements are filtered based on user roles</li>
  <li>Pinned announcements appear at the top</li>
  <li>Sorted by priority and recency</li>
</ul>

<br/>
<h2>🚀 Deployment</h2>

<h3>Frontend — Vercel (Recommended)</h3>

<pre><code>
# Build the production bundle
cd FRONTEND
npm run build

# Deploy to Vercel
npx vercel --prod
</code></pre>

<p>
Set the environment variable <code>VITE_API_BASE_URL</code> in Vercel if frontend and backend are hosted separately.
</p>

<br/>

<h3>Backend — Render</h3>

<ol>
  <li>Push backend code to GitHub</li>
  <li>Create a new Web Service on render.com</li>
  <li>Set Root Directory to <code>BACKEND/</code></li>
  <li>Build Command: <code>npm install</code></li>
  <li>Start Command: <code>node index.js</code></li>
  <li>Add environment variables in Render dashboard</li>
</ol>

<p>
Note: Free tier may go inactive. Use uptime monitoring if needed.
</p>

<br/>

<h3>Database — MongoDB Atlas</h3>

<ol>
  <li>Create a cluster on mongodb.com/atlas</li>
  <li>Create a database user</li>
  <li>Allow network access (IP whitelist)</li>
  <li>Add connection string as <code>MONGO_URI</code></li>
</ol>

<br/>

<h3>File Storage — Cloudinary</h3>

<ol>
  <li>Create an account on cloudinary.com</li>
  <li>Get Cloud Name, API Key, and API Secret</li>
  <li>Add them to environment variables</li>
</ol>

<br/>
<h2>📦 Package Dependencies</h2>

<h3>Frontend (FRONTEND/package.json)</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Package</th>
      <th>Version</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>react</code></td><td>^19.0.0</td><td>Core UI library</td></tr>
    <tr><td><code>react-dom</code></td><td>^19.0.0</td><td>DOM rendering</td></tr>
    <tr><td><code>react-router-dom</code></td><td>^6.x</td><td>Client-side routing</td></tr>
    <tr><td><code>axios</code></td><td>^1.x</td><td>HTTP client</td></tr>
    <tr><td><code>framer-motion</code></td><td>^11.x</td><td>Animations</td></tr>
    <tr><td><code>recharts</code></td><td>^2.x</td><td>Data visualization</td></tr>
    <tr><td><code>react-hot-toast</code></td><td>^2.x</td><td>Notifications</td></tr>
    <tr><td><code>lucide-react</code></td><td>^1.8.0</td><td>Icons</td></tr>
    <tr><td><code>react-icons</code></td><td>^5.6.0</td><td>Extra icons</td></tr>
    <tr><td><code>tailwindcss</code></td><td>^4.x</td><td>Styling framework</td></tr>
    <tr><td><code>vite</code></td><td>^8.x</td><td>Build tool</td></tr>
  </tbody>
</table>

<br/>

<h3>Backend (BACKEND/package.json)</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Package</th>
      <th>Version</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>express</code></td><td>^4.x</td><td>Backend framework</td></tr>
    <tr><td><code>mongoose</code></td><td>^8.x</td><td>MongoDB ORM</td></tr>
    <tr><td><code>jsonwebtoken</code></td><td>^9.x</td><td>Authentication tokens</td></tr>
    <tr><td><code>bcrypt</code></td><td>^5.x</td><td>Password hashing</td></tr>
    <tr><td><code>dotenv</code></td><td>^16.x</td><td>Environment config</td></tr>
    <tr><td><code>cors</code></td><td>^2.x</td><td>Cross-origin handling</td></tr>
    <tr><td><code>multer</code></td><td>^1.x</td><td>File upload handling</td></tr>
    <tr><td><code>cloudinary</code></td><td>^2.x</td><td>Cloud storage</td></tr>
    <tr><td><code>multer-storage-cloudinary</code></td><td>^4.x</td><td>Cloud upload integration</td></tr>
    <tr><td><code>nodemailer</code></td><td>^6.x</td><td>Email service</td></tr>
    <tr><td><code>exceljs</code></td><td>^4.x</td><td>Excel export</td></tr>
    <tr><td><code>cookie-parser</code></td><td>^1.x</td><td>Cookie parsing</td></tr>
  </tbody>
</table>

<br/>
<h2>📜 Available Scripts</h2>

<h3>Frontend</h3>

<pre><code>
# Start development server (http://localhost:5173)
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
</code></pre>

<br/>

<h3>Backend</h3>

<pre><code>
Start server (production)
node index.js
Start with nodemon (development)
npm run dev
Seed admin account
node seed.js
</code></pre>

<br/>
<h2>📬 Contact</h2>

<p>
For any queries, collaborations, or feedback regarding <b>ProjectSphere</b>, feel free to connect:
</p>

<br/>

<table border="1" cellpadding="10" cellspacing="0">
  <tbody>
    <tr>
      <td><b>👤 Developer</b></td>
      <td><b>Aman Gupta</b></td>
    </tr>
    <tr>
      <td><b>📧 Email</b></td>
      <td>
        <a href="mailto:ag0567688@gmail.com">ag0567688@gmail.com</a>
      </td>
    </tr>
    <tr>
      <td><b>🐙 GitHub</b></td>
      <td>
        <a href="https://github.com/amangupta9454" target="_blank">
          github.com/amangupta9454
        </a>
      </td>
    </tr>
    <tr>
      <td><b>💼 LinkedIn</b></td>
      <td>
        <a href="https://linkedin.com/in/amangupta9454" target="_blank">
          linkedin.com/in/amangupta9454
        </a>
      </td>
    </tr>
  </tbody>
</table>

<br/>

<hr/>

<div align="center">

<h3>🚀 ProjectSphere</h3>

<p>
<b>An AI-powered Academic Project & Research Management Platform</b>
</p>

<br/>

<p>
Built with ❤️ to simplify and modernize final year project workflows for students, faculty, and institutions.
</p>

<br/>

<!-- Tech Badges -->
<img src="https://img.shields.io/badge/Frontend-React-06b6d4?style=flat-square&logo=react" />
&nbsp;
<img src="https://img.shields.io/badge/Backend-Node.js-10b981?style=flat-square&logo=nodedotjs" />
&nbsp;
<img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb" />
&nbsp;
<img src="https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=flat-square&logo=cloudinary" />

<br/><br/>

<p>
⭐ <b>If you found this project useful, consider giving it a star on GitHub!</b>
</p>

<br/>

<p>
📢 <i>Open for collaborations, internships, and innovative project discussions.</i>
</p>

<br/>

</div>