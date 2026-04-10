import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, GraduationCap, LayoutDashboard, FolderOpen, Bell,
  CheckCircle, XCircle, FileText, RefreshCw, MessageSquare,
  Clock, ChevronRight, Send, TrendingUp, AlertCircle, Download, Calendar,
  Megaphone, Pin, PinOff, Plus, X, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Sidebar from '../Components/Sidebar';

const TABS = [
  { id: 'overview',      label: 'Overview',       icon: LayoutDashboard },
  { id: 'projects',      label: 'My Projects',    icon: FolderOpen },
  { id: 'pending',       label: 'Pending Review', icon: Clock },
  { id: 'announcements', label: 'Announcements',  icon: Megaphone },
];

const STATUS_COLORS = {
  'Faculty Accepted': 'bg-green-50 text-green-700 border-green-200',
  'Faculty Assigned': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Submitted': 'bg-purple-50 text-purple-700 border-purple-200',
};

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ profile: null, activeProjects: [], pendingProposals: [], recentSubmissions: [], deadlines: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState({});
  const [progressInput, setProgressInput] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [rejectModal, setRejectModal] = useState({ id: null, reason: '' });
  const [deadlineModal, setDeadlineModal] = useState({ open: false, title: '', description: '', dueDate: '', targetProjects: [] });
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm]             = useState({ title: '', content: '', targetAudience: 'all', pinned: false });
  const [showAnnForm, setShowAnnForm]     = useState(false);
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/faculty/dashboard');
      setData(res.data);
      // Pre-fill progress inputs
      const prog = {};
      res.data.activeProjects.forEach(p => { prog[p._id] = p.progress || 0; });
      setProgressInput(prog);
    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 403) handleLogout();
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // Fetch announcements when tab is active
  useEffect(() => {
    if (activeTab === 'announcements') {
      api.get('/announcements').then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
    }
  }, [activeTab]);

  const acceptProposal = async (id) => {
    try {
      await api.put(`/faculty/proposals/${id}/accept`);
      toast.success('Proposal accepted!');
      fetchDashboard();
    } catch { toast.error('Action failed'); }
  };

  const rejectProposal = async () => {
    if (!rejectModal.reason || rejectModal.reason.length < 20) return toast.error('Reason must be at least 20 characters');
    try {
      await api.put(`/faculty/proposals/${rejectModal.id}/reject`, { reason: rejectModal.reason });
      toast.success('Proposal rejected');
      setRejectModal({ id: null, reason: '' });
      fetchDashboard();
    } catch { toast.error('Action failed'); }
  };

  const submitFeedback = async (id) => {
    const message = feedbackInput[id];
    if (!message || message.trim().length < 5) return toast.error('Feedback must be at least 5 characters');
    setSubmitting(s => ({ ...s, [id]: true }));
    try {
      await api.post(`/faculty/proposals/${id}/feedback`, { message });
      toast.success('Feedback sent to student!');
      setFeedbackInput(f => ({ ...f, [id]: '' }));
      fetchDashboard();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSubmitting(s => ({ ...s, [id]: false })); }
  };

  const updateProgress = async (id) => {
    try {
      await api.put(`/faculty/proposals/${id}/progress`, { progress: Number(progressInput[id]) });
      toast.success('Progress updated!');
      fetchDashboard();
    } catch { toast.error('Failed to update progress'); }
  };

  const submitTargetedDeadline = async (e) => {
    e.preventDefault();
    if (deadlineModal.targetProjects.length === 0) return toast.error('Check at least one project.');
    try {
      await api.post('/faculty/deadlines', {
        title: deadlineModal.title,
        description: deadlineModal.description,
        dueDate: deadlineModal.dueDate,
        targetProjects: deadlineModal.targetProjects
      });
      toast.success('Deadline assigned successfully');
      setDeadlineModal({ open: false, title: '', description: '', dueDate: '', targetProjects: [] });
      fetchDashboard();
    } catch { toast.error('Failed to assign deadline'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const chartData = [
    { name: 'Active', value: data.activeProjects?.length || 0, color: '#4f46e5' },
    { name: 'Pending', value: data.pendingProposals?.length || 0, color: '#f59e0b' },
    { name: 'Submissions', value: data.recentSubmissions?.length || 0, color: '#3b82f6' }
  ].filter(d => d.value > 0);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        navItems={TABS}
        user={data.profile}
        role="faculty"
        onLogout={handleLogout}
        unreadCount={data.notifications?.filter(n => !n.isRead).length || 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 capitalize">{TABS.find(t=>t.id===activeTab)?.label || 'Dashboard'}</h2>
            <p className="text-xs text-gray-400 font-medium">Faculty Management Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboard} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-gray-200 transition-all"><RefreshCw className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="w-full">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Projects', value: data.activeProjects?.length || 0, icon: FolderOpen, color: 'indigo' },
                    { label: 'Pending Review', value: data.pendingProposals?.length || 0, icon: Clock, color: 'orange' },
                    { label: 'Recent Uploads', value: data.recentSubmissions?.length || 0, icon: FileText, color: 'blue' },
                    { label: 'Notifications', value: data.notifications?.length || 0, icon: Bell, color: 'purple' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                        <div className={`p-2 bg-${color}-50 rounded-xl`}><Icon className={`w-4 h-4 text-${color}-500`} /></div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                    </div>
                  ))}
                </div>

                {/* Upcoming Deadlines */}
                {data.deadlines?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500" /> Upcoming Deadlines</h3>
                    <div className="space-y-3">
                      {data.deadlines.map(d => {
                        const due = new Date(d.dueDate);
                        const diffDays = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={d._id} className={`flex justify-between items-center p-3 rounded-xl border ${diffDays <= 3 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div>
                              <p className={`text-sm font-bold ${diffDays <= 3 ? 'text-red-700' : 'text-gray-900'}`}>{d.title}</p>
                              <p className="text-xs text-gray-400">{due.toLocaleDateString()}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${diffDays <= 3 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 border border-gray-200'}`}>{diffDays > 0 ? `${diffDays}d left` : 'Overdue'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dashboard Distribution Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Activity Distribution
                  </h3>
                  {chartData.length > 0 ? (
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                     <div className="py-8 text-center text-sm text-gray-400 font-medium italic">No active data to visualize</div>
                  )}
                </div>

                {/* Recent File Submissions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-gray-900 text-sm">Recent Student Submissions</h3></div>
                  {data.recentSubmissions?.length === 0
                    ? <div className="p-8 text-center text-gray-400 italic text-sm">No files submitted yet.</div>
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
            )}

            {/* ── MY PROJECTS TAB ── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setDeadlineModal({ ...deadlineModal, open: true })} disabled={data.activeProjects?.length === 0}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/20">
                    <Calendar className="w-4 h-4" /> Set Targeted Deadline
                  </button>
                </div>
                {data.activeProjects?.length === 0
                  ? <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No active projects yet. Accept proposals from the Pending Review tab.</div>
                  : data.activeProjects.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      {/* Project Header */}
                      <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900">{p.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{p.studentId?.name} • {p.studentId?.course} {p.studentId?.branch} Y{p.studentId?.year} {p.studentId?.section}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.studentId?.email}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[p.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{p.status}</span>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* Progress Control */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-green-500" /> Project Progress</label>
                            <span className="text-sm font-extrabold text-indigo-600">{progressInput[p._id] || 0}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="range" min={0} max={100} step={5}
                              className="flex-1 accent-indigo-600 h-2 cursor-pointer"
                              value={progressInput[p._id] || 0}
                              onChange={e => setProgressInput(prev => ({ ...prev, [p._id]: e.target.value }))} />
                            <button onClick={() => updateProgress(p._id)} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all">Update</button>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${progressInput[p._id] || 0}%` }}></div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5 block"><MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Add Feedback</label>
                          <div className="flex gap-2">
                            <textarea rows={2} placeholder="Write feedback to the student (min 5 characters)..."
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all"
                              value={feedbackInput[p._id] || ''} onChange={e => setFeedbackInput(f => ({ ...f, [p._id]: e.target.value }))} />
                            <button onClick={() => submitFeedback(p._id)} disabled={submitting[p._id]}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all shadow-sm shadow-indigo-500/20 min-w-[60px]">
                              {submitting[p._id] ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send className="w-4 h-4" />Send</>}
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
                    </div>
                  ))
                }
              </div>
            )}

            {/* PENDING REVIEW TAB */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {data.pendingProposals?.length === 0
                  ? <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No pending proposals assigned to you.</div>
                  : data.pendingProposals.map(p => (
                    <div key={p._id} className="bg-white rounded-2xl p-6 border border-indigo-100 border-l-4 border-l-indigo-500 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                        <div>
                          <h3 className="font-bold text-gray-900">{p.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{p.studentId?.name} • {p.studentId?.email}</p>
                          <p className="text-xs text-gray-400">{p.studentId?.course} {p.studentId?.branch}</p>
                        </div>
                        <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full border border-indigo-100">{p.domain}</span>
                      </div>
                      <p className="text-sm text-gray-600 border-l-4 border-indigo-200 pl-3 mb-4 leading-relaxed">{p.description}</p>
                      {p.referenceLinks?.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {p.referenceLinks.map((link, i) => <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{link}</a>)}
                        </div>
                      )}
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => acceptProposal(p._id)} className="flex items-center gap-2 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-bold transition-all">
                          <CheckCircle className="w-4 h-4" /> Accept Project
                        </button>
                        <button onClick={() => setRejectModal({ id: p._id, reason: '' })} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>

                      {rejectModal.id === p._id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-100">
                          <textarea rows={3} placeholder="Reason for rejection (min 20 characters)..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 resize-none mb-3"
                            value={rejectModal.reason} onChange={e => setRejectModal(r => ({ ...r, reason: e.target.value }))} />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setRejectModal({ id: null, reason: '' })} className="px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button onClick={rejectProposal} className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm Reject</button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))
                }
              </div>
            )}

            {/* MODAL */}
            {deadlineModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between"><h2 className="font-bold text-gray-900">Set Targeted Deadline</h2><button onClick={() => setDeadlineModal({ ...deadlineModal, open: false })} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5"/></button></div>
                  <form onSubmit={submitTargetedDeadline} className="p-5 space-y-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={deadlineModal.title} onChange={e => setDeadlineModal({...deadlineModal, title: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label><textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm resize-none" rows={2} value={deadlineModal.description} onChange={e => setDeadlineModal({...deadlineModal, description: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Due Date</label><input required type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={deadlineModal.dueDate} onChange={e => setDeadlineModal({...deadlineModal, dueDate: e.target.value})} /></div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Target Projects</label>
                      <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-3 bg-gray-50">
                        {data.activeProjects.map(p => (
                          <label key={p._id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input type="checkbox" className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              checked={deadlineModal.targetProjects.includes(p._id)}
                              onChange={(e) => {
                                const newTargets = e.target.checked ? [...deadlineModal.targetProjects, p._id] : deadlineModal.targetProjects.filter(id => id !== p._id);
                                setDeadlineModal({...deadlineModal, targetProjects: newTargets});
                              }} />
                            <span className="text-sm font-medium text-gray-700">{p.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">Assign Deadline</button>
                  </form>
                </motion.div>
              </div>
            )}


          {activeTab === 'announcements' && (
            <motion.div key="announcements" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900 font-bold text-base">Announcements ({announcements.length})</h2>
                <button onClick={() => setShowAnnForm(p => !p)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all">
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
                    e.preventDefault();
                    if (!annForm.title || !annForm.content) return;
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
                      <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Title" value={annForm.title} onChange={e => setAnnForm(p => ({...p, title: e.target.value}))} /></div>
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
                {announcements.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">No announcements yet.</div>}
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
            </motion.div>
          )}

          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
