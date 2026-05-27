import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, GraduationCap, LayoutDashboard, FolderOpen, Bell,
  CheckCircle, XCircle, FileText, RefreshCw, MessageSquare,
  Clock, Send, AlertCircle, Download, Calendar,
  Megaphone, Pin, Plus, X, Trash2, Users, Search,
  Filter, ChevronDown, ChevronUp, ExternalLink, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import Sidebar from '../Components/Sidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const TABS = [
  { id: 'overview',      label: 'Overview',       icon: LayoutDashboard },
  { id: 'projects',      label: 'My Projects',    icon: FolderOpen },
  { id: 'pending',       label: 'Pending Review', icon: Clock },
  { id: 'students',      label: 'My Students',    icon: Users },
  { id: 'extensions',    label: 'Extensions',     icon: Calendar },
  { id: 'announcements', label: 'Announcements',  icon: Megaphone },
];

const STATUS_BADGE = {
  'Faculty Accepted': 'bg-green-50 text-green-700 border-green-200',
  'Faculty Assigned': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Submitted':        'bg-purple-50 text-purple-700 border-purple-200',
};

const DONUT_COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const STATUS_STEPS = [
  { key: 'Pending HOD Review',   label: 'Submitted',        icon: '📝' },
  { key: 'HOD Approved',         label: 'HOD Approved',     icon: '✅' },
  { key: 'Faculty Assigned',     label: 'Faculty Assigned', icon: '👨‍🏫' },
  { key: 'Faculty Accepted',     label: 'Active',           icon: '🚀' },
  { key: 'Submitted',            label: 'Final Submitted',  icon: '🏁' },
];

const getStepIndex = (status) => {
  const order = ['Pending HOD Review','HOD Approved','Faculty Assigned','Faculty Accepted','Submitted'];
  return order.indexOf(status);
};

