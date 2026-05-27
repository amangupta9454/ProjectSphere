// ──────────────────────────────────────────────────────────────────────────────
// ProjectSphere — Modern Responsive Email Templates
// ──────────────────────────────────────────────────────────────────────────────

const BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
`;

const wrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>ProjectSphere</title>
  <style>
    ${BASE}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f0f4f8; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .email-wrapper { max-width: 620px; margin: 32px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%); padding: 40px 40px 36px; text-align: center; }
    .header-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .header-logo span { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header-logo .dot { width: 8px; height: 8px; background: #a5f3fc; border-radius: 50%; display: inline-block; }
    .header-tagline { font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 500; letter-spacing: 0.5px; }
    .content { padding: 40px; }
    .greeting { font-size: 24px; font-weight: 800; color: #111827; line-height: 1.3; margin-bottom: 12px; }
    .body-text { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 20px; }
    .highlight-box { border-radius: 14px; padding: 18px 22px; margin: 24px 0; border-left: 4px solid; }
    .highlight-box.success { background: #f0fdf4; border-color: #22c55e; }
    .highlight-box.danger  { background: #fef2f2; border-color: #ef4444; }
    .highlight-box.warning { background: #fffbeb; border-color: #f59e0b; }
    .highlight-box.info    { background: #eff6ff; border-color: #3b82f6; }
    .highlight-box.purple  { background: #faf5ff; border-color: #a855f7; }
    .highlight-box-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
    .highlight-box-title.success { color: #16a34a; }
    .highlight-box-title.danger  { color: #dc2626; }
    .highlight-box-title.warning { color: #d97706; }
    .highlight-box-title.info    { color: #2563eb; }
    .highlight-box-title.purple  { color: #9333ea; }
    .highlight-box-value { font-size: 16px; font-weight: 700; color: #111827; }
    .otp-block { display: flex; gap: 10px; justify-content: center; margin: 28px 0; }
    .otp-digit { width: 52px; height: 62px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 0; box-shadow: 0 4px 16px rgba(79,70,229,0.35); }
    .cta-btn { display: inline-block; margin: 8px 0; padding: 14px 36px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(79,70,229,0.35); letter-spacing: 0.2px; }
    .cta-btn.success { background: linear-gradient(135deg, #16a34a, #15803d); box-shadow: 0 4px 20px rgba(22,163,74,0.3); }
    .cta-btn.danger  { background: linear-gradient(135deg, #dc2626, #b91c1c); box-shadow: 0 4px 20px rgba(220,38,38,0.3); }
    .cta-btn.warning { background: linear-gradient(135deg, #d97706, #b45309); box-shadow: 0 4px 20px rgba(217,119,6,0.3); }
    .cta-btn-wrap { text-align: center; margin: 28px 0; }
    .info-grid { display: table; width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-row { display: table-row; }
    .info-label { display: table-cell; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 16px 8px 0; width: 38%; vertical-align: top; }
    .info-value { display: table-cell; font-size: 14px; font-weight: 600; color: #111827; padding: 8px 0; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
    .step-list { list-style: none; margin: 16px 0; padding: 0; }
    .step-list li { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
    .step-list li:last-child { border-bottom: none; }
    .step-num { min-width: 28px; height: 28px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge.success { background: #dcfce7; color: #16a34a; }
    .badge.danger  { background: #fee2e2; color: #dc2626; }
    .badge.pending { background: #fef9c3; color: #92400e; }
    .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 28px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.7; }
    .footer a { color: #6366f1; text-decoration: none; font-weight: 600; }
    .footer .brand { font-size: 14px; font-weight: 800; color: #4f46e5; margin-bottom: 6px; }
    @media (max-width: 600px) {
      .email-wrapper { margin: 0; border-radius: 0; }
      .content, .footer { padding: 28px 24px; }
      .header { padding: 32px 24px 28px; }
      .otp-block { gap: 6px; }
      .otp-digit { width: 44px; height: 54px; font-size: 24px; }
    }
  </style>
</head>
<body>
<div class="email-wrapper">
  <div class="header">
    <div class="header-logo">
      <span>Project<span style="color:#a5f3fc">Sphere</span></span>
      <div class="dot"></div>
    </div>
    <div class="header-tagline">Final Year Project Management Portal</div>
  </div>
  ${content}
  <div class="footer">
    <p class="brand">ProjectSphere AI</p>
    <p>This is an automated message from the ProjectSphere portal.<br/>Please do not reply to this email.</p>
    <p style="margin-top:10px;">© ${new Date().getFullYear()} ProjectSphere. All rights reserved.</p>
  </div>
</div>
</body>
</html>
`;

// ── Helper: Render OTP digits ────────────────────────────────────────────────
const renderOTPDigits = (otp) => {
  return String(otp).split('').map(d =>
    `<div class="otp-digit">${d}</div>`
  ).join('');
};

