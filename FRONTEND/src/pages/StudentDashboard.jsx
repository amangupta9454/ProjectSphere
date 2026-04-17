import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, LayoutDashboard, FolderOpen, Upload, LineChart,
  Bell, CheckCircle, XCircle, Clock, User, BookOpen,
  FileText, Paperclip, Link2, AlertCircle, RefreshCw,
  Download, ChevronRight, MessageSquare, TrendingUp, Calendar,
  Users, Target, Send, Plus, Trash2, Search, CheckSquare, Megaphone, Pin
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../Components/Sidebar';

const TABS = [
  { id: 'overview',      label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'proposal',      label: 'Submit Proposal',   icon: BookOpen },
  { id: 'supervisor',    label: 'Supervisor',        icon: Users },
  { id: 'details',       label: 'Project Details',   icon: Target },
// Tab rename handled via label below
  { id: 'submission',    label: 'Submission & Files', icon: Send },
  { id: 'announcements', label: 'Announcements',     icon: Megaphone },
  { id: 'profile',       label: 'My Profile',        icon: User },
];


const STATUS_META = {
  'Pending HOD Review': { color: 'yellow', label: 'Pending HOD Review', step: 1 },
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

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ profile: null, proposal: null, submissions: [], deadlines: [], notifications: [], unreadCount: 0 });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcements
  const [announcements, setAnnouncements] = useState([]);

  // Tab 2: Proposal
  const [proposalForm, setProposalForm] = useState({ title: '', description: '', domain: '', teamSize: 1, teamMembers: [], referenceLinks: '' });
  const [submitting, setSubmitting] = useState(false);
  
  // Tab 3: Supervisor
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [facultySearch, setFacultySearch] = useState('');
  
  // Tab 4: Targets
  const [newTarget, setNewTarget] = useState({ title: '', description: '' });
  
  // Tab 5: Final
  const [finalForm, setFinalForm] = useState({ liveLink: '', githubLink: '', linkedinLink: '' });

  // Tab 6: Profile
  const [profileForm, setProfileForm] = useState({ githubId: '', linkedinId: '', portfolioLink: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const resumeRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState('document');
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

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
        // Initialize 1 empty member slot if no proposal
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

  // Tab 2: Form Handling
  const handleTeamSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setProposalForm(prev => {
      let members = [...prev.teamMembers];
      if (size > members.length) {
        for (let i = members.length; i < size; i++) {
          members.push({ name: '', email: '', mobileNumber: '', course: prev.teamMembers[0]?.course || 'B.Tech', branch: prev.teamMembers[0]?.branch || 'CSE', section: prev.teamMembers[0]?.section || 'A' });
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
        toast.success('Proposal resubmitted for review!');
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

  // Tab 3: Supervisor
  const handleRequestSupervisor = async (facultyId) => {
    try {
      await api.post(`/student/faculty/request/${facultyId}`);
      toast.success('Supervisor requested successfully!');
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to request supervisor');
    }
  };

  // Tab 4: Targets
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

  // Tab 5: Final Submission
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

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setData(d => ({ ...d, unreadCount: 0, notifications: d.notifications.map(n => ({ ...n, isRead: true })) }));
    } catch {}
  };

  const proposal = data.proposal;
  const statusMeta = proposal ? (STATUS_META[proposal.status] || {}) : {};

  const targetStats = proposal?.targets?.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const chartData = [
    { name: 'Completed', value: targetStats['Completed'] || 0, color: '#10B981' },
    { name: 'Ongoing', value: targetStats['Ongoing'] || 0, color: '#3B82F6' },
    { name: 'Pending', value: targetStats['Pending'] || 0, color: '#F59E0B' },
  ].filter(d => d.value > 0);

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
                    { label: 'Approved', val: proposal?.status === 'HOD Approved' || proposal?.status === 'Faculty Assigned' || proposal?.status === 'Faculty Accepted' || proposal?.status === 'Submitted' ? 1 : 0, color: 'green' },
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
                        <div>
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
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">{proposal.department || 'N/A'}</span>
                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md">Team: {proposal.teamMembers?.length || 0}</span>
                                {proposal.assignedFaculty && <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-md">Supervisor: {proposal.assignedFaculty.name}</span>}
                              </div>
                              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border shadow-sm
                                ${statusMeta.color === 'red' || statusMeta.color === 'orange' ? 'bg-red-50 text-red-700 border-red-200' :
                                  statusMeta.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                  statusMeta.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                {proposal.status.includes('Accepted') || proposal.status === 'Submitted' ? <CheckCircle className="w-4 h-4" /> : proposal.status.includes('Rejected') ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                {proposal.status}
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

                  {/* Right Col: Deadlines */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500" /> Upcoming Deadlines</h3>
                      {data.deadlines.length === 0
                        ? <div className="py-6 text-center text-sm text-gray-400 font-medium">No deadlines mapped.<br/>Enjoy your free time!</div>
                        : <div className="space-y-3">
                          {data.deadlines.map(d => {
                            const due = new Date(d.dueDate);
                            const diffDays = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
                            return (
                              <div key={d._id} className={`flex justify-between items-center p-3.5 rounded-2xl border ${diffDays <= 3 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div>
                                  <p className={`text-sm font-bold ${diffDays <= 3 ? 'text-red-700' : 'text-gray-900'}`}>{d.title}</p>
                                  <p className="text-[11px] font-medium text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3"/> {due.toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${diffDays <= 3 ? 'bg-red-100 text-red-600' : 'bg-white shadow-sm text-gray-600 border border-gray-200'}`}>
                                  {diffDays > 0 ? `${diffDays}d left` : 'Overdue'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      }
                    </div>

                    {/* Project Status Stepper */}
                    {proposal && (
                       <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                         <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Project Progress</h3>
                         {(() => {
                           const steps=['Pending HOD Review','HOD Approved','Faculty Assigned','Faculty Accepted','Submitted'];
                           const labels=['HOD Review','HOD OK','Assigned','Active','Submitted'];
                           const rejected=proposal.status.includes('Rejected');
                           const idx=rejected?0:Math.max(steps.indexOf(proposal.status),0);
                           return(
                             <div className="flex items-center gap-1">
                               {steps.map((s,i)=>(
                                 <React.Fragment key={s}>
                                   <div className={`flex flex-col items-center text-center min-w-[52px] ${i<=idx&&!rejected?'opacity-100':'opacity-30'}`}>
                                     <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i<idx?'bg-green-50 border-green-400 text-green-700':i===idx&&!rejected?'bg-blue-50 border-blue-500 ring-4 ring-blue-100':'bg-gray-50 border-gray-200'}`}>
                                       {i<idx?'✓':i+1}
                                     </div>
                                     <p className="text-[9px] font-bold text-gray-600 mt-1">{labels[i]}</p>
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
                     <p className="text-blue-700 mt-2 max-w-md">Your proposal is currently in the <strong>{proposal.status}</strong> stage. You cannot edit it unless it gets rejected. Head to the Project Details tab to view it.</p>
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
                      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"/>
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
                {/* Assigned Supervisor */}
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
                            <a href={`mailto:${proposal.assignedFaculty.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition"><Link2 className="w-4 h-4" /> {proposal.assignedFaculty.email}</a>
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                       <User className="w-12 h-12 text-gray-300 mb-3" />
                       <h3 className="text-lg font-bold text-gray-700">No Supervisor Assigned</h3>
                       <p className="text-sm font-medium text-gray-500 mt-1 max-w-sm">You haven't been assigned a supervisor yet. Browse available faculty below and send a request.</p>
                     </div>
                   )}
                </div>

                {/* Available Supervisors */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Search className="w-4 h-4 text-blue-500" /> Available Supervisors</h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search by name or dept..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={facultySearch} onChange={e => setFacultySearch(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableFaculty.filter(f => f.name.toLowerCase().includes(facultySearch.toLowerCase()) || f.department.toLowerCase().includes(facultySearch.toLowerCase())).map(faculty => (
                      <div key={faculty._id} className="p-5 border border-gray-100 rounded-2xl hover:shadow-md transition-all bg-white relative overflow-hidden group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                          <span className="text-lg font-extrabold text-blue-700">{faculty.name[0]}</span>
                        </div>
                        <h4 className="font-extrabold text-gray-900 leading-tight">{faculty.name}</h4>
                        <p className="text-xs font-bold text-gray-500 mb-2">{faculty.department} • {faculty.designation || 'Faculty'}</p>
                        <p className="text-[11px] font-medium text-gray-400 line-clamp-2">{faculty.specialization || 'General Specialization'}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500"><span className="text-blue-600">{faculty.activeProjectsCount}</span> / {faculty.maxStudents || 5} slots</span>
                          <button 
                            onClick={() => handleRequestSupervisor(faculty._id)} 
                            disabled={!faculty.isAvailable || !!proposal?.assignedFaculty || proposal?.supervisorRequested}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            Request
                          </button>
                        </div>
                      </div>
                    ))}
                    {availableFaculty.length === 0 && <div className="col-span-full py-10 text-center text-gray-400 font-medium">No available supervisors found.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. PROJECT DETAILS & STATUS ── */}
            {activeTab === 'details' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                {!proposal ? (
                  <div className="py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 font-medium">Please submit a proposal first.</div>
                ) : (
                  <>
                    {/* Proposal Info */}
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

                    {/* Status Timeline */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Status Timeline</h3>
                      <div className="space-y-3">
                        {[
                          { status: 'Pending HOD Review', label: 'Proposal Submitted', icon: '📝', done: true, timestamp: proposal.createdAt, note: null },
                          { status: 'HOD Approved',       label: 'HOD Review', icon: '🏛️', done: ['HOD Approved','Faculty Assigned','Faculty Accepted','Submitted'].includes(proposal.status), rejected: proposal.status === 'Rejected (HOD)', timestamp: proposal.hodReview?.reviewedAt, note: proposal.hodReview?.comment },
                          { status: 'Faculty Assigned',   label: 'Faculty Assigned', icon: '👨‍🏫', done: ['Faculty Assigned','Faculty Accepted','Submitted'].includes(proposal.status), timestamp: null, note: proposal.assignedFaculty ? `Assigned: ${proposal.assignedFaculty.name}` : null },
                          { status: 'Faculty Accepted',   label: 'Faculty Review', icon: '✅', done: ['Faculty Accepted','Submitted'].includes(proposal.status), rejected: proposal.status === 'Rejected (Faculty)', timestamp: proposal.facultyReview?.reviewedAt, note: proposal.facultyReview?.comment },
                          { status: 'Submitted',          label: 'Final Submitted', icon: '🏁', done: proposal.status === 'Submitted', timestamp: proposal.finalSubmission?.submittedAt, note: null },
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
                                <p className="font-bold text-gray-900 truncate">{m.name}</p>
                                <p className="text-xs text-gray-500 truncate">{m.email}</p>
                                <div className="flex gap-2 mt-1.5 flex-wrap">
                                  {m.course && <span className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">{m.course}</span>}
                                  {m.branch && <span className="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-md">{m.branch}</span>}
                                  {m.section && <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">Sec {m.section}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Faculty Feedback */}
                    {proposal.facultyFeedback?.length > 0 && (
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Supervisor Feedback</h3>
                        <div className="space-y-3">
                          {[...proposal.facultyFeedback].reverse().map((f, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">{proposal.assignedFaculty?.name?.[0] || 'F'}</div>
                              <div>
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">{f.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(f.addedAt).toLocaleString()}</p>
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
                 <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-50 to-blue-50 rounded-bl-full -z-10"></div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-purple-100 rounded-xl text-purple-600 shadow-sm"><Send className="w-6 h-6"/></div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Final Submission & Project Files</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Submit your final project links and upload all necessary documents in one place.</p>
                      </div>
                    </div>

                    {!proposal || !['Faculty Accepted', 'Submitted'].includes(proposal.status) ? (
                      <div className="py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3"/>
                        <p className="text-sm font-bold text-gray-700">Submission Locked</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">Your project must be "Faculty Accepted" to make final submissions and upload files.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Link Submission */}
                        <div>
                          <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Link2 className="w-4 h-4 text-purple-500"/> Project Links</h3>
                          {proposal?.status === 'Submitted' && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-bold flex items-center gap-2">
                              <CheckCircle className="w-4 h-4"/> Links officially submitted!
                            </div>
                          )}
                          <form onSubmit={handleFinalSubmit} className="space-y-5">
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Live Application Link <span className="text-red-400">*</span></label>
                              <input required type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-purple-500" placeholder="https://myproject.vercel.app" value={finalForm.liveLink} onChange={e => setFinalForm({...finalForm, liveLink: e.target.value})} disabled={proposal.status === 'Submitted' && proposal.finalSubmission?.status !== 'Rejected'}/>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-1.5 block">GitHub Repository <span className="text-red-400">*</span></label>
                              <input required type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-purple-500" placeholder="https://github.com/user/repo" value={finalForm.githubLink} onChange={e => setFinalForm({...finalForm, githubLink: e.target.value})} disabled={proposal.status === 'Submitted'}/>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-1.5 block">LinkedIn Showcase (Optional)</label>
                              <input type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-purple-500" placeholder="https://linkedin.com/post/..." value={finalForm.linkedinLink} onChange={e => setFinalForm({...finalForm, linkedinLink: e.target.value})} disabled={proposal.status === 'Submitted'}/>
                            </div>
                            {(proposal.status !== 'Submitted' || proposal.finalSubmission?.status === 'Rejected') && (
                              <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
                                 <Send className="w-4 h-4"/> {proposal.finalSubmission?.status === 'Rejected' ? 'Re-Submit Links' : 'Submit Links'}
                              </button>
                            )}
                          </form>
                        </div>

                        {/* Right Column: File Upload */}
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                          <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-blue-500" /> Upload Documents</h3>
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            {FILE_TYPES.map(({ value, label, icon: Icon }) => (
                              <button key={value} type="button" onClick={() => setSelectedFileType(value)}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col items-center justify-center text-center ${selectedFileType === value ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-200'}`}>
                                <Icon className={`w-5 h-5 mb-1.5 ${selectedFileType === value ? 'text-blue-600' : 'text-gray-400'}`} />
                                <p className={`text-[10px] font-bold ${selectedFileType === value ? 'text-blue-800' : 'text-gray-500'}`}>{label}</p>
                              </button>
                            ))}
                          </div>
                          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${uploading ? 'border-blue-300 bg-blue-50/50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'}`}>
                            {uploading
                              ? <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                              : <Upload className="w-8 h-8 text-blue-400 mb-3" />
                            }
                            <p className="text-xs font-bold text-gray-700 text-center">{uploading ? 'Uploading...' : 'Click or drop files here'}</p>
                            <p className="text-[10px] text-gray-400 mt-1">You can select multiple files</p>
                            <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                          </label>
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Uploaded Files Manager */}
                 {proposal && ['Faculty Accepted', 'Submitted'].includes(proposal.status) && (
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                     <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                       <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2"><FolderOpen className="w-4 h-4 text-blue-500" /> Uploaded History</h3>
                       <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">{files.length} items</span>
                     </div>
                     {files.length === 0 ? (
                       <div className="p-8 text-center text-gray-400 font-medium text-sm">No documents uploaded yet.</div>
                     ) : (
                       <div className="divide-y divide-gray-50">
                         {files.map(f => (
                           <div key={f._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                             <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                               <FileText className="w-5 h-5 text-blue-500" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-gray-900 truncate">{f.fileName}</p>
                               <div className="flex flex-wrap items-center gap-2 mt-1">
                                 <span className="text-[10px] font-extrabold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{f.fileType}</span>
                                 <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">v{f.version}</span>
                                 <span className="text-[10px] font-bold text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                               </div>
                             </div>
                             <a href={f.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white hover:bg-blue-50 text-blue-600 rounded-xl border border-gray-200 hover:border-blue-200 transition-all shadow-sm">
                               <Download className="w-4 h-4" />
                             </a>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
              </div>
            )}

           </motion.div>
         </AnimatePresence>
       </div>
       
       <AnimatePresence>
         {activeTab === 'profile' && (
           <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto w-full absolute inset-0 top-[73px] bg-slate-50 overflow-auto z-10">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="flex flex-col items-center shrink-0 w-full md:w-64">
                      {data.profile?.profilePhoto?.url ? (
                         <img src={data.profile.profilePhoto.url} className="w-40 h-40 rounded-[2rem] object-cover ring-4 ring-blue-50 shadow-xl mb-4" />
                      ) : (
                         <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-xl mb-4 ring-4 ring-blue-50">
                            {data.profile?.name?.[0].toUpperCase()}
                         </div>
                      )}
                      <h2 className="text-2xl font-black text-gray-900 text-center">{data.profile?.name}</h2>
                      <p className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full mt-2">{data.profile?.enrollmentNumber || 'No Enrollment ID'}</p>
                      
                      <div className="w-full mt-6 space-y-2">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center">
                           <span className="text-[10px] uppercase font-black text-gray-400 mb-0.5">Course</span>
                           <span className="text-sm font-bold text-gray-800">{data.profile?.course} • {data.profile?.branch}</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center">
                           <span className="text-[10px] uppercase font-black text-blue-400 mb-0.5">Year</span>
                           <span className="text-sm font-bold text-blue-800">Year {data.profile?.year} • Sec {data.profile?.section}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><User className="w-5 h-5"/></div>
                        <h3 className="text-lg font-black text-gray-900">Manage Profile Links</h3>
                      </div>
                      
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-700 mb-1.5 block">GitHub Profile</label>
                            <input type="url" placeholder="https://github.com/..." className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
                              value={profileForm.githubId} onChange={e => setProfileForm(p => ({...p, githubId: e.target.value}))} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 mb-1.5 block">LinkedIn Profile</label>
                            <input type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
                              value={profileForm.linkedinId} onChange={e => setProfileForm(p => ({...p, linkedinId: e.target.value}))} />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Personal Portfolio</label>
                            <input type="url" placeholder="https://mywebsite.com" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
                              value={profileForm.portfolioLink} onChange={e => setProfileForm(p => ({...p, portfolioLink: e.target.value}))} />
                          </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-700 mb-3 block">Resume Upload (PDF/Document)</label>
                          {data.profile?.resume?.url && (
                             <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                               <div className="flex items-center gap-2 text-indigo-700">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs font-bold">Current Resume Uploaded</span>
                               </div>
                               <a href={data.profile.resume.url} target="_blank" className="text-[10px] font-black uppercase px-3 py-1 bg-white text-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-all">View</a>
                             </div>
                          )}
                          <label className={`block border-2 ${resumeFile ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-white hover:bg-gray-50'} rounded-2xl p-4 text-center cursor-pointer transition-all`}>
                            <input type="file" ref={resumeRef} className="hidden" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
                            {resumeFile ? (
                              <p className="text-sm font-bold text-blue-700 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4"/> {resumeFile.name}</p>
                            ) : (
                              <p className="text-sm font-medium text-gray-500 flex flex-col items-center gap-2"><Upload className="w-5 h-5 text-gray-400"/> Select a new file to replace</p>
                            )}
                          </label>
                        </div>

                        <button disabled={updatingProfile} type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                           {updatingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><RefreshCw className="w-4 h-4"/> Save Profile</>}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
           </motion.div>
         )}

         {/* ═══════════════════════ ANNOUNCEMENTS (Read-Only) ═══════════════════════ */}
         {activeTab === 'announcements' && (
           <motion.div key="announcements" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
             className="max-w-3xl mx-auto" onViewportEnter={() => {
               api.get('/announcements').then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
             }}>
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-100 rounded-xl"><Megaphone className="w-5 h-5 text-blue-600" /></div>
               <div>
                 <h2 className="text-gray-900 font-bold text-base">Announcements</h2>
                 <p className="text-gray-400 text-xs">Updates from Admin, HOD, and Faculty</p>
               </div>
             </div>
             <div className="space-y-3">
               {announcements.length === 0 && (
                 <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                   <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                   <p className="text-gray-400 text-sm">No announcements yet. Check back later.</p>
                 </div>
               )}
               {announcements.map(ann => (
                 <div key={ann._id} className={`bg-white rounded-2xl border p-5 ${ann.pinned ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'} shadow-sm`}>
                   <div className="flex items-center gap-2 mb-2 flex-wrap">
                     {ann.pinned && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                       ann.createdByRole === 'admin' ? 'bg-rose-100 text-rose-600' :
                       ann.createdByRole === 'hod' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
                     }`}>{ann.createdByRole}</span>
                   </div>
                   <h3 className="text-gray-900 font-bold text-sm mb-1">{ann.title}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                   <p className="text-gray-400 text-xs mt-3">Posted by <span className="font-semibold">{ann.createdByName}</span> · {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                 </div>
               ))}
             </div>
           </motion.div>
         )}

       </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentDashboard;
