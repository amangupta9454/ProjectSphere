import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, Target, Send, Megaphone, User,
  Bell, Clock, RefreshCw, CheckCircle, XCircle, FileText, Paperclip,
  FolderOpen, Calendar, ChevronRight, TrendingUp, AlertTriangle, Play,
  Volume2, VolumeX, Sparkles, Upload, Info, MessageSquare, Download, Search, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Sidebar from '../Components/Sidebar';

const TABS = [
  { id: 'overview',      label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'proposal',      label: 'Submit Proposal',   icon: BookOpen },
  { id: 'supervisor',    label: 'Supervisor',        icon: Users },
  { id: 'details',       label: 'Project Details',   icon: Target },
  { id: 'submission',    label: 'Submission & Files', icon: Send },
  { id: 'announcements', label: 'Announcements',     icon: Megaphone },
  { id: 'profile',       label: 'My Profile',        icon: User },
];

const STATUS_META = {
  'Pending HOD Review': { color: 'yellow', label: 'Pending HOD Review', step: 1 },
  'Pending Faculty Assignment': { color: 'amber', label: 'Pending Mentor Assignment', step: 2 },
  'HOD Approved': { color: 'blue', label: 'HOD Approved', step: 2 },
  'Rejected (HOD)': { color: 'red', label: 'Rejected by HOD', step: 1 },
  'Faculty Assigned': { color: 'indigo', label: 'Faculty Assigned', step: 3 },
  'Faculty Accepted': { color: 'green', label: 'Faculty Accepted ✓', step: 4 },
  'Rejected (Faculty)': { color: 'orange', label: 'Rejected by Faculty', step: 3 },
  'Submitted': { color: 'purple', label: 'Project Submitted', step: 5 },
};

const FILE_TYPES = [
  { value: 'document', label: 'Document (PDF/Word)', icon: FileText },
  { value: 'presentation', label: 'Presentation (PPT)', icon: Paperclip },
  { value: 'code', label: 'Code (ZIP)', icon: FolderOpen },
  { value: 'paper', label: 'Research Paper', icon: BookOpen },
];