// ── 1. OTP Verification (Registration & Password Reset) ─────────────────────
export const otpVerificationEmail = (name, otp, type = 'verify') => ({
  subject: type === 'reset'
    ? '🔐 Password Reset OTP — ProjectSphere'
    : '✉️ Verify Your Email — ProjectSphere',
  html: wrapper(`
    <div class="content">
      <div class="greeting">
        ${type === 'reset' ? '🔐 Reset Your Password' : '👋 Welcome to ProjectSphere!'}
      </div>
      <p class="body-text">Hi <strong>${name}</strong>,</p>
      <p class="body-text">
        ${type === 'reset'
          ? 'We received a request to reset your password. Use the OTP below to complete the reset. This code is valid for <strong>10 minutes</strong>.'
          : 'Thank you for registering! Please verify your email address using the OTP below. This code is valid for <strong>10 minutes</strong>.'
        }
      </p>
      <div class="highlight-box info">
        <div class="highlight-box-title info">Your One-Time Password</div>
        <div class="otp-block">
          ${renderOTPDigits(otp)}
        </div>
        <p style="text-align:center;font-size:12px;color:#6b7280;margin-top:8px;">Do not share this code with anyone</p>
      </div>
      <p class="body-text">If you didn't ${type === 'reset' ? 'request a password reset' : 'create this account'}, you can safely ignore this email.</p>
    </div>
  `)
});

// ── 2. HOD Proposal Approved (sent to STUDENT only) ─────────────────────────
export const proposalApprovedEmail = (studentName, projectTitle, hodName) => ({
  subject: `✅ Your Proposal Has Been Approved — "${projectTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">🎉 Congratulations, Your Proposal is Approved!</div>
      <p class="body-text">Hi <strong>${studentName}</strong>,</p>
      <p class="body-text">
        Great news! The Head of Department has reviewed and approved your project proposal. A faculty supervisor will be assigned to guide you through the journey.
      </p>
      <div class="highlight-box success">
        <div class="highlight-box-title success">Project Approved</div>
        <div class="highlight-box-value">${projectTitle}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Reviewed By</span>
          <span class="info-value">${hodName || 'Head of Department'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value"><span class="badge success">HOD Approved ✓</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Next Step</span>
          <span class="info-value">Awaiting Faculty Supervisor Assignment</span>
        </div>
      </div>
      <p class="body-text">You can track your project status in real-time from your student dashboard.</p>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app/student/dashboard" class="cta-btn success">Track Project →</a>
      </div>
    </div>
  `)
});

// ── 3. Faculty Assigned Notification (sent to FACULTY) ──────────────────────
export const facultyAssignedEmail = (facultyName, studentName, projectTitle, department) => ({
  subject: `📋 New Project Assigned — "${projectTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">📋 New Project Supervision Assignment</div>
      <p class="body-text">Hi <strong>${facultyName}</strong>,</p>
      <p class="body-text">
        You have been assigned as the faculty supervisor for the following final year project. Please review the project proposal and accept or provide feedback.
      </p>
      <div class="highlight-box purple">
        <div class="highlight-box-title purple">Project Details</div>
        <div class="highlight-box-value">${projectTitle}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Student Leader</span>
          <span class="info-value">${studentName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department</span>
          <span class="info-value">${department || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Your Action</span>
          <span class="info-value">Accept or Reject the project assignment</span>
        </div>
      </div>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app/faculty/dashboard" class="cta-btn">Review Project →</a>
      </div>
    </div>
  `)
});

// ── 4. Proposal Rejected by HOD (sent to STUDENT only) ──────────────────────
export const proposalRejectedByHodEmail = (studentName, projectTitle, reason) => ({
  subject: `❌ Proposal Not Approved — "${projectTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">Your Proposal Requires Revision</div>
      <p class="body-text">Hi <strong>${studentName}</strong>,</p>
      <p class="body-text">
        After careful review, the Head of Department has not approved your current proposal. Please review the feedback below and resubmit an improved version.
      </p>
      <div class="highlight-box danger">
        <div class="highlight-box-title danger">Rejection Reason</div>
        <div style="font-size:14px;color:#374151;margin-top:4px;">${reason || 'Proposal does not meet department requirements.'}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Project Title</span>
          <span class="info-value">${projectTitle}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value"><span class="badge danger">Rejected (HOD)</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Action Required</span>
          <span class="info-value">Revise and resubmit your proposal</span>
        </div>
      </div>
      <p class="body-text">You can update your proposal directly from your student dashboard and resubmit for HOD review.</p>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app/student/dashboard" class="cta-btn warning">Update Proposal →</a>
      </div>
    </div>
  `)
});