const FacultyDashboard = () => {
  const [activeTab, setActiveTab]       = useState('overview');
  const [data, setData]                 = useState({ 
    profile: null, 
    activeProjects: [], 
    pendingProposals: [], 
    projectFiles: {}, 
    recentSubmissions: [], 
    deadlines: [], 
    notifications: [],
    analytics: {},
    extensionRequests: []
  });
  const [loading, setLoading]           = useState(true);
  
  // Existing states
  const [feedbackInput, setFeedbackInput] = useState({});
  const [submitting, setSubmitting]     = useState({});
  const [rejectModal, setRejectModal]   = useState({ id: null, reason: '', type: 'proposal' }); // type: 'proposal' | 'submission'
  const [deadlineModal, setDeadlineModal] = useState({ open: false, title: '', description: '', dueDate: '', targetProjects: [] });
  const [expandedProjects, setExpandedProjects] = useState({});
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [pendingSearch, setPendingSearch] = useState('');
  
  // Announcements states
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm]           = useState({ title: '', content: '', targetAudience: 'all', pinned: false });
  const [showAnnForm, setShowAnnForm]   = useState(false);
  const [annSubmitting, setAnnSubmitting] = useState(false);

  // New Upgrade states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch]     = useState('');
  const [studentBranch, setStudentBranch]     = useState('all');
  const [timelineComment, setTimelineComment] = useState({});
  const [timelineSubmitting, setTimelineSubmitting] = useState({});
  const [extensionRemarks, setExtensionRemarks] = useState({});
  const [extensionResolving, setExtensionResolving] = useState({});

  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/faculty/dashboard');
      setData(res.data);
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) handleLogout();
      else toast.error('Failed to load dashboard.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => {
    if (activeTab === 'announcements') {
      api.get('/announcements').then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
    }
  }, [activeTab]);

  const acceptProposal = async (id) => {
    try { await api.put(`/faculty/proposals/${id}/accept`); toast.success('Proposal accepted! Email sent to student.'); fetchDashboard(); }
    catch { toast.error('Action failed'); }
  };

  const rejectProposal = async () => {
    if (!rejectModal.reason || rejectModal.reason.length < 20) return toast.error('Reason must be at least 20 characters');
    try {
      const endpoint = rejectModal.type === 'submission'
        ? `/faculty/proposals/${rejectModal.id}/reject-submission`
        : `/faculty/proposals/${rejectModal.id}/reject`;
      await api.put(endpoint, { reason: rejectModal.reason });
      toast.success(rejectModal.type === 'submission' ? 'Submission rejected. Student notified.' : 'Proposal rejected.');
      setRejectModal({ id: null, reason: '', type: 'proposal' });
      fetchDashboard();
    } catch (e) { toast.error(e.response?.data?.message || 'Action failed'); }
  };

  const submitFeedback = async (id) => {
    const message = feedbackInput[id];
    if (!message || message.trim().length < 5) return toast.error('Feedback must be at least 5 characters');
    setSubmitting(s => ({ ...s, [id]: true }));
    try {
      await api.post(`/faculty/proposals/${id}/feedback`, { message });
      toast.success('Feedback sent!');
      setFeedbackInput(f => ({ ...f, [id]: '' }));
      fetchDashboard();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSubmitting(s => ({ ...s, [id]: false })); }
  };

  const submitTargetedDeadline = async (e) => {
    e.preventDefault();
    if (deadlineModal.targetProjects.length === 0) return toast.error('Select at least one project.');
    try {
      await api.post('/faculty/deadlines', { title: deadlineModal.title, description: deadlineModal.description, dueDate: deadlineModal.dueDate, targetProjects: deadlineModal.targetProjects });
      toast.success('Deadline assigned & students notified!');
      setDeadlineModal({ open: false, title: '', description: '', dueDate: '', targetProjects: [] });
      fetchDashboard();
    } catch { toast.error('Failed to assign deadline'); }
  };

  // Timeline comments submit handler
  const handleTimelineCommentSubmit = async (proposalId, timelineId) => {
    const comment = timelineComment[`${proposalId}_${timelineId}`];
    if (!comment || comment.trim().length < 2) return toast.error('Comment must be at least 2 characters.');
    
    setTimelineSubmitting(prev => ({ ...prev, [`${proposalId}_${timelineId}`]: true }));
    try {
      const res = await api.post(`/faculty/proposals/${proposalId}/timeline/${timelineId}/comment`, { comment: comment.trim() });
      toast.success('Comment added successfully!');
      
      // Update selectedStudent project timeline inline if modal is currently open
      if (selectedStudent && selectedStudent.project._id === proposalId) {
        const updatedProject = res.data.proposal;
        setSelectedStudent(prev => ({
          ...prev,
          project: updatedProject
        }));
      }

      setTimelineComment(prev => ({ ...prev, [`${proposalId}_${timelineId}`]: '' }));
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add comment');
    } finally {
      setTimelineSubmitting(prev => ({ ...prev, [`${proposalId}_${timelineId}`]: false }));
    }
  };

  // Extension request resolve handler
  const handleExtensionResolve = async (requestId, status) => {
    const remarks = extensionRemarks[requestId] || '';
    setExtensionResolving(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.put(`/faculty/extensions/${requestId}/resolve`, { status, remarks });
      toast.success(`Extension request marked as ${status}!`);
      fetchDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed');
    } finally {
      setExtensionResolving(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const toggleExpand = (id) => setExpandedProjects(p => ({ ...p, [id]: !p[id] }));

  // Helper to compile list of unique supervised students
  const getSupervisedStudents = () => {
    const list = [];
    (data.activeProjects || []).forEach(p => {
      // Add Leader
      if (p.studentId) {
        list.push({
          _id: p.studentId._id,
          name: p.studentId.name,
          email: p.studentId.email,
          branch: p.studentId.branch || p.department,
          course: p.studentId.course || 'B.Tech',
          year: p.studentId.year || '4',
          section: p.studentId.section || 'A',
          mobileNumber: p.studentId.mobileNumber,
          profilePhoto: p.studentId.profilePhoto,
          role: 'Team Leader',
          project: p
        });
      }
      // Add Members
      (p.teamMembers || []).forEach(m => {
        list.push({
          _id: m._id || m.email,
          name: m.name,
          email: m.email,
          branch: m.branch || p.department,
          course: m.course || 'B.Tech',
          year: p.studentId?.year || '4',
          section: m.section || p.studentId?.section || 'A',
          mobileNumber: m.mobileNumber,
          profilePhoto: null,
          role: 'Team Member',
          project: p
        });
      });
    });
    return list;
  };

  const filteredProjects = (data.activeProjects || []).filter(p => {
    const matchSearch = !projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.studentId?.name?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchFilter = projectFilter === 'all' || p.status === projectFilter;
    return matchSearch && matchFilter;
  });

  const filteredPending = (data.pendingProposals || []).filter(p =>
    !pendingSearch || p.title.toLowerCase().includes(pendingSearch.toLowerCase()) || p.studentId?.name?.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar navItems={TABS} user={data.profile} role="faculty" onLogout={handleLogout}
        unreadCount={data.notifications?.filter(n => !n.isRead).length || 0}
        activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 capitalize">{TABS.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-xs text-gray-400 font-medium">Faculty Management Panel</p>
          </div>
          <button onClick={fetchDashboard} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-gray-200 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* ── METRIC CARDS ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Supervised Students', value: data.analytics?.totalStudents || 0, color: 'indigo', icon: Users, sub: 'Active Members' },
                    { label: 'Completed Projects',  value: data.analytics?.completedProjects || 0, color: 'green', icon: CheckCircle, sub: 'Submitted' },
                    { label: 'Pending Reviews',  value: data.analytics?.pendingReviewsCount || 0, color: 'amber', icon: Clock, sub: 'Proposals' },
                    { label: 'Upcoming Deadlines', value: data.analytics?.upcomingDeadlinesCount || 0, color: 'purple', icon: Calendar, sub: 'Targeted & Global' },
                  ].map(({ label, value, color, icon: Icon, sub }) => (
                    <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                        <div className={`p-2 bg-${color}-50 rounded-xl`}><Icon className={`w-4 h-4 text-${color}-500`} /></div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* ── RECHARTS ANALYTICS GRAPHICS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Weekly Progress Activity */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Weekly Progress Activity</h3>
                    <div className="h-56">
                      {!data.analytics?.weeklyActivity || data.analytics.weeklyActivity.reduce((acc, c) => acc + c.updates, 0) === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">No progress timeline logs yet.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.analytics.weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="updates" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Department Distribution Donut */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Department Distribution</h3>
                    <div className="h-56">
                      {!data.analytics?.deptData || data.analytics.deptData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">No active projects assigned.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={data.analytics.deptData} 
                              cx="50%" cy="50%" 
                              innerRadius={50} 
                              outerRadius={75} 
                              paddingAngle={2} 
                              dataKey="value"
                            >
                              {data.analytics.deptData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} layout="horizontal" verticalAlign="bottom" align="center" />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Student Progress Analytics */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Student Project Progress</h3>
                    <div className="h-56">
                      {!data.analytics?.progressData || data.analytics.progressData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">No project progress to display.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.analytics.progressData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={60} />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="progress" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deadlines */}
                  {data.deadlines?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500" /> Active Deadlines</h3>
                      <div className="space-y-2">
                        {data.deadlines.map(d => {
                          const diff = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
                          return (
                            <div key={d._id} className={`flex justify-between items-center p-3 rounded-xl border ${diff <= 3 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div>
                                <p className={`text-sm font-bold ${diff <= 3 ? 'text-red-700' : 'text-gray-900'}`}>{d.title}</p>
                                <p className="text-xs text-gray-400">{new Date(d.dueDate).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diff <= 3 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 border border-gray-200'}`}>{diff > 0 ? `${diff}d left` : 'Overdue'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent Submissions */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-gray-900 text-sm">Recent Student Uploads</h3></div>
                    {!data.recentSubmissions?.length
                      ? <div className="p-8 text-center text-gray-400 text-sm">No files submitted yet.</div>
                      : <div className="divide-y divide-gray-50">
                        {data.recentSubmissions.map(f => (
                          <div key={f._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-blue-500" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{f.fileName}</p>
                              <p className="text-xs text-gray-400">By {f.studentId?.name} • {f.fileType} • v{f.version}</p>
                            </div>
                            <a href={f.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"><Download className="w-4 h-4" /></a>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── MY PROJECTS ── */}
            {activeTab === 'projects' && (
              <div className="space-y-5">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="Search by title or student..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        value={projectSearch} onChange={e => setProjectSearch(e.target.value)} />
                    </div>
                    <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="Faculty Accepted">Active</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>
                  <button onClick={() => setDeadlineModal({ ...deadlineModal, open: true })} disabled={!data.activeProjects?.length}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/20">
                    <Calendar className="w-4 h-4" /> Set Deadline
                  </button>
                </div>

                {!filteredProjects.length
                  ? <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No projects match your search.</div>
                  : filteredProjects.map(p => {
                    const isExpanded = expandedProjects[p._id];
                    const projectFilesArr = data.projectFiles?.[p._id] || [];
                    const isSubmitted = p.status === 'Submitted';
                    const submissionRejected = p.finalSubmission?.status === 'Rejected';
                    const stepIdx = getStepIndex(p.status);
                    return (
                      <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-5 flex items-start justify-between gap-4 flex-wrap cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => toggleExpand(p._id)}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-gray-900">{p.title}</h3>
                              {p.domain && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-semibold border border-indigo-100">{p.domain}</span>}
                            </div>
                            <p className="text-xs text-gray-500">{p.studentId?.name} • {p.studentId?.email} • {p.studentId?.course} {p.studentId?.branch}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[p.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{p.status}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 p-5 space-y-5">
                            {/* Status Steps */}
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Project Progress</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                {STATUS_STEPS.map((step, i) => (
                                  <React.Fragment key={step.key}>
                                    <div className={`flex flex-col items-center text-center min-w-[64px] ${i <= stepIdx ? 'opacity-100' : 'opacity-30'}`}>
                                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 ${i < stepIdx ? 'bg-green-50 border-green-400' : i === stepIdx ? 'bg-indigo-50 border-indigo-500 ring-4 ring-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
                                        {i < stepIdx ? '✓' : step.icon}
                                      </div>
                                      <p className="text-[9px] font-bold text-gray-600 mt-1 leading-tight">{step.label}</p>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 min-w-[12px] ${i < stepIdx ? 'bg-green-400' : 'bg-gray-200'}`} />}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>

                            {/* Team Members */}
                            {p.teamMembers?.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Team Members ({p.teamMembers.length})</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {p.teamMembers.map((m, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">{m.name?.[0]?.toUpperCase() || '?'}</div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{m.email} • {m.branch} {m.section}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Final Submission (if submitted) */}
                            {isSubmitted && p.finalSubmission && (
                              <div className={`p-4 rounded-2xl border ${submissionRejected ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                  Final Submission — <span className={submissionRejected ? 'text-red-600' : 'text-green-600'}>{p.finalSubmission.status || 'Under Review'}</span>
                                </p>
                                <div className="flex flex-wrap gap-3 mb-3">
                                  {p.finalSubmission.liveLink && <a href={p.finalSubmission.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100"><ExternalLink className="w-3.5 h-3.5" /> Live Link</a>}
                                  {p.finalSubmission.githubLink && <a href={p.finalSubmission.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-200"><ExternalLink className="w-3.5 h-3.5" /> GitHub</a>}
                                </div>
                                {!submissionRejected && (
                                  <button onClick={() => setRejectModal({ id: p._id, reason: '', type: 'submission' })}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all">
                                    <XCircle className="w-3.5 h-3.5" /> Reject Submission
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Uploaded Files */}
                            {projectFilesArr.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Uploaded Files ({projectFilesArr.length})</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {projectFilesArr.map(f => (
                                    <div key={f._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{f.fileName}</p>
                                        <p className="text-xs text-gray-400">{f.fileType} • v{f.version} • {new Date(f.createdAt).toLocaleDateString()}</p>
                                      </div>
                                      <a href={f.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Download className="w-4 h-4" /></a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Feedback */}
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Add Feedback</p>
                              <div className="flex gap-2">
                                <textarea rows={2} placeholder="Write feedback (min 5 chars)..."
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all"
                                  value={feedbackInput[p._id] || ''} onChange={e => setFeedbackInput(f => ({ ...f, [p._id]: e.target.value }))} />
                                <button onClick={() => submitFeedback(p._id)} disabled={submitting[p._id]}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all min-w-[60px]">
                                  {submitting[p._id] ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" />Send</>}
                                </button>
                              </div>
                            </div>

                            {/* Previous Feedback */}
                            {p.facultyFeedback?.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Previous Feedback ({p.facultyFeedback.length})</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {[...p.facultyFeedback].reverse().map((f, i) => (
                                    <div key={i} className="text-xs text-gray-700 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                                      <p className="font-medium leading-relaxed">{f.message}</p>
                                      <p className="text-gray-400 mt-1">{new Date(f.addedAt).toLocaleString()}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ── PENDING REVIEW ── */}
            {activeTab === 'pending' && (
              <div className="space-y-5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search by title or student name..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} />
                </div>

                {!filteredPending.length
                  ? <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">{pendingSearch ? 'No proposals match your search.' : 'No pending proposals assigned to you.'}</div>
                  : filteredPending.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl p-6 border-l-4 border-l-indigo-500 border border-indigo-100 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900">{p.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{p.studentId?.name} • {p.studentId?.email}</p>
                          <p className="text-xs text-gray-400">{p.studentId?.course} {p.studentId?.branch} • Y{p.studentId?.year} Sec-{p.studentId?.section}</p>
                        </div>
                        {p.domain && <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full border border-indigo-100">{p.domain}</span>}
                      </div>
                      <p className="text-sm text-gray-600 border-l-4 border-indigo-200 pl-3 mb-4 leading-relaxed">{p.description}</p>

                      {/* Team members in pending view */}
                      {p.teamMembers?.length > 0 && (
                        <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1"><Users className="w-3 h-3" /> Team ({p.teamMembers.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {p.teamMembers.map((m, i) => (
                              <span key={i} className="text-xs bg-white text-gray-700 px-2 py-1 rounded-lg border border-gray-200 font-medium">{m.name} ({m.branch})</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.referenceLinks?.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {p.referenceLinks.map((link, i) => <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5" />{link.substring(0, 40)}...</a>)}
                        </div>
                      )}

                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => acceptProposal(p._id)} className="flex items-center gap-2 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-bold transition-all">
                          <CheckCircle className="w-4 h-4" /> Accept Project
                        </button>
                        <button onClick={() => setRejectModal({ id: p._id, reason: '', type: 'proposal' })} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {/* ── MY STUDENTS ── */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-2 flex-wrap flex-1">
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        placeholder="Search student by name or email..." 
                        className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        value={studentSearch} 
                        onChange={e => setStudentSearch(e.target.value)} 
                      />
                    </div>
                    <select 
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" 
                      value={studentBranch} 
                      onChange={e => setStudentBranch(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical Polytechnic">Mechanical Polytechnic</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {getSupervisedStudents().length} Supervised Students
                  </span>
                </div>

                {getSupervisedStudents().length === 0 ? (
                  <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                    No students currently supervised.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getSupervisedStudents().filter(s => {
                      const matchSearch = !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
                      const matchBranch = studentBranch === 'all' || s.branch === studentBranch;
                      return matchSearch && matchBranch;
                    }).map(student => (
                      <div 
                        key={student._id} 
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-inner shrink-0">
                                {student.name[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-gray-900 truncate leading-tight">{student.name}</h4>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{student.course} • {student.branch}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                              student.role === 'Team Leader' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {student.role}
                            </span>
                          </div>

                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project</p>
                            <p className="text-xs text-slate-800 font-bold line-clamp-1">{student.project.title}</p>
                            
                            <div className="flex items-center justify-between mt-3 text-xs">
                              <span className="text-gray-400">Progress</span>
                              <span className="font-bold text-indigo-600">{student.project.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${student.project.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedStudent(student)} 
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" /> View Profile & Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── DEADLINE EXTENSIONS ── */}
            {activeTab === 'extensions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-gray-900 font-bold text-base">Deadline Extension Requests ({data.extensionRequests?.length || 0})</h2>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Pending resolution
                  </span>
                </div>

                {!data.extensionRequests?.length ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
                    No active deadline extension requests at this time.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.extensionRequests.map(req => {
                      const isPending = req.status === 'Pending';
                      return (
                        <div key={req._id} className={`bg-white rounded-2xl border p-5 shadow-sm border-l-4 ${
                          req.status === 'Approved' ? 'border-l-green-500' :
                          req.status === 'Rejected' ? 'border-l-red-500' : 'border-l-amber-500'
                        }`}>
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                    req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                    req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>{req.status}</span>
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                                    {req.deadlineId?.title || 'Milestone'}
                                  </span>
                                </div>
                                <h4 className="text-gray-900 font-bold text-sm leading-tight">{req.projectId?.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">Student: <span className="font-semibold text-gray-600">{req.studentId?.name}</span> ({req.studentId?.email})</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 max-w-md bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
                                <div>
                                  <p className="text-gray-400 font-medium">Current Deadline</p>
                                  <p className="text-slate-800 font-bold mt-0.5">
                                    {req.deadlineId?.dueDate ? new Date(req.deadlineId.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-purple-400 font-medium">Requested Extension</p>
                                  <p className="text-purple-700 font-bold mt-0.5">
                                    {new Date(req.requestedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reason for request</p>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{req.reason}</p>
                              </div>

                              {req.documentUrl && (
                                <a 
                                  href={req.documentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100"
                                >
                                  <FileText className="w-3.5 h-3.5" /> View Supporting Proof
                                </a>
                              )}
                            </div>

                            {isPending && (
                              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 flex flex-col gap-3 justify-center">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Remarks (Optional)</label>
                                  <input 
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter review remarks..."
                                    value={extensionRemarks[req._id] || ''}
                                    onChange={e => setExtensionRemarks(prev => ({ ...prev, [req._id]: e.target.value }))}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleExtensionResolve(req._id, 'Approved')} 
                                    disabled={extensionResolving[req._id]}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md shadow-green-500/10 transition-all disabled:opacity-50"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={() => handleExtensionResolve(req._id, 'Rejected')} 
                                    disabled={extensionResolving[req._id]}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/10 transition-all disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            )}

                            {!isPending && req.remarks && (
                              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 flex flex-col gap-1 justify-center text-xs">
                                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Review Remarks</p>
                                <p className="text-gray-700 italic">"{req.remarks}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── ANNOUNCEMENTS ── */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-900 font-bold text-base">Announcements ({announcements.length})</h2>
                  <button onClick={() => setShowAnnForm(p => !p)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all">
                    <Plus className="w-4 h-4" /> New Announcement
                  </button>
                </div>
                {showAnnForm && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2"><Megaphone className="w-4 h-4 text-indigo-500" /> Create Announcement</h3>
                      <button onClick={() => setShowAnnForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={async (e) => {
                      e.preventDefault(); if (!annForm.title || !annForm.content) return;
                      setAnnSubmitting(true);
                      try {
                        await api.post('/announcements', annForm);
                        toast.success('Announcement published!');
                        setAnnForm({ title: '', content: '', targetAudience: 'all', pinned: false });
                        setShowAnnForm(false);
                        const r = await api.get('/announcements'); setAnnouncements(r.data.announcements || []);
                      } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
                      finally { setAnnSubmitting(false); }
                    }} className="p-5 space-y-4">
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title *</label>
                        <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm" value={annForm.title} onChange={e => setAnnForm(p => ({...p, title: e.target.value}))} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Content *</label>
                        <textarea required rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" value={annForm.content} onChange={e => setAnnForm(p => ({...p, content: e.target.value}))} /></div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target</label>
                          <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" value={annForm.targetAudience} onChange={e => setAnnForm(p => ({...p, targetAudience: e.target.value}))}>
                            <option value="all">Everyone</option><option value="student">Students</option><option value="faculty">Faculty</option>
                          </select></div>
                        <label className="flex items-center gap-2 cursor-pointer mt-5 text-sm text-gray-700">
                          <input type="checkbox" checked={annForm.pinned} onChange={e => setAnnForm(p => ({...p, pinned: e.target.checked}))} /> Pin to top
                        </label>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAnnForm(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl">Cancel</button>
                        <button type="submit" disabled={annSubmitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl disabled:opacity-50">{annSubmitting ? 'Publishing…' : 'Publish'}</button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="space-y-3">
                  {!announcements.length && <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">No announcements yet.</div>}
                  {announcements.map(ann => (
                    <div key={ann._id} className={`bg-white rounded-2xl border p-5 ${ann.pinned ? 'border-indigo-200 bg-indigo-50/20' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {ann.pinned && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{ann.targetAudience === 'all' ? 'All Users' : ann.targetAudience}</span>
                          </div>
                          <h3 className="text-gray-900 font-bold text-sm">{ann.title}</h3>
                          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{ann.content}</p>
                          <p className="text-gray-400 text-xs mt-2">By <span className="font-semibold capitalize">{ann.createdByName}</span> · {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        {ann.createdBy === data.profile?._id && (
                          <button onClick={async () => { if(!window.confirm('Delete?')) return; await api.delete(`/announcements/${ann._id}`); const r = await api.get('/announcements'); setAnnouncements(r.data.announcements || []); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{rejectModal.type === 'submission' ? 'Reject Final Submission' : 'Reject Proposal'}</h2>
              <button onClick={() => setRejectModal({ id: null, reason: '', type: 'proposal' })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {rejectModal.type === 'submission' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> The student will be asked to re-upload after reading your feedback.
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Reason (min 20 characters) *</label>
                <textarea rows={4} placeholder="Provide a clear reason for rejection..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                  value={rejectModal.reason} onChange={e => setRejectModal(r => ({ ...r, reason: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">{rejectModal.reason.length}/20 chars minimum</p>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setRejectModal({ id: null, reason: '', type: 'proposal' })} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={rejectProposal} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700">Confirm Reject</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Deadline Modal */}
      {deadlineModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Set Targeted Deadline</h2>
              <button onClick={() => setDeadlineModal({ ...deadlineModal, open: false })} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitTargetedDeadline} className="p-5 space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title *</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm" value={deadlineModal.title} onChange={e => setDeadlineModal({...deadlineModal, title: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label><textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm resize-none" rows={2} value={deadlineModal.description} onChange={e => setDeadlineModal({...deadlineModal, description: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Due Date *</label><input required type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm" value={deadlineModal.dueDate} onChange={e => setDeadlineModal({...deadlineModal, dueDate: e.target.value})} /></div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Target Projects</label>
                <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50">
                  {data.activeProjects.map(p => (
                    <label key={p._id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={deadlineModal.targetProjects.includes(p._id)}
                        onChange={(e) => { const newT = e.target.checked ? [...deadlineModal.targetProjects, p._id] : deadlineModal.targetProjects.filter(id => id !== p._id); setDeadlineModal({...deadlineModal, targetProjects: newT}); }} />
                      <span className="text-sm font-medium text-gray-700">{p.title} <span className="text-gray-400">— {p.studentId?.name}</span></span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">Assign Deadline</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── QUICK PREVIEW MODAL ── */}
      {selectedStudent && (() => {
        const student = selectedStudent;
        const project = student.project;
        const projectFilesArr = data.projectFiles?.[project._id] || [];
        const isSubmitted = project.status === 'Submitted';
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col border border-gray-100"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white shrink-0 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-1">{project.domain}</span>
                  <h2 className="font-extrabold text-xl leading-tight truncate max-w-2xl">{project.title}</h2>
                  <p className="text-indigo-200/80 text-xs mt-0.5">Assigned Leader: <span className="font-semibold text-white">{project.studentId?.name}</span> • {project.studentId?.course} {project.studentId?.branch}</p>
                </div>
                <button 
                  onClick={() => { setSelectedStudent(null); setTimelineComment({}); }} 
                  className="p-2 bg-white/10 hover:bg-white/20 text-white/90 rounded-2xl transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Panel: Profile & Team Details */}
                <div className="w-full md:w-80 border-r border-gray-100 overflow-y-auto p-5 shrink-0 bg-slate-50/50 space-y-5">
                  
                  {/* Student details */}
                  <div className="text-center pb-5 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner mx-auto mb-3">
                      {student.name[0].toUpperCase()}
                    </div>
                    <h3 className="font-bold text-gray-900 leading-tight">{student.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{student.role} • Section {student.section}</p>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{student.email}</p>
                    {student.mobileNumber && <p className="text-[11px] text-gray-500 mt-1">{student.mobileNumber}</p>}
                  </div>

                  {/* Team Details */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Team Members ({1 + (project.teamMembers?.length || 0)})</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 p-2 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">L</div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{project.studentId?.name} (Leader)</p>
                          <p className="text-[10px] text-gray-400 truncate">{project.studentId?.email}</p>
                        </div>
                      </div>
                      {(project.teamMembers || []).map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2 bg-white border border-gray-100 rounded-xl">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">{i+1}</div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{m.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Project Details & Stepper Timeline & Comments */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Description */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Abstract</p>
                    <p className="text-sm text-gray-600 border-l-4 border-indigo-200 pl-3 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl">{project.description}</p>
                  </div>

                  {/* Stepper Timeline & Inline Commenting */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress Timeline Stepper</p>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">{project.progress || 0}% Completion</span>
                    </div>

                    {!project.timeline || project.timeline.length === 0 ? (
                      <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">Student has not logged progress updates yet.</p>
                    ) : (
                      <div className="relative border-l-2 border-indigo-100 pl-5 ml-2.5 space-y-5">
                        {project.timeline.map((item) => (
                          <div key={item._id} className="relative">
                            
                            {/* Bullet Node */}
                            <span className="absolute -left-[27px] top-1.5 w-3 h-3 bg-indigo-600 rounded-full ring-4 ring-indigo-50" />

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
                              <div className="flex justify-between items-start flex-wrap gap-2 mb-1.5">
                                <h5 className="font-bold text-gray-800 text-[10px] tracking-wide bg-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded-md uppercase">{item.status}</h5>
                                <span className="text-[10px] text-gray-400 font-bold">{new Date(item.timestamp).toLocaleString()}</span>
                              </div>
                              {item.remarks && (
                                <p className="text-xs text-gray-600 leading-relaxed font-semibold italic">"{item.remarks}"</p>
                              )}

                              {/* Supervisor Comment Box */}
                              <div className="mt-3 border-t border-slate-200/50 pt-2.5 space-y-2">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Supervisor Comment</p>
                                {item.facultyComment ? (
                                  <p className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 font-semibold">"{item.facultyComment}"</p>
                                ) : (
                                  <div className="flex gap-2">
                                    <input 
                                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" 
                                      placeholder="Leave supervisor comment..."
                                      value={timelineComment[`${project._id}_${item._id}`] || ''}
                                      onChange={e => setTimelineComment(prev => ({ ...prev, [`${project._id}_${item._id}`]: e.target.value }))}
                                    />
                                    <button 
                                      onClick={() => handleTimelineCommentSubmit(project._id, item._id)}
                                      disabled={timelineSubmitting[`${project._id}_${item._id}`]}
                                      className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                                    >
                                      Comment
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Uploaded Files */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Uploaded Deliverables</p>
                    {projectFilesArr.length === 0 ? (
                      <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">No project uploads logged yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                        {projectFilesArr.map(f => (
                          <div key={f._id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{f.fileName}</p>
                                <p className="text-[10px] text-gray-400">{f.fileType} • v{f.version}</p>
                              </div>
                            </div>
                            <a href={f.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all shrink-0"><Download className="w-3.5 h-3.5" /></a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Final deliverables evaluation banner */}
                  {isSubmitted && project.finalSubmission && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <h4 className="font-extrabold text-amber-800 text-xs uppercase mb-1">Final Submission Awaiting HOD Resolution</h4>
                      <p className="text-xs text-amber-700 leading-relaxed font-medium">This project has uploaded final deliverables and is awaiting Heads of Department review and approval. You can verify links below:</p>
                      <div className="flex gap-2 mt-2">
                        {project.finalSubmission.liveLink && <a href={project.finalSubmission.liveLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">🌐 Live URL</a>}
                        {project.finalSubmission.githubLink && <a href={project.finalSubmission.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">💻 GitHub URL</a>}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

    </div>
  );
};

export default FacultyDashboard;