// Helper to synthesize a premium audio notification chime
const playChime = (soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Smooth dual-note chime (D5 to A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.warn('Audio Context block:', e);
  }
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab]       = useState('overview');
  const [data, setData]                 = useState({ profile: null, proposal: null, submissions: [], deadlines: [], notifications: [], unreadCount: 0 });
  const [loading, setLoading]           = useState(true);
  const [files, setFiles]               = useState([]);
  
  // Extension & Rescheduling State
  const [extensions, setExtensions]     = useState([]);
  const [extensionModal, setExtensionModal] = useState({ open: false, deadline: null });
  const [extForm, setExtForm]           = useState({ requestedDate: '', reason: '', document: null });
  const [extSubmitting, setExtSubmitting] = useState(false);

  // Timeline State
  const [timelineStatus, setTimelineStatus] = useState('PROJECT STARTED');
  const [timelineRemarks, setTimelineRemarks] = useState('');
  const [timelineSubmitting, setTimelineSubmitting] = useState(false);

  // Smart Popups State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderPopup, setReminderPopup] = useState({ open: false, deadline: null, type: '' });

  // Proposal & profile state
  const [proposalForm, setProposalForm] = useState({ title: '', description: '', domain: '', teamSize: 1, teamMembers: [], referenceLinks: '' });
  const [submitting, setSubmitting]     = useState(false);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [facultySearch, setFacultySearch] = useState('');
  const [newTarget, setNewTarget]       = useState({ title: '', description: '' });
  const [finalForm, setFinalForm]       = useState({ liveLink: '', githubLink: '', linkedinLink: '' });
  const [profileForm, setProfileForm]   = useState({ githubId: '', linkedinId: '', portfolioLink: '' });
  const [resumeFile, setResumeFile]     = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const resumeRef = useRef(null);

  const [uploading, setUploading]       = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('document');
  const [showNotifs, setShowNotifs]     = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const fetchExtensions = async () => {
    try {
      const res = await api.get('/student/extensions');
      setExtensions(res.data);
    } catch {}
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, filesRes, facultyRes] = await Promise.all([
        api.get('/student/dashboard'),
        api.get('/student/files'),
        api.get('/student/faculty/available')
      ]);
      setData(dashRes.data);
      setFiles(filesRes.data.files || []);
      setAvailableFaculty(facultyRes.data.faculty || []);
      
      if (dashRes.data.proposal) {
        const p = dashRes.data.proposal;
        setProposalForm({ 
          title: p.title || '', 
          description: p.description || '',
          domain: p.domain || '',
          teamSize: p.teamSize || 1,
          teamMembers: p.teamMembers || [],
          referenceLinks: (p.referenceLinks || []).join(', ') 
        });
      } else {
        setProposalForm(prev => ({...prev, teamMembers: [{ name: '', email: '', mobileNumber: '', course: 'B.Tech', branch: 'Computer Science', section: 'A' }]}));
      }

      if (dashRes.data.profile) {
        const pr = dashRes.data.profile;
        setProfileForm({ githubId: pr.githubId || '', linkedinId: pr.linkedinId || '', portfolioLink: pr.portfolioLink || '' });
      }
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) handleLogout();
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => {
    if (activeTab === 'details' || activeTab === 'overview') {
      fetchExtensions();
    }
  }, [activeTab]);

  // Smart Reminder Popup Trigger
  useEffect(() => {
    if (data.deadlines && data.deadlines.length > 0) {
      const now = new Date();
      // Find the closest active deadline in the future or due today
      const upcoming = data.deadlines.filter(d => new Date(d.dueDate) >= now);
      if (upcoming.length === 0) return;

      const closest = upcoming[0];
      const due = new Date(closest.dueDate);
      const diffTime = due - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let popupType = '';
      if (diffDays === 0 || (diffDays > 0 && diffDays <= 1)) {
        popupType = 'today';
      } else if (diffDays > 1 && diffDays <= 2) {
        popupType = 'urgent';
      } else if (diffDays > 2 && diffDays <= 10) {
        popupType = 'motivational';
      }

      if (popupType) {
        const key = `dismissed_${closest._id}_${popupType}`;
        const isDismissed = localStorage.getItem(key);
        if (!isDismissed) {
          // Play Synthesized sound alert chimes
          setTimeout(() => {
            playChime(soundEnabled);
          }, 600);
          setReminderPopup({ open: true, deadline: closest, type: popupType });
        }
      }
    }
  }, [data.deadlines, soundEnabled]);

  const dismissPopup = () => {
    if (reminderPopup.deadline) {
      const key = `dismissed_${reminderPopup.deadline._id}_${reminderPopup.type}`;
      localStorage.setItem(key, 'true');
    }
    setReminderPopup({ open: false, deadline: null, type: '' });
  };

  const handleTeamSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setProposalForm(prev => {
      let members = [...prev.teamMembers];
      if (size > members.length) {
        for (let i = members.length; i < size; i++) {
          members.push({ name: '', email: '', mobileNumber: '', course: prev.teamMembers[0]?.course || 'B.Tech', branch: prev.teamMembers[0]?.branch || 'Computer Science', section: prev.teamMembers[0]?.section || 'A' });
        }
      } else if (size < members.length) {
        members = members.slice(0, size);
      }
      return { ...prev, teamSize: size, teamMembers: members };
    });
  };

  const updateTeamMember = (index, field, value) => {
    setProposalForm(prev => {
      const members = [...prev.teamMembers];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, teamMembers: members };
    });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: proposalForm.title,
        description: proposalForm.description,
        domain: proposalForm.domain,
        teamSize: proposalForm.teamSize,
        teamMembers: proposalForm.teamMembers,
        referenceLinks: proposalForm.referenceLinks ? proposalForm.referenceLinks.split(',').map(l => l.trim()).filter(Boolean) : []
      };

      if (data.proposal && (data.proposal.status === 'Rejected (HOD)' || data.proposal.status === 'Rejected (Faculty)')) {
        await api.put('/student/proposal', payload);
        toast.success('Proposal resubmitted for HOD review!');
      } else {
        await api.post('/student/proposal', payload);
        toast.success('Proposal submitted successfully!');
      }
      fetchDashboard();
      setActiveTab('overview');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const handleRequestSupervisor = async (facultyId) => {
    try {
      await api.post(`/student/faculty/request/${facultyId}`);
      toast.success('Supervisor requested successfully!');
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to request supervisor');
    }
  };

  const handleAddTarget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/targets', newTarget);
      toast.success('Target added!');
      setNewTarget({ title: '', description: '' });
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add target');
    }
  };

  const updateTargetStatus = async (targetId, status) => {
    try {
      await api.put(`/student/targets/${targetId}`, { status });
      fetchDashboard();
    } catch (e) {
      toast.error('Failed to update target');
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/submit-final', finalForm);
      toast.success('Final project submitted successfully!');
      fetchDashboard();
      setActiveTab('overview');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submission failed');
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));
    formData.append('fileType', selectedFileType);
    setUploading(true);
    try {
      await api.post('/student/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Files uploaded successfully!');
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); e.target.value = ''; }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('githubId', profileForm.githubId);
    formData.append('linkedinId', profileForm.linkedinId);
    formData.append('portfolioLink', profileForm.portfolioLink);
    if (resumeFile) formData.append('resume', resumeFile);

    setUpdatingProfile(true);
    try {
      const res = await api.put('/student/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated successfully!');
      setData(d => ({ ...d, profile: res.data.profile }));
      setResumeFile(null);
      if (resumeRef.current) resumeRef.current.value = '';
    } catch (e) {
      toast.error(e.response?.data?.message || 'Profile update failed');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    setTimelineSubmitting(true);
    try {
      await api.post('/student/proposal/timeline', { status: timelineStatus, remarks: timelineRemarks });
      toast.success('Progress timeline updated successfully!');
      setTimelineRemarks('');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update timeline.');
    } finally {
      setTimelineSubmitting(false);
    }
  };

  const handleExtensionSubmit = async (e) => {
    e.preventDefault();
    if (!extForm.requestedDate || !extForm.reason || extForm.reason.length < 20) {
      return toast.error('Please enter a target date and details (min 20 chars)');
    }
    setExtSubmitting(true);
    const formData = new FormData();
    formData.append('deadlineId', extensionModal.deadline._id);
    formData.append('requestedDate', extForm.requestedDate);
    formData.append('reason', extForm.reason);
    if (extForm.document) {
      formData.append('document', extForm.document);
    }
    
    try {
      await api.post('/student/deadlines/extension', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Extension request submitted to your supervisor!');
      setExtensionModal({ open: false, deadline: null });
      setExtForm({ requestedDate: '', reason: '', document: null });
      fetchExtensions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setExtSubmitting(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setData(d => ({ ...d, unreadCount: 0, notifications: d.notifications.map(n => ({ ...n, isRead: true })) }));
    } catch {}
  };

  const proposal = data.proposal;
  const statusMeta = proposal ? (STATUS_META[proposal.status] || { color: 'slate', label: proposal.status, step: 1 }) : {};

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        navItems={TABS}
        user={data.profile}
        role="student"
        onLogout={handleLogout}
        unreadCount={data.unreadCount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 capitalize">{TABS.find(t=>t.id===activeTab)?.label || 'Dashboard'}</h2>
            <p className="text-xs text-gray-400 font-medium">Student Interface</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button onClick={() => setSoundEnabled(!soundEnabled)} title={soundEnabled ? 'Disable Sounds' : 'Enable Sounds'} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-gray-200 transition-all">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifs(p => !p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-gray-200 transition-all">
                <Bell className="w-4 h-4" />
                {data.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">{data.unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-blue-500"/> Notifications</h4>
                    {data.unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-blue-600 font-semibold hover:underline bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Mark all read</button>}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {data.notifications.length === 0 && <div className="p-8 text-center"><Bell className="w-8 h-8 text-gray-200 mx-auto mb-2"/><p className="text-sm text-gray-400 font-medium">No notifications yet</p></div>}
                    {data.notifications.map(n => (
                      <div key={n._id} className={`p-4 transition-colors hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(n.createdAt).toLocaleDateString()}</p>
                        {!n.isRead && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full -mt-6 float-right shadow-sm"></span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={fetchDashboard} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-gray-200 transition-all"><RefreshCw className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="w-full">
            
            {/* ── 1. DASHBOARD OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Applied', val: proposal ? 1 : 0, color: 'blue' },
                    { label: 'Approved', val: ['HOD Approved', 'Pending Faculty Assignment', 'Faculty Assigned', 'Faculty Accepted', 'Submitted'].includes(proposal?.status) ? 1 : 0, color: 'green' },
                    { label: 'Pending', val: proposal?.status === 'Pending HOD Review' ? 1 : 0, color: 'yellow' },
                    { label: 'Rejected', val: proposal?.status?.includes('Reject') ? 1 : 0, color: 'red' },
                    { label: 'Ongoing', val: proposal?.status === 'Faculty Accepted' ? 1 : 0, color: 'indigo' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                      <p className={`text-3xl font-extrabold mt-1 text-${s.color}-600`}>{s.val}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Col: Project Status */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className={`bg-white rounded-3xl p-8 border shadow-sm relative overflow-hidden ${!proposal ? 'border-gray-200' : proposal.status.includes('Rejected') ? 'border-red-200' : proposal.status === 'Faculty Accepted' || proposal.status === 'Submitted' ? 'border-green-200' : 'border-blue-200'}`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-10 -mt-10 rounded-full ${proposal?.status?.includes('Reject') ? 'bg-red-500' : proposal?.status === 'Faculty Accepted' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      
                      <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
                        <div className="w-full">
                          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Current Project Status</p>
                          {!proposal ? (
                            <>
                              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Ready to start your journey?</h2>
                              <p className="text-gray-500 text-sm mt-2 max-w-md">Submit your final year project proposal with team details to get HOD approval.</p>
                              <button onClick={() => setActiveTab('proposal')} className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                                <BookOpen className="w-4 h-4" /> Start Proposal 
                              </button>
                            </>
                          ) : (
                            <>
                              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{proposal.title}</h2>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{proposal.department || 'N/A'}</span>
                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md">Team Size: {proposal.teamMembers?.length + 1 || 1}</span>
                                {proposal.assignedFaculty && <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-md">Supervisor: {proposal.assignedFaculty.name}</span>}
                              </div>
                              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border shadow-sm
                                ${statusMeta.color === 'red' || statusMeta.color === 'orange' ? 'bg-red-50 text-red-700 border-red-200' :
                                  statusMeta.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                  statusMeta.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                {proposal.status.includes('Accepted') || proposal.status === 'Submitted' ? <CheckCircle className="w-4 h-4" /> : proposal.status.includes('Rejected') ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                {statusMeta.label}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Latest Feedback */}
                    {proposal?.facultyFeedback?.length > 0 && (
                      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Latest Supervisor Feedback</h3>
                        <div className="space-y-4">
                          {[...proposal.facultyFeedback].reverse().slice(0, 2).map((f, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                              <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-md flex items-center justify-center shrink-0 text-white text-sm font-bold">{proposal.assignedFaculty?.name?.[0] || 'F'}</div>
                              <div>
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">{f.message}</p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(f.addedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Col: Deadlines & Stepper */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500" /> Upcoming Deadlines</h3>
                      {data.deadlines.length === 0
                        ? <div className="py-6 text-center text-sm text-gray-400 font-medium">No deadlines mapped.<br/>Enjoy your free time!</div>
                        : <div className="space-y-3">
                          {data.deadlines.map(d => {
                            // Support extended deadline overrides dynamically
                            const extMatch = proposal?.extendedDeadlines?.find(ed => ed.deadlineId === d._id);
                            const finalDueDate = extMatch ? new Date(extMatch.extendedDate) : new Date(d.dueDate);
                            const diffDays = Math.ceil((finalDueDate - new Date()) / (1000 * 60 * 60 * 24));
                            
                            return (
                              <div key={d._id} className={`flex flex-col gap-2 p-3.5 rounded-2xl border ${diffDays <= 3 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <p className={`text-sm font-bold ${diffDays <= 3 ? 'text-red-700' : 'text-gray-900'}`}>{d.title}</p>
                                    <p className="text-[11px] font-medium text-gray-400 mt-0.5 flex items-center gap-1">
                                      <Clock className="w-3 h-3"/> {finalDueDate.toLocaleDateString()}
                                      {extMatch && <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black text-[9px] uppercase">Extended</span>}
                                    </p>
                                  </div>
                                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${diffDays <= 3 ? 'bg-red-100 text-red-600' : 'bg-white shadow-sm text-gray-600 border border-gray-200'}`}>
                                    {diffDays > 0 ? `${diffDays}d left` : 'Overdue'}
                                  </span>
                                </div>
                                {proposal && (
                                  <button onClick={() => setExtensionModal({ open: true, deadline: d })} className="text-[10px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 py-1 px-2.5 rounded-lg border border-purple-100 self-end transition-all">
                                    Request Extension
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      }
                    </div>

                    {/* Stepper */}
                    {proposal && (
                       <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                         <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Project Stepper</h3>
                         {(() => {
                           const steps=['Pending HOD Review','Pending Faculty Assignment','Faculty Assigned','Faculty Accepted','Submitted'];
                           const labels=['HOD Review','HOD Apprv','Assigned','Active','Submitted'];
                           const rejected=proposal.status.includes('Rejected');
                           const idx=rejected?0:Math.max(steps.indexOf(proposal.status),0);
                           return(
                             <div className="flex items-center gap-1">
                               {steps.map((s,i)=>(
                                 <React.Fragment key={s}>
                                   <div className={`flex flex-col items-center text-center min-w-[50px] ${i<=idx&&!rejected?'opacity-100':'opacity-30'}`}>
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i<idx?'bg-green-50 border-green-400 text-green-700':i===idx&&!rejected?'bg-blue-50 border-blue-500 ring-4 ring-blue-100 text-blue-700':'bg-gray-50 border-gray-200'}`}>
                                       {i<idx?'✓':i+1}
                                     </div>
                                     <p className="text-[9px] font-black text-gray-500 mt-1">{labels[i]}</p>
                                   </div>
                                   {i<4&&<div className={`flex-1 h-0.5 min-w-[8px] ${i<idx&&!rejected?'bg-green-400':'bg-gray-200'}`} />}
                                 </React.Fragment>
                               ))}
                             </div>
                           );
                         })()}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. SUBMIT PROPOSAL ── */}
            {activeTab === 'proposal' && (
              <div className="max-w-4xl mx-auto">
                {proposal && !['Rejected (HOD)', 'Rejected (Faculty)'].includes(proposal.status) ? (
                   <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"><CheckCircle className="w-8 h-8 text-blue-600"/></div>
                     <h2 className="text-xl font-extrabold text-blue-900">Proposal Already Submitted</h2>
                     <p className="text-blue-700 mt-2 max-w-md">Your proposal is currently in the <strong>{proposal.status}</strong> stage. You cannot edit it unless HOD or Faculty requests changes. Head to the Project Details tab to view it.</p>
                     <button onClick={() => setActiveTab('details')} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition">View Details</button>
                   </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-bl-full -z-10"></div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><BookOpen className="w-6 h-6"/></div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                          {proposal ? 'Resubmit Project Proposal' : 'Submit Project Proposal'}
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Fill in the project details and team member information carefully.</p>
                      </div>
                    </div>

                    {proposal && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"/>
                        <div>
                          <p className="text-sm text-orange-800 font-bold mb-1">Previous Rejection Note</p>
                          <p className="text-sm text-orange-700 font-medium">{proposal.status === 'Rejected (HOD)' ? proposal.hodReview?.comment : proposal.facultyReview?.comment}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleProposalSubmit} className="space-y-8">
                      {/* Section 1: Project Info */}
                      <div className="space-y-5">
                        <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">1. Project Information</h3>
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Project Title <span className="text-red-400">*</span></label>
                          <input required minLength={10} maxLength={120}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                            placeholder="Enter a descriptive title for your project" value={proposalForm.title}
                            onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })} />
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
                          🏫 Your proposal will be routed to the <strong>{data.profile?.branch || 'your'}</strong> department HOD automatically.
                        </div>
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Project Domain / Technology Area <span className="text-red-400">*</span></label>
                          <input required
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
                            placeholder="e.g. Machine Learning, Web Development, IoT, Data Science..."
                            value={proposalForm.domain}
                            onChange={e => setProposalForm({ ...proposalForm, domain: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Project Description <span className="text-red-400">*</span></label>
                          <textarea required minLength={100} maxLength={1000} rows={5}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium resize-none shadow-inner"
                            placeholder="Describe your project, objectives, methodologies, and expected outcomes..."
                            value={proposalForm.description}
                            onChange={e => setProposalForm({ ...proposalForm, description: e.target.value })} />
                        </div>
                      </div>

                      {/* Section 2: Team Members */}
                      <div className="space-y-5">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                          <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">2. Team Configuration</h3>
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-gray-700">Non-Leader Team Size:</label>
                            <select className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-500" value={proposalForm.teamSize} onChange={handleTeamSizeChange}>
                              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                        </div>

                        {proposalForm.teamSize === 0 && (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">Solo Project (No additional team members)</div>
                        )}

                        <div className="space-y-4">
                          {proposalForm.teamMembers.map((member, i) => (
                            <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 relative">
                              <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">Member {i+1}</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
                                  <input required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.name} onChange={e => updateTeamMember(i, 'name', e.target.value)} placeholder="John Doe"/>
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
                                  <input type="email" required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.email} onChange={e => updateTeamMember(i, 'email', e.target.value)} placeholder="john@example.com"/>
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                  <input required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.mobileNumber} onChange={e => updateTeamMember(i, 'mobileNumber', e.target.value)} placeholder="10-digit number"/>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Course</label>
                                    <input required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.course} onChange={e => updateTeamMember(i, 'course', e.target.value)}/>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Branch</label>
                                    <input required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.branch} onChange={e => updateTeamMember(i, 'branch', e.target.value)}/>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Section</label>
                                    <input required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" value={member.section} onChange={e => updateTeamMember(i, 'section', e.target.value)}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all">
                        {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send className="w-5 h-5" /> {proposal ? 'Resubmit Proposal' : 'Submit Proposal'}</>}
                      </motion.button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ── 3. SUPERVISOR ── */}
            {activeTab === 'supervisor' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
                   <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><User className="w-4 h-4 text-indigo-500" /> Assigned Supervisor</h3>
                   {proposal?.assignedFaculty ? (
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-indigo-100 border-4 border-white shadow-lg rounded-full flex items-center justify-center shrink-0">
                          <span className="text-3xl font-extrabold text-indigo-600">{proposal.assignedFaculty.name[0]}</span>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-2xl font-extrabold text-gray-900">{proposal.assignedFaculty.name}</p>
                          <p className="text-sm font-bold text-gray-500 mt-1">{proposal.assignedFaculty.department} Dept. {proposal.assignedFaculty.designation && `• ${proposal.assignedFaculty.designation}`}</p>
                          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <a href={`mailto:${proposal.assignedFaculty.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition"><Mail className="w-4 h-4" /> {proposal.assignedFaculty.email}</a>
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                       <User className="w-12 h-12 text-gray-300 mb-3" />
                       <h3 className="text-lg font-bold text-gray-700">No Supervisor Assigned</h3>
                       <p className="text-sm font-medium text-gray-500 mt-1 max-w-sm">No supervisor has been assigned to your approved project proposal yet. The HOD will assign one shortly.</p>
                     </div>
                   )}
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Search className="w-4 h-4 text-blue-500" /> Department Supervisors</h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search by name..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={facultySearch} onChange={e => setFacultySearch(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableFaculty.filter(f => f.name.toLowerCase().includes(facultySearch.toLowerCase())).map(faculty => (
                      <div key={faculty._id} className="p-5 border border-gray-100 rounded-2xl bg-white relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                          <span className="text-lg font-extrabold text-blue-700">{faculty.name[0]}</span>
                        </div>
                        <h4 className="font-extrabold text-gray-900 leading-tight">{faculty.name}</h4>
                        <p className="text-xs font-bold text-gray-500 mb-2">{faculty.department} • {faculty.designation || 'Faculty'}</p>
                        <p className="text-[11px] font-medium text-gray-400 line-clamp-2">{faculty.specialization || 'Supervise project milestones and thesis reviews.'}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500">Supervising: <span className="text-blue-600">{faculty.activeProjectsCount}</span> students</span>
                        </div>
                      </div>
                    ))}
                    {availableFaculty.length === 0 && <div className="col-span-full py-10 text-center text-gray-400 font-medium">No department supervisors available.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. PROJECT DETAILS & TIMELINE ── */}
            {activeTab === 'details' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {!proposal ? (
                  <div className="py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 font-medium">Please submit a proposal first.</div>
                ) : (
                  <>
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                       <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                         <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">{proposal.title}</h2>
                            {proposal.domain && <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md mt-2 inline-block border border-indigo-100">{proposal.domain}</span>}
                         </div>
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">{proposal.status}</span>
                       </div>
                       <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-4">{proposal.description}</p>
                       {proposal.referenceLinks?.length > 0 && (
                         <div className="flex flex-wrap gap-2">
                           {proposal.referenceLinks.map((link, i) => <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{link}</a>)}
                         </div>
                       )}
                    </div>

                    {/* Interactive Real-Time Progress Timeline Updates */}
                    {['Faculty Accepted', 'Submitted'].includes(proposal.status) && (
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" /> Log Real-Time Progress Update
                        </h3>
                        <form onSubmit={handleTimelineSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Progress Status *</label>
                              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={timelineStatus} onChange={e => setTimelineStatus(e.target.value)}>
                                <option value="PROJECT STARTED">PROJECT STARTED (20%)</option>
                                <option value="PROTOTYPE CREATED">PROTOTYPE CREATED (50%)</option>
                                <option value="REPORT PREPARED">REPORT PREPARED (80%)</option>
                                <option value="PROJECT COMPLETE">PROJECT COMPLETE (95%)</option>
                                <option value="PROJECT SUBMITTED">PROJECT SUBMITTED (100%)</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Optional Remarks / Comments</label>
                              <input type="text" placeholder="Explain what milestones were achieved..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={timelineRemarks} onChange={e => setTimelineRemarks(e.target.value)} />
                            </div>
                          </div>
                          <button type="submit" disabled={timelineSubmitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2">
                            {timelineSubmitting ? 'Posting...' : <><Sparkles className="w-3.5 h-3.5" /> Post Progress Update</>}
                          </button>
                        </form>

                        {/* Renders chronological timeline updates */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Milestone Progress Logs</h4>
                          {proposal.timeline && proposal.timeline.length > 0 ? (
                            <div className="relative border-l border-gray-200 ml-4 space-y-6">
                              {[...proposal.timeline].reverse().map((t, idx) => (
                                <div key={idx} className="relative pl-6">
                                  <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-white shadow-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  </div>
                                  <div>
                                    <span className="inline-block bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase border border-blue-100">{t.status}</span>
                                    <span className="text-[10px] text-gray-400 ml-2">{new Date(t.timestamp).toLocaleString()}</span>
                                    {t.remarks && <p className="text-xs text-gray-700 mt-1 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">{t.remarks}</p>}
                                    {t.facultyComment && (
                                      <div className="mt-2 p-2.5 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800 flex items-start gap-2">
                                        <MessageSquare className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                                        <p><strong>Supervisor Feedback:</strong> {t.facultyComment}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No milestone updates posted yet. Use the fields above to post progress updates.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Deadline Extension History */}
                    {proposal && (
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Deadline Extension Requests</h3>
                        <div className="space-y-3">
                          {extensions.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No extension requests logged. You can request extensions next to any deadline listed in the sidebar / upcoming panel.</p>
                          ) : (
                            extensions.map(req => (
                              <div key={req._id} className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{req.deadlineId?.title || 'Milestone'}</p>
                                  <p className="text-xs text-gray-500">Requested Extension: <span className="font-semibold">{new Date(req.requestedDate).toLocaleDateString()}</span></p>
                                  <p className="text-xs text-gray-400 mt-1">Reason: "{req.reason}"</p>
                                  {req.documentUrl && <a href={req.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 mt-1"><Download className="w-3 h-3" /> View Proof Document</a>}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider border
                                    ${req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                      req.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                      'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    {req.status}
                                  </span>
                                  {req.remarks && <p className="text-[11px] text-gray-600 italic">Remarks: {req.remarks}</p>}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Status Timeline</h3>
                      <div className="space-y-3">
                        {[
                          { status: 'Pending HOD Review', label: 'Proposal Submitted', icon: '📝', done: true, timestamp: proposal.createdAt, note: null },
                          { status: 'Pending Faculty Assignment', label: 'HOD Review Approved', icon: '🏛️', done: ['Pending Faculty Assignment','Faculty Assigned','Faculty Accepted','Submitted'].includes(proposal.status), rejected: proposal.status === 'Rejected (HOD)', timestamp: proposal.hodReview?.reviewedAt, note: proposal.hodReview?.comment },
                          { status: 'Faculty Assigned',   label: 'Faculty Supervisor Assigned', icon: '👨‍🏫', done: ['Faculty Assigned','Faculty Accepted','Submitted'].includes(proposal.status), timestamp: null, note: proposal.assignedFaculty ? `Assigned Mentor: ${proposal.assignedFaculty.name}` : null },
                          { status: 'Faculty Accepted',   label: 'Faculty Mentor Accepted', icon: '✅', done: ['Faculty Accepted','Submitted'].includes(proposal.status), rejected: proposal.status === 'Rejected (Faculty)', timestamp: proposal.facultyReview?.reviewedAt, note: proposal.facultyReview?.comment },
                          { status: 'Submitted',          label: 'Final Approved & Submitted', icon: '🏁', done: proposal.status === 'Submitted', timestamp: proposal.finalSubmission?.submittedAt, note: null },
                        ].map((step, i) => (
                          <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${
                            step.rejected ? 'bg-red-50 border-red-200' : step.done ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'
                          }`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2 ${
                              step.rejected ? 'border-red-400 bg-red-100' : step.done ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'
                            }`}>{step.rejected ? '❌' : step.done ? '✓' : step.icon}</div>
                            <div className="flex-1">
                              <p className={`font-bold text-sm ${step.rejected ? 'text-red-800' : step.done ? 'text-green-900' : 'text-gray-600'}`}>{step.label}</p>
                              {step.timestamp && <p className="text-xs text-gray-400 mt-0.5">{new Date(step.timestamp).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>}
                              {step.note && <p className="text-xs mt-1.5 text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-100">{step.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Members */}
                    {proposal.teamMembers?.length > 0 && (
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> Team Members ({proposal.teamMembers.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {proposal.teamMembers.map((m, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl font-extrabold text-indigo-700 shrink-0">{m.name?.[0]?.toUpperCase() || '?'}</div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-gray-900 text-sm truncate">{m.name}</p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{m.email}</p>
                                <p className="text-xs text-gray-500 mt-1 font-semibold">{m.course} — {m.branch} Yr{proposal.studentId?.year} Sec-{m.section}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── 5. SUBMISSION & FILES ── */}
            {activeTab === 'submission' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {!proposal ? (
                  <div className="py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 font-medium">Please submit a proposal first.</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8">
                    {/* File Upload Form */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-blue-500" /> Upload Deliverable</h3>
                        {['Rejected (HOD)', 'Rejected (Faculty)'].includes(proposal.status) ? (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium leading-relaxed">
                             ❌ Cannot upload files. Your project proposal was rejected/requires revisions.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">File Type *</label>
                              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none" value={selectedFileType} onChange={e => setSelectedFileType(e.target.value)}>
                                {FILE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                              </select>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 transition relative">
                              <input type="file" required onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading}/>
                              <div className="space-y-2">
                                <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                                <p className="text-sm font-bold text-gray-900">{uploading ? 'Uploading...' : 'Choose deliverables to upload'}</p>
                                <p className="text-xs text-gray-400">PDF, PPTX, Word, or ZIP up to 50MB</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Final Submission Links */}
                      {proposal.status === 'Faculty Accepted' && (
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-green-500" /> Final Project Submission</h3>
                          <form onSubmit={handleFinalSubmit} className="space-y-4">
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Live Prototype Link</label>
                              <input type="url" placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" value={finalForm.liveLink} onChange={e => setFinalForm({...finalForm, liveLink: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">GitHub Repository Link *</label>
                              <input type="url" required placeholder="https://github.com/..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" value={finalForm.githubLink} onChange={e => setFinalForm({...finalForm, githubLink: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">LinkedIn Presentation Link</label>
                              <input type="url" placeholder="https://linkedin.com/..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" value={finalForm.linkedinLink} onChange={e => setFinalForm({...finalForm, linkedinLink: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all">Submit Final Project</button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Submissions List */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Submission Deliverables History</h3>
                      {files.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 italic">No files uploaded yet. Select a file type and upload deliverables.</div>
                      ) : (
                        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                          {files.map(f => (
                            <div key={f._id} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 font-bold"><FileText className="w-4.5 h-4.5" /></div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{f.fileName}</p>
                                  <p className="text-[10px] text-gray-400">Type: <span className="font-semibold uppercase">{f.fileType}</span> • Version: v{f.version}</p>
                                  <p className="text-[10px] text-gray-400">Uploaded: {new Date(f.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <a href={f.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-gray-200 shadow-sm transition"><Download className="w-4 h-4" /></a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 6. ANNOUNCEMENTS ── */}
            {activeTab === 'announcements' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-gray-900 font-extrabold text-base">Department Announcements</h3>
                <div className="space-y-3">
                  {data.announcements && data.announcements.length > 0 ? (
                    data.announcements.map(ann => (
                      <div key={ann._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase">{ann.targetAudience === 'all' ? 'All Users' : ann.targetAudience}</span>
                        </div>
                        <h4 className="text-gray-900 font-bold text-sm">{ann.title}</h4>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{ann.content}</p>
                        <p className="text-gray-400 text-xs mt-2">Published: {new Date(ann.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-400 italic bg-white border border-gray-100 rounded-2xl">No announcements from your department HOD yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* ── 7. MY PROFILE ── */}
            {activeTab === 'profile' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">My Profile Credentials</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl">
                      {data.profile?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                      <h4 className="text-xl font-extrabold text-gray-900">{data.profile?.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{data.profile?.email} • {data.profile?.mobileNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-wider">{data.profile?.course} — {data.profile?.branch} Dept.</p>
                      <p className="text-xs text-gray-400">Year {data.profile?.year || 'N/A'} • Sec-{data.profile?.section || 'N/A'}</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">GitHub Profile Link</label>
                        <input type="url" placeholder="https://github.com/..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none" value={profileForm.githubId} onChange={e => setProfileForm({...profileForm, githubId: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">LinkedIn Profile Link</label>
                        <input type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none" value={profileForm.linkedinId} onChange={e => setProfileForm({...profileForm, linkedinId: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Portfolio Website URL</label>
                      <input type="url" placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none" value={profileForm.portfolioLink} onChange={e => setProfileForm({...profileForm, portfolioLink: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Supporting Resume (PDF only)</label>
                      <div className="flex items-center gap-3">
                        <input type="file" ref={resumeRef} accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
                        <button type="button" onClick={() => resumeRef.current.click()} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold transition flex items-center gap-2"><Upload className="w-4 h-4 text-blue-500" /> Select PDF</button>
                        <span className="text-xs text-gray-400 truncate">{resumeFile ? resumeFile.name : data.profile?.resume?.url ? 'Resume PDF Uploaded' : 'No file chosen'}</span>
                      </div>
                    </div>
                    <button type="submit" disabled={updatingProfile} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">{updatingProfile ? 'Saving...' : 'Save Profile Changes'}</button>
                  </form>
                </div>
              </div>
            )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Extension Modal (Task 6) */}
      {extensionModal.open && extensionModal.deadline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Request Deadline Extension</h2>
              <button onClick={() => setExtensionModal({ open: false, deadline: null })} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleExtensionSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700">
                🚀 Requesting extension for milestone: <strong>{extensionModal.deadline.title}</strong> (Due {new Date(extensionModal.deadline.dueDate).toLocaleDateString()})
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Requested Target Date *</label>
                <input required type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={extForm.requestedDate} onChange={e => setExtForm({...extForm, requestedDate: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Reason (min 20 characters) *</label>
                <textarea required rows={3} placeholder="Explain why you need this extension..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" value={extForm.reason} onChange={e => setExtForm({...extForm, reason: e.target.value})} />
                <p className="text-[10px] text-gray-400 mt-1">{extForm.reason.length}/20 chars min</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Optional Supporting Document (PDF / DOCX)</label>
                <input type="file" accept=".pdf,.doc,.docx" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs" onChange={e => setExtForm({...extForm, document: e.target.files[0]})} />
              </div>
              <button type="submit" disabled={extSubmitting} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-500/20">{extSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Smart Deadline Popup reminders (Task 7) */}
      <AnimatePresence>
        {reminderPopup.open && reminderPopup.deadline && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
              
              {/* Header based on urgency */}
              {reminderPopup.type === 'today' && (
                <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                  <h3 className="text-xl font-extrabold">🚨 Submission Deadline is TODAY!</h3>
                  <p className="text-white/80 text-xs mt-1">Submit your deliverables immediately to prevent late penalties.</p>
                </div>
              )}
              {reminderPopup.type === 'urgent' && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                  <Clock className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                  <h3 className="text-xl font-extrabold">⚠️ Urgent Reminder: 2 Days Left!</h3>
                  <p className="text-white/80 text-xs mt-1">Review the submission checklist below carefully.</p>
                </div>
              )}
              {reminderPopup.type === 'motivational' && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 animate-spin-slow" />
                  <h3 className="text-xl font-extrabold">🚀 Project Milestone Approaching: 10 Days Left</h3>
                  <p className="text-white/80 text-xs mt-1">Keep up the steady momentum, team!</p>
                </div>
              )}

              {/* Body Content */}
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Milestone Target</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{reminderPopup.deadline.title}</p>
                  <p className="text-xs text-gray-400">Description: {reminderPopup.deadline.description || 'Deliver project target documentation.'}</p>
                  <p className="text-xs font-black text-red-600 mt-2">Due Date: {new Date(reminderPopup.deadline.dueDate).toLocaleString()}</p>
                </div>

                {/* Specific Popups Features */}
                {reminderPopup.type === 'motivational' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800 leading-relaxed space-y-2">
                    <p className="font-bold flex items-center gap-1"><Sparkles className="w-4 h-4 text-blue-600"/> Milestone Preparation Guidance:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Draft the main proposal/report architecture with your members.</li>
                      <li>Finalize the basic code prototypes and compile references.</li>
                      <li>Sync up with your Faculty Supervisor to clear conceptual blocker reviews.</li>
                    </ul>
                  </div>
                )}

                {reminderPopup.type === 'urgent' && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 space-y-2">
                    <p className="font-bold flex items-center gap-1"><Info className="w-4 h-4 text-amber-600"/> Submission Preparation Checklist:</p>
                    <div className="space-y-1.5 font-medium pl-1">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-amber-600" /> Deliverable documentation PDF cleared and proofread.</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-amber-600" /> Git codebase pushed and branches unified.</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-amber-600" /> Presentation (PPT) prepared and slide counts verified.</label>
                    </div>
                  </div>
                )}

                {reminderPopup.type === 'today' && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-800 leading-relaxed font-bold">
                    ⚠️ CRITICAL: Today is the final date. Head over to the Submission & Files tab, attach your deliverables, or post progress timeline updates immediately to avoid grading deductions!
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={dismissPopup} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-2xl transition">Mark as Read (Dismiss)</button>
                  <button onClick={() => { setReminderPopup({ open: false, deadline: null, type: '' }); setActiveTab('submission'); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition">Go to Submissions</button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