// ── 5. Deadline Reminder (sent to FACULTY and HOD, not students) ─────────────
export const deadlineReminderEmail = (recipientName, deadlineTitle, deadlineDate, daysLeft) => ({
  subject: `⏰ Deadline Alert: "${deadlineTitle}" — ${daysLeft} Day${daysLeft !== 1 ? 's' : ''} Left`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">${daysLeft <= 2 ? '🚨 Urgent Deadline Alert!' : '⏰ Upcoming Deadline Reminder'}</div>
      <p class="body-text">Hi <strong>${recipientName}</strong>,</p>
      <p class="body-text">
        ${daysLeft <= 2
          ? `This is an urgent reminder that the deadline below is approaching in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>. Please take immediate action.`
          : `This is a friendly reminder about an upcoming deadline. You have <strong>${daysLeft} days</strong> to prepare.`
        }
      </p>
      <div class="highlight-box ${daysLeft <= 2 ? 'danger' : 'warning'}">
        <div class="highlight-box-title ${daysLeft <= 2 ? 'danger' : 'warning'}">Deadline Details</div>
        <div class="highlight-box-value">${deadlineTitle}</div>
        <p style="font-size:13px;color:#6b7280;margin-top:6px;">Due: <strong>${new Date(deadlineDate).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</strong></p>
      </div>
      <ul class="step-list">
        <li><div class="step-num">1</div><span>Verify all project files are uploaded to the portal</span></li>
        <li><div class="step-num">2</div><span>Confirm student submissions are complete and reviewed</span></li>
        <li><div class="step-num">3</div><span>Ensure GitHub and live project links are functional</span></li>
      </ul>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app" class="cta-btn ${daysLeft <= 2 ? 'danger' : 'warning'}">Go to Dashboard →</a>
      </div>
    </div>
  `)
});

// ── 6. Rescheduled Deadline (sent to FACULTY / HOD) ─────────────────────────
export const deadlineRescheduledEmail = (recipientName, deadlineTitle, oldDate, newDate) => ({
  subject: `📅 Deadline Rescheduled: "${deadlineTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">📅 Deadline Has Been Updated</div>
      <p class="body-text">Hi <strong>${recipientName}</strong>,</p>
      <p class="body-text">A deadline has been rescheduled. Please update your schedule accordingly.</p>
      <div class="highlight-box info">
        <div class="highlight-box-title info">Rescheduled Deadline</div>
        <div class="highlight-box-value">${deadlineTitle}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Previous Date</span>
          <span class="info-value" style="text-decoration:line-through;color:#9ca3af;">${new Date(oldDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">New Date</span>
          <span class="info-value" style="color:#16a34a;font-weight:800;">${new Date(newDate).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
        </div>
      </div>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app" class="cta-btn">View Dashboard →</a>
      </div>
    </div>
  `)
});

// ── 7. Project Completion (sent to FACULTY / HOD) ────────────────────────────
export const projectCompletedEmail = (recipientName, studentName, projectTitle) => ({
  subject: `🏆 Final Submission Received: "${projectTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">🏆 Final Project Submitted!</div>
      <p class="body-text">Hi <strong>${recipientName}</strong>,</p>
      <p class="body-text">
        A student has submitted their final year project for your review. Please log in to the portal to evaluate the submission.
      </p>
      <div class="highlight-box success">
        <div class="highlight-box-title success">Final Submission</div>
        <div class="highlight-box-value">${projectTitle}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Student Leader</span>
          <span class="info-value">${studentName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Submitted On</span>
          <span class="info-value">${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Action Required</span>
          <span class="info-value">Accept or Reject the final submission</span>
        </div>
      </div>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app" class="cta-btn success">Review Submission →</a>
      </div>
    </div>
  `)
});

// ── 8. Proposal Submitted Notification (sent to HOD) ────────────────────────
export const proposalSubmittedEmail = (hodName, studentName, projectTitle, domain, department) => ({
  subject: `📝 New Proposal Submitted: "${projectTitle}"`,
  html: wrapper(`
    <div class="content">
      <div class="greeting">📝 New Project Proposal Awaiting Review</div>
      <p class="body-text">Hi <strong>${hodName}</strong>,</p>
      <p class="body-text">
        A new final year project proposal has been submitted and is awaiting your review and approval.
      </p>
      <div class="highlight-box purple">
        <div class="highlight-box-title purple">Project Details</div>
        <div class="highlight-box-value">${projectTitle}</div>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Student Leader</span>
          <span class="info-value">${studentName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department</span>
          <span class="info-value">${department || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Domain / Tech</span>
          <span class="info-value">${domain || 'Not specified'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status</span>
          <span class="info-value"><span class="badge pending">Pending HOD Review</span></span>
        </div>
      </div>
      <div class="cta-btn-wrap">
        <a href="https://projectsphere-ai.netlify.app/hod/dashboard" class="cta-btn">Review Proposal →</a>
      </div>
    </div>
  `)
});
