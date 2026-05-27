import axios from 'axios';

/**
 * Shared Axios instance for the entire frontend.
 *
 * Local dev  → Vite proxy forwards /api/* to http://localhost:5000
 * Netlify    → netlify.toml proxy routes it to the Vercel backend.
 */
const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
  } catch {
    /* ignore parse errors */
  }
  return config;
});

// Global 401 handler — auto-logout when token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Student API helpers
// ─────────────────────────────────────────────────────────────────────────────
export const studentAPI = {
  getDashboard:            () => api.get('/student/dashboard'),
  getTimeline:             () => api.get('/student/timeline'),
  addTimelineEntry:        (data) => api.post('/student/timeline', data),
  addTimelineComment:      (entryId, message) => api.post(`/student/timeline/${entryId}/comment`, { message }),
  getMyExtensionRequests:  () => api.get('/student/extensions'),
  requestExtension:        (formData) => api.post('/student/extensions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitProposal:          (data) => api.post('/student/proposal', data),
  updateProposal:          (data) => api.put('/student/proposal', data),
  uploadFiles:             (formData) => api.post('/student/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getFiles:                () => api.get('/student/files'),
  getAvailableFaculty:     () => api.get('/student/faculty/available'),
  requestSupervisor:       (facultyId) => api.post(`/student/faculty/request/${facultyId}`),
  getTargets:              () => api.get('/student/targets'),
  addTarget:               (data) => api.post('/student/targets', data),
  updateTarget:            (targetId, data) => api.put(`/student/targets/${targetId}`, data),
  submitFinal:             (formData) => api.post('/student/submit-final', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProfile:           (formData) => api.put('/student/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Faculty API helpers
// ─────────────────────────────────────────────────────────────────────────────
export const facultyAPI = {
  getDashboard:         () => api.get('/faculty/dashboard'),
  getMyStudents:        () => api.get('/faculty/students'),
  acceptProposal:       (id) => api.put(`/faculty/proposals/${id}/accept`),
  rejectProposal:       (id, reason) => api.put(`/faculty/proposals/${id}/reject`, { reason }),
  addFeedback:          (id, message) => api.post(`/faculty/proposals/${id}/feedback`, { message }),
  updateProgress:       (id, progress) => api.put(`/faculty/proposals/${id}/progress`, { progress }),
  rejectSubmission:     (id, reason) => api.put(`/faculty/proposals/${id}/reject-submission`, { reason }),
  addTimelineComment:   (proposalId, entryId, message) => api.post(`/faculty/proposals/${proposalId}/timeline/${entryId}/comment`, { message }),
  assignDeadline:       (data) => api.post('/faculty/deadlines', data),
  rescheduleDeadline:   (id, newDate) => api.put(`/faculty/deadlines/${id}/reschedule`, { newDate }),
  reviewExtension:      (id, data) => api.put(`/faculty/extensions/${id}/review`, data),
};

// ─────────────────────────────────────────────────────────────────────────────
// HOD API helpers
// ─────────────────────────────────────────────────────────────────────────────
export const hodAPI = {
  getDashboard:           () => api.get('/hod/dashboard'),
  getAllProjects:          (status) => api.get('/hod/projects', { params: { status } }),
  exportProjects:         (status) => api.get('/hod/projects/export', { params: { status }, responseType: 'blob' }),
  getAllStudents:          (params) => api.get('/hod/students', { params }),
  getFacultyWorkload:     () => api.get('/hod/faculty/workload'),
  getApprovedFaculty:     () => api.get('/hod/faculty/approved'),
  approveFaculty:         (id) => api.put(`/hod/faculty/${id}/approve`),
  rejectFaculty:          (id, reason) => api.put(`/hod/faculty/${id}/reject`, { reason }),
  approveProposal:        (id, body) => api.put(`/hod/proposals/${id}/approve`, body),
  rejectProposal:         (id, reason) => api.put(`/hod/proposals/${id}/reject`, { reason }),
  assignFaculty:          (id, facultyId) => api.put(`/hod/proposals/${id}/assign`, { facultyId }),
  addTimelineComment:     (proposalId, entryId, message) => api.post(`/hod/proposals/${proposalId}/timeline/${entryId}/comment`, { message }),
  updateSubmission:       (id, data) => api.put(`/hod/projects/${id}/submission`, data),
  getExtensions:          () => api.get('/hod/extensions'),
  reviewExtension:        (id, data) => api.put(`/hod/extensions/${id}/review`, data),
  addStudent:             (formData) => api.post('/hod/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addFaculty:             (formData) => api.post('/hod/faculty', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  banStudent:             (id, data) => api.put(`/hod/students/${id}/ban`, data),
};

export default api;
