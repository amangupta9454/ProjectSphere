import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, FolderOpen, Users, UserCheck,
  Clock, Bell, CheckCircle, XCircle, CornerDownRight, PieChart as PieChart3,
  BarChart3, Search, Trash2, Plus, Calendar, RefreshCw,
  TrendingUp, BookOpen, AlertCircle, MessageSquare, Megaphone, Pin, PinOff, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Sidebar from '../Components/Sidebar';

const HOD_NAV = (pendingFac, pendingProps, notifications) => [
  { id: 'overview',      label: 'Overview',        icon: LayoutDashboard },
  { id: 'projects',      label: 'Projects',         icon: FolderOpen,  badge: 0 },
  { id: 'students',      label: 'Students',         icon: Users },
  { id: 'faculty',       label: 'Faculty',          icon: UserCheck,   badge: pendingFac },
  { id: 'deadlines',     label: 'Deadlines',        icon: Clock },
  { id: 'activity',      label: 'Activity Log',     icon: TrendingUp },
  { id: 'announcements', label: 'Announcements',    icon: Megaphone },
  { id: 'notifications', label: 'Notifications',    icon: Bell,        badge: notifications },
];

const STATUS_COLORS = {
  'Pending HOD Review':  'bg-yellow-50 text-yellow-700 border-yellow-200',
  'HOD Approved':        'bg-blue-50 text-blue-700 border-blue-200',
  'Rejected (HOD)':      'bg-red-50 text-red-600 border-red-200',
  'Faculty Assigned':    'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Faculty Accepted':    'bg-green-50 text-green-700 border-green-200',
  'Rejected (Faculty)':  'bg-orange-50 text-orange-600 border-orange-200',
  'Submitted':           'bg-purple-50 text-purple-700 border-purple-200',
};

export default function HodDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ profile: null, unapprovedFaculty: [], pendingProposals: [], approvedNeedingAssignment: [], stats: {}, recentActivity: [] });
  const [projects, setProjects]               = useState([]);
  const [students, setStudents]               = useState([]);
  const [facultyWorkload, setFacultyWorkload] = useState([]);
  const [approvedFacultyList, setApprovedFacultyList] = useState([]);
  const [deadlines, setDeadlines]             = useState([]);
  const [hodNotifications, setHodNotifications] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [activeModal, setActiveModal]         = useState({ type: null, id: null });
  const [reason, setReason]                   = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [projectFilter, setProjectFilter]     = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [deadlineForm, setDeadlineForm]       = useState({ title: '', description: '', dueDate: '', targetRoles: ['all'] });
  const [addForm, setAddForm]                 = useState({ name: '', email: '', password: '', mobileNumber: '', department: '', designation: '', employeeId: '', course: '', year: '', branch: '', section: '' });
  // Announcements
  const [announcements, setAnnouncements]     = useState([]);
  const [annForm, setAnnForm]                 = useState({ title: '', content: '', targetAudience: 'all', pinned: false });
  const [showAnnForm, setShowAnnForm]         = useState(false);
  const [annSubmitting, setAnnSubmitting]     = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const fetchDashboard = useCallback(async () => {
    try {
      // Use allSettled so a failure in one call doesn't wipe out all dashboard data
      const [dashRes, facRes, notifsRes] = await Promise.allSettled([
        api.get('/hod/dashboard'),
        api.get('/hod/faculty/approved'),
        api.get('/notifications'),
      ]);

      if (dashRes.status === 'fulfilled') {
        setData(dashRes.value.data);
      } else {
        const status = dashRes.reason?.response?.status;
        if (status === 401 || status === 403) { handleLogout(); return; }
        console.error('[HOD Dashboard]', dashRes.reason?.response?.data?.message || dashRes.reason?.message);
        toast.error('Failed to load dashboard data. Check your connection.');
      }

      if (facRes.status === 'fulfilled') {
        setApprovedFacultyList(facRes.value.data);
      } else {
        console.error('[HOD Faculty List]', facRes.reason?.response?.data?.message || facRes.reason?.message);
      }

      if (notifsRes.status === 'fulfilled') {
        setHodNotifications(notifsRes.value.data.notifications || []);
      } else {
        console.error('[HOD Notifications]', notifsRes.reason?.response?.data?.message || notifsRes.reason?.message);
      }
    } catch (e) {
      console.error('[HOD fetchDashboard unexpected]', e.message);
      toast.error('An unexpected error occurred loading the dashboard.');
    } finally { setLoading(false); }
  }, []);

  const fetchProjects = useCallback(async () => {
    try { const r = await api.get(`/hod/projects?status=${projectFilter}`); setProjects(r.data); } catch {}
  }, [projectFilter]);

  const fetchStudents = useCallback(async () => {
    try { const r = await api.get(`/hod/students${searchQuery ? `?search=${searchQuery}` : ''}`); setStudents(r.data); } catch {}
  }, [searchQuery]);

  const fetchFacultyWorkload = useCallback(async () => {
    try { const r = await api.get('/hod/faculty/workload'); setFacultyWorkload(r.data); } catch {}
  }, []);

  const fetchDeadlines = useCallback(async () => {
    try { const r = await api.get('/deadlines'); setDeadlines(r.data); } catch {}
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => { if (activeTab === 'projects')  fetchProjects(); }, [activeTab, projectFilter]);
  useEffect(() => { if (activeTab === 'students')  fetchStudents(); }, [activeTab]);
  useEffect(() => { if (activeTab === 'faculty')   fetchFacultyWorkload(); }, [activeTab]);
  useEffect(() => { if (activeTab === 'deadlines')     fetchDeadlines(); }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'announcements') {
      api.get('/announcements').then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
    }
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'students') { const t = setTimeout(fetchStudents, 400); return () => clearTimeout(t); }
  }, [searchQuery]);

  const resolveFaculty = async (id, action) => {
    try {
      if (action === 'accept') { await api.put(`/hod/faculty/${id}/approve`); toast.success('Faculty approved'); }
      else {
        if (reason.length < 5) return toast.error('Provide a reason');
        await api.put(`/hod/faculty/${id}/reject`, { reason }); toast.success('Faculty rejected');
      }
      setActiveModal({ type: null, id: null }); setReason(''); fetchDashboard();
    } catch { toast.error('Action failed'); }
  };

  const resolveProposal = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/hod/proposals/${id}/approve`);
        toast.success('Proposal approved! Now assign a faculty supervisor.');
        // Immediately transition to the assign-faculty modal for this proposal
        setSelectedFaculty('');
        setActiveModal({ type: 'assignFac', id });
      } else {
        if (reason.length < 20) return toast.error('Reason must be >20 chars');
        await api.put(`/hod/proposals/${id}/reject`, { reason }); toast.success('Proposal rejected');
        setActiveModal({ type: null, id: null }); setReason('');
      }
      fetchDashboard(); if (activeTab === 'projects') fetchProjects();
    } catch { toast.error('Action failed'); }
  };

  const assignFaculty = async (id) => {
    if (!selectedFaculty) return toast.error('Select a faculty member');
    try {
      await api.put(`/hod/proposals/${id}/assign`, { facultyId: selectedFaculty });
      toast.success('Faculty assigned!');
      setActiveModal({ type: null, id: null }); setSelectedFaculty('');
      fetchDashboard(); if (activeTab === 'projects') fetchProjects();
    } catch (e) { toast.error(e.response?.data?.message || 'Assignment failed'); }
  };

  const evaluateFinalSubmission = async (id, status) => {
    try {
      if (status === 'Rejected' && reason.length < 10) return toast.error('Please provide a clearer reason.');
      await api.put(`/hod/projects/${id}/submission`, { status, rejectionReason: reason });
      toast.success(`Submission marked as ${status}`);
      setActiveModal({ type: null, id: null }); setReason('');
      fetchProjects();
    } catch (e) { toast.error('Action failed'); }
  };

  const toggleStudentBan = async (id, currentStatus) => {
    try {
      const isBanned = !currentStatus;
      if (isBanned && reason.length < 10) return toast.error('Please provide a reason (min 10 chars).');
      await api.put(`/hod/students/${id}/ban`, { isBanned, banReason: reason });
      toast.success(`Student access ${isBanned ? 'revoked' : 'restored'}`);
      setActiveModal({ type: null, id: null }); setReason('');
      fetchStudents();
    } catch (e) { toast.error('Failed to change ban status'); }
  };

  const handleAddSubmit = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'student') {
        await api.post('/hod/students', addForm);
        toast.success('Student added successfully');
        fetchStudents(); fetchDashboard();
      } else {
        await api.post('/hod/faculty', addForm);
        toast.success('Faculty added successfully');
        fetchFacultyWorkload(); fetchDashboard();
      }
      setActiveModal({ type: null, id: null });
      setAddForm({ name: '', email: '', password: '', mobileNumber: '', department: '', designation: '', employeeId: '', course: '', year: '', branch: '', section: '' });
    } catch (error) { toast.error(error.response?.data?.message || `Failed to add ${type}`); }
  };

  const downloadExcel = async () => {
    try {
      const response = await api.get(`/hod/projects/export?status=${projectFilter}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `projects_${projectFilter}_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Excel exported successfully');
    } catch (error) {
      toast.error('Failed to export projects');
    }
  };

  const createDeadline = async (e) => {
    e.preventDefault();
    try { await api.post('/deadlines', deadlineForm); toast.success('Deadline created!'); setDeadlineForm({ title: '', description: '', dueDate: '', targetRoles: ['all'] }); fetchDeadlines(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const deleteDeadline = async (id) => {
    try { await api.delete(`/deadlines/${id}`); toast.success('Deadline removed'); fetchDeadlines(); }
    catch { toast.error('Failed'); }
  };

  const markAllRead = async () => {
    try { await api.put('/notifications/read-all'); fetchDashboard(); toast.success('All marked read'); } catch {}
  };

  const domainStats = () => {
    const map = {}; data.pendingProposals.forEach(p => { const k = p.domain || 'Other'; map[k] = (map[k] || 0) + 1; });
    const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
    return Object.keys(map).map((k, i) => ({ name: k, value: map[k], color: colors[i % colors.length] }));
  };

  const unreadNotifs = hodNotifications.filter(n => !n.isRead).length;

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        navItems={HOD_NAV(data.unapprovedFaculty?.length, data.pendingProposals?.length, unreadNotifs)}
        user={data.profile}
        role="hod"
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 capitalize">{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h2>
            <p className="text-xs text-gray-400">Head of Department Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboard} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-gray-200 transition-all"><RefreshCw className="w-4 h-4" /></button>
            <div className="relative">
              <button onClick={() => setActiveTab('notifications')} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-gray-200 transition-all">
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>}
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label:'Total Students', value: data.stats?.totalStudents||0, icon: Users,      color:'blue',   sub:'Registered' },
                      { label:'Total Faculty',  value: data.stats?.totalFaculty||0,  icon: UserCheck,  color:'indigo', sub:'Approved' },
                      { label:'Active Projects',value: data.stats?.activeProjects||0,icon: FolderOpen, color:'green',  sub:'In Progress' },
                      { label:'Pending Review', value: data.stats?.pendingReview||0, icon: AlertCircle,color:'orange', sub:'Need Action' },
                    ].map(({ label, value, icon: Icon, color, sub }) => (
                      <div key={label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                          <div className={`p-2 bg-${color}-50 rounded-xl`}><Icon className={`w-4 h-4 text-${color}-500`} /></div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                        <p className="text-xs text-gray-400 mt-1">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Branch stats + Domain chart */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-500" /> Branch Distribution</h3>
                      <div className="w-full h-48">
                        {Object.keys(data.stats?.branchStats || {}).length === 0 ? (
                          <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">No student data yet.</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.entries(data.stats.branchStats).map(([branch, count]) => ({ branch, count }))} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="branch" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} />
                              <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><PieChart3 className="w-4 h-4 text-purple-500" /> Proposals by Domain</h3>
                      <div className="w-full h-48">
                        {domainStats().length === 0 ? (
                           <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">No pending proposals.</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={domainStats()} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                                {domainStats().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Faculty Workload Recharts Graph */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-500" /> Faculty Workload vs Capacity</h3>
                    {facultyWorkload.length === 0 ? <p className="text-sm text-gray-400 italic">No faculty data available to graph.</p> : (
                      <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={facultyWorkload.map(f => ({ name: f.name.split(' ')[0], Assigned: f.projectCount, Capacity: 10 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[0, 10]} />
                            <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="Assigned" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="Capacity" fill="#E0E7FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Pending Faculty */}
                  {data.unapprovedFaculty?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" /><h2 className="font-bold text-gray-900">Pending Faculty Approvals</h2><span className="ml-auto text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{data.unapprovedFaculty.length}</span></div>
                      <div className="divide-y divide-gray-50">
                        {data.unapprovedFaculty.map(fac => (
                          <div key={fac._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                            <div><p className="font-bold text-gray-900 text-sm">{fac.name}</p><p className="text-xs text-gray-500">{fac.email} • {fac.department}</p></div>
                            <div className="flex gap-2">
                              <button onClick={() => resolveFaculty(fac._id, 'accept')} className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-semibold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Approve</button>
                              <button onClick={() => setActiveModal({ type: 'rejectFac', id: fac._id })} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Reject</button>
                            </div>
                            {activeModal.type === 'rejectFac' && activeModal.id === fac._id && (
                              <div className="w-full flex gap-2 mt-1">
                                <input className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Reason..." value={reason} onChange={e => setReason(e.target.value)} />
                                <button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-2 text-xs bg-gray-100 rounded-lg">Cancel</button>
                                <button onClick={() => resolveFaculty(fac._id, 'reject')} className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg">Confirm</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Proposals */}
                  {data.pendingProposals?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-500" /><h2 className="font-bold text-gray-900">Pending Project Proposals</h2><span className="ml-auto text-xs font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{data.pendingProposals.length}</span></div>
                      <div className="divide-y divide-gray-50">
                        {data.pendingProposals.map(p => (
                          <div key={p._id} className="p-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{p.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{p.studentId?.name} • {p.studentId?.course} {p.studentId?.branch} <span className="ml-2 bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100 text-[10px]">{p.domain}</span></p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => resolveProposal(p._id, 'approve')} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold">Approve</button>
                                <button onClick={() => setActiveModal({ type: 'assignFac', id: p._id })} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1"><CornerDownRight className="w-3 h-3" /> Assign</button>
                                <button onClick={() => setActiveModal({ type: 'rejectProp', id: p._id })} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold"><XCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 border-l-4 border-purple-200 pl-3 line-clamp-2">{p.description}</p>
                            {activeModal.type === 'rejectProp' && activeModal.id === p._id && (
                              <div className="flex gap-2 mt-3"><textarea className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none resize-none" rows={2} placeholder="Reason (min 20 chars)..." value={reason} onChange={e => setReason(e.target.value)} />
                                <div className="flex flex-col gap-1"><button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg">Cancel</button><button onClick={() => resolveProposal(p._id, 'reject')} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg">Reject</button></div>
                              </div>
                            )}
                            {activeModal.type === 'assignFac' && activeModal.id === p._id && (
                              <div className="flex gap-2 mt-3">
                                <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500" value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)}>
                                  <option value="">Select Faculty</option>
                                  {approvedFacultyList.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
                                </select>
                                <button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg">Cancel</button>
                                <button onClick={() => assignFaculty(p._id)} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-bold">Assign</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assign Faculty for HOD approved */}
                  {data.approvedNeedingAssignment?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 flex items-center gap-2"><CornerDownRight className="w-5 h-5 text-blue-500" /><h2 className="font-bold text-gray-900">Assign Faculty to Approved Proposals</h2><span className="ml-auto text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{data.approvedNeedingAssignment.length}</span></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
                        {data.approvedNeedingAssignment.map(p => (
                          <div key={p._id} className="border border-blue-100 rounded-2xl p-4 border-l-4 border-l-blue-500">
                            <p className="font-bold text-gray-900 text-sm mb-1">{p.title}</p>
                            <p className="text-xs text-gray-400 mb-3">{p.studentId?.name}</p>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs mb-2 focus:outline-none" defaultValue="" onChange={e => setSelectedFaculty(e.target.value)}>
                              <option value="" disabled>Select Faculty</option>
                              {approvedFacultyList.map(f => <option key={f._id} value={f._id}>{f.name} — {f.department}</option>)}
                            </select>
                            <button onClick={() => assignFaculty(p._id)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all">Assign Faculty</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PROJECTS */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {['all','Pending HOD Review','HOD Approved','Faculty Assigned','Faculty Accepted','Submitted','Rejected (HOD)','Rejected (Faculty)'].map(s => (
                        <button key={s} onClick={() => setProjectFilter(s)} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${projectFilter === s ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>{s === 'all' ? 'All' : s}</button>
                      ))}
                    </div>
                    <button onClick={downloadExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-500/20">
                      <FolderOpen className="w-4 h-4" /> Export Excel
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.length === 0 && <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No projects found.</div>}
                    {projects.map(p => (
                      <div key={p._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <div><h3 className="font-bold text-gray-900">{p.title}</h3><p className="text-xs text-gray-500 mt-0.5">{p.studentId?.name} • {p.studentId?.course} {p.studentId?.branch} Yr{p.studentId?.year||'-'}</p></div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[p.status]||'bg-gray-50 text-gray-500 border-gray-200'}`}>{p.status}</span>
                            {p.progress > 0 && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">{p.progress}%</span>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 border-l-4 border-gray-200 pl-3 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                          <span>Domain: <span className="text-gray-700 font-semibold">{p.domain}</span></span>
                          {p.assignedFaculty && <span>Supervisor: <span className="text-blue-600 font-semibold">{p.assignedFaculty.name}</span></span>}
                        </div>
                        {p.finalSubmission && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">Final Submission</p>
                            <div className="flex flex-col gap-1 text-xs">
                              {p.finalSubmission.liveLink && <a href={p.finalSubmission.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🌐 Live Project Link</a>}
                              {p.finalSubmission.githubLink && <a href={p.finalSubmission.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">💻 GitHub Repository</a>}
                              <p className="mt-2 text-gray-600">Status: <span className={`font-bold ${p.finalSubmission.status === 'Accepted' ? 'text-green-600' : p.finalSubmission.status === 'Rejected' ? 'text-red-600' : 'text-orange-600'}`}>{p.finalSubmission.status || 'Not Submitted'}</span></p>
                            </div>
                            {p.status === 'Submitted' && p.finalSubmission.status !== 'Accepted' && (
                              <div className="mt-3 flex gap-2">
                                <button onClick={() => evaluateFinalSubmission(p._id, 'Accepted')} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold">Accept Work</button>
                                <button onClick={() => setActiveModal({ type: 'rejectSubmission', id: p._id })} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold">Reject Work</button>
                              </div>
                            )}
                            {activeModal.type === 'rejectSubmission' && activeModal.id === p._id && (
                              <div className="flex gap-2 mt-3"><textarea className="flex-1 bg-white border border-red-200 rounded-xl p-2.5 text-xs resize-none" rows={2} placeholder="Reason for rejecting work..." value={reason} onChange={e => setReason(e.target.value)} />
                                <div className="flex flex-col gap-1"><button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-1.5 text-xs bg-gray-200 rounded-lg">Cancel</button><button onClick={() => evaluateFinalSubmission(p._id, 'Rejected')} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg">Confirm</button></div>
                              </div>
                            )}
                          </div>
                        )}
                        {p.status === 'Pending HOD Review' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => resolveProposal(p._id, 'approve')} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold">Approve</button>
                            <button onClick={() => setActiveModal({ type: 'rejectProp', id: p._id })} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold">Reject</button>
                          </div>
                        )}
                        {activeModal.type === 'rejectProp' && activeModal.id === p._id && (
                          <div className="flex gap-2 mt-3"><textarea className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs resize-none" rows={2} placeholder="Reason..." value={reason} onChange={e => setReason(e.target.value)} />
                            <div className="flex flex-col gap-1"><button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg">Cancel</button><button onClick={() => resolveProposal(p._id, 'reject')} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg">Reject</button></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STUDENTS */}
              {activeTab === 'students' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      </div>
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{students.length} students</span>
                    </div>
                    <button onClick={() => setActiveModal({ type: 'addStudent', id: null })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20">
                      <Plus className="w-4 h-4" /> Add Student
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                        <tr><th className="py-3 px-5">Name</th><th className="py-3 px-4">Course / Branch</th><th className="py-3 px-4">Year / Sec</th><th className="py-3 px-4">Contact</th><th className="py-3 px-4 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {students.map(s => (
                          <React.Fragment key={s._id}>
                            <tr className={`transition-colors ${s.isBanned ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-gray-50'}`}>
                              <td className="py-3.5 px-5">
                                <p className="font-semibold text-gray-900">{s.name}</p>
                                {s.isBanned && <p className="text-[10px] text-red-600 font-bold uppercase mt-0.5">Banned</p>}
                              </td>
                              <td className="py-3.5 px-4 text-gray-600">{s.course} — {s.branch}</td>
                              <td className="py-3.5 px-4"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-100">Y{s.year} {s.section}</span></td>
                              <td className="py-3.5 px-4 text-gray-500 text-xs">
                                <p>{s.email}</p>
                                <p>{s.mobileNumber}</p>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {s.isBanned ? (
                                  <button onClick={() => toggleStudentBan(s._id, true)} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold transition-all mt-1">Restore Access</button>
                                ) : (
                                  <button onClick={() => setActiveModal({ type: 'banStudent', id: s._id })} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-all mt-1">Ban</button>
                                )}
                              </td>
                            </tr>
                            {activeModal.type === 'banStudent' && activeModal.id === s._id && (
                              <tr className="bg-red-50/50">
                                <td colSpan={5} className="py-3 px-5 border-t border-red-100">
                                  <div className="flex gap-2">
                                    <input className="flex-1 bg-white border border-red-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-red-400" placeholder="Minimum 10 chars reason..." value={reason} onChange={e => setReason(e.target.value)} />
                                    <button onClick={() => setActiveModal({ type: null, id: null })} className="px-3 py-1.5 text-xs bg-gray-200 rounded-lg font-bold">Cancel</button>
                                    <button onClick={() => toggleStudentBan(s._id, false)} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold">Confirm Ban</button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        {students.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-400 italic">No students found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FACULTY */}
              {activeTab === 'faculty' && (
                <div className="space-y-6">
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setActiveModal({ type: 'addFaculty', id: null })} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20">
                      <Plus className="w-4 h-4" /> Add Faculty
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {facultyWorkload.map(f => {
                      const pct = Math.min(Math.round((f.projectCount/10)*100), 100);
                      return (
                        <div key={f._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div><p className="font-bold text-gray-900">{f.name}</p><p className="text-xs text-gray-500">{f.department}</p><p className="text-xs text-gray-400">{f.email}</p></div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pct > 80 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>{f.projectCount}/10</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${pct>80?'bg-red-500':'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width:`${pct}%` }}></div></div>
                          <p className="text-xs text-gray-400 mt-1">{pct}% workload</p>
                        </div>
                      );
                    })}
                    {facultyWorkload.length === 0 && <p className="text-sm text-gray-400 italic col-span-3 text-center py-10">No approved faculty.</p>}
                  </div>
                  {data.unapprovedFaculty?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-900 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" /> Awaiting Approval ({data.unapprovedFaculty.length})</h3></div>
                      <div className="divide-y divide-gray-50">
                        {data.unapprovedFaculty.map(fac => (
                          <div key={fac._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                            <div><p className="font-bold text-gray-900 text-sm">{fac.name}</p><p className="text-xs text-gray-500">{fac.email} • {fac.department}</p></div>
                            <div className="flex gap-2">
                              <button onClick={() => resolveFaculty(fac._id, 'accept')} className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-semibold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Approve</button>
                              <button onClick={() => setActiveModal({ type:'rejectFac', id: fac._id })} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DEADLINES */}
              {activeTab === 'deadlines' && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Plus className="w-5 h-5 text-purple-500" /> Create Deadline</h3>
                    <form onSubmit={createDeadline} className="space-y-4">
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Title</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500" placeholder="e.g. Final Submission Deadline" value={deadlineForm.title} onChange={e => setDeadlineForm({ ...deadlineForm, title: e.target.value })} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Description</label><textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500 resize-none" rows={3} placeholder="Optional details..." value={deadlineForm.description} onChange={e => setDeadlineForm({ ...deadlineForm, description: e.target.value })} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Due Date</label><input required type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500" value={deadlineForm.dueDate} onChange={e => setDeadlineForm({ ...deadlineForm, dueDate: e.target.value })} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Notify</label>
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-purple-500" value={deadlineForm.targetRoles[0]} onChange={e => setDeadlineForm({ ...deadlineForm, targetRoles: [e.target.value] })}>
                          <option value="all">All (Students + Faculty)</option><option value="student">Students Only</option><option value="faculty">Faculty Only</option>
                        </select></div>
                      <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"><Calendar className="w-4 h-4" /> Set Deadline & Notify</button>
                    </form>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Clock className="w-5 h-5 text-purple-500" /> Active Deadlines ({deadlines.length})</h3>
                    {deadlines.length === 0 && <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No deadlines set.</div>}
                    {deadlines.map(d => {
                      const due = new Date(d.dueDate), diffDays = Math.ceil((due - new Date()) / 86400000), isUrgent = diffDays <= 3;
                      return (
                        <div key={d._id} className={`bg-white rounded-2xl p-5 border shadow-sm ${isUrgent ? 'border-red-200 border-l-4 border-l-red-500' : 'border-gray-100 border-l-4 border-l-purple-400'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{d.title}</p>
                              {d.description && <p className="text-xs text-gray-500 mt-1">{d.description}</p>}
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className={`text-xs font-bold ${isUrgent?'text-red-600':'text-gray-600'}`}>📅 {due.toLocaleDateString()}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isUrgent?'bg-red-50 text-red-600 border-red-200':'bg-gray-50 text-gray-500 border-gray-200'}`}>{diffDays > 0 ? `${diffDays}d remaining` : 'Overdue'}</span>
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">{d.targetRoles?.join(', ')}</span>
                              </div>
                            </div>
                            <button onClick={() => deleteDeadline(d._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /><h2 className="font-bold text-gray-900">Recent Activity Log</h2></div>
                  <div className="divide-y divide-gray-50">
                    {data.recentActivity?.length === 0 && <p className="text-sm text-gray-400 italic p-8 text-center">No activity yet.</p>}
                    {data.recentActivity?.map((a, i) => (
                      <div key={i} className="p-4 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${a.status.includes('Rejected')?'bg-red-400':a.status.includes('Accepted')||a.status==='Submitted'?'bg-green-400':'bg-blue-400'}`}></div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p><p className="text-xs text-gray-400">{a.studentId?.name} • {a.studentId?.branch}</p></div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[a.status]||'bg-gray-50 text-gray-500 border-gray-200'}`}>{a.status}</span>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(a.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="max-w-2xl">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-purple-500" /> Notifications</h2>
                      {unreadNotifs > 0 && <button onClick={markAllRead} className="text-xs text-purple-600 font-bold hover:underline">Mark all read</button>}
                    </div>
                    <div className="divide-y divide-gray-50">
                      {hodNotifications.length === 0 && <p className="text-sm text-gray-400 italic p-8 text-center">No notifications.</p>}
                      {hodNotifications.map(n => (
                        <div key={n._id} className={`p-4 flex items-start gap-3 ${!n.isRead ? 'bg-purple-50/40' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'approval' ? 'bg-green-100' : n.type === 'rejection' ? 'bg-red-100' : 'bg-purple-100'}`}>
                            {n.type === 'approval' ? <CheckCircle className="w-4 h-4 text-green-600" /> : n.type === 'rejection' ? <XCircle className="w-4 h-4 text-red-500" /> : <Bell className="w-4 h-4 text-purple-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">{n.message}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                          {!n.isRead && <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0 mt-2"></span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODALS GLOBALS */}
              {activeModal.type === 'addStudent' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between"><h2 className="font-bold text-gray-900">Add New Student</h2><button onClick={() => setActiveModal({ type: null, id: null })} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5"/></button></div>
                    <form onSubmit={(e) => handleAddSubmit(e, 'student')} className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Name</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Password</label><input required minLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Mobile</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.mobileNumber} onChange={e => setAddForm({...addForm, mobileNumber: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Course</label><select required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.course} onChange={e => setAddForm({...addForm, course: e.target.value})}><option value="B.Tech">B.Tech</option><option value="M.Tech">M.Tech</option><option value="BCA">BCA</option><option value="MCA">MCA</option><option value="BBA">BBA</option><option value="MBA">MBA</option><option value="B.Ed">B.Ed</option><option value="M.Ed">M.Ed</option></select></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Branch</label><select required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.branch || data.profile?.department || ''} onChange={e => setAddForm({...addForm, branch: e.target.value})}><option value="Computer Science">Computer Science</option><option value="Electrical">Electrical</option><option value="Mechanical Polytechnic">Mechanical Polytechnic</option><option value="BCA">BCA</option><option value="BBA">BBA</option><option value="MBA">MBA</option><option value="MCA">MCA</option><option value="B.Ed">B.Ed</option><option value="M.Ed">M.Ed</option></select></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Year</label><select required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.year} onChange={e => setAddForm({...addForm, year: e.target.value})}><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option></select></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Section</label><select required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.section} onChange={e => setAddForm({...addForm, section: e.target.value})}><option value="A">Section A</option><option value="B">Section B</option><option value="C">Section C</option></select></div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">Add Student</button>
                    </form>
                  </motion.div>
                </div>
              )}

              {activeModal.type === 'addFaculty' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between"><h2 className="font-bold text-gray-900">Add New Faculty</h2><button onClick={() => setActiveModal({ type: null, id: null })} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5"/></button></div>
                    <form onSubmit={(e) => handleAddSubmit(e, 'faculty')} className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Name</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Password</label><input required minLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Mobile</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.mobileNumber} onChange={e => setAddForm({...addForm, mobileNumber: e.target.value})} /></div>
                        <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase mb-1">Department</label><select required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.department || data.profile?.department || ''} onChange={e => setAddForm({...addForm, department: e.target.value})}><option value="Computer Science">Computer Science</option><option value="Electrical">Electrical</option><option value="Mechanical Polytechnic">Mechanical Polytechnic</option><option value="BCA">BCA</option><option value="BBA">BBA</option><option value="MBA">MBA</option><option value="MCA">MCA</option><option value="B.Ed">B.Ed</option><option value="M.Ed">M.Ed</option></select></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Designation</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.designation} onChange={e => setAddForm({...addForm, designation: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1">Employee ID</label><input required className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={addForm.employeeId} onChange={e => setAddForm({...addForm, employeeId: e.target.value})} /></div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all">Add Faculty</button>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* ════ GLOBAL: ASSIGN FACULTY MODAL (appears after HOD approval) ════ */}
              {activeModal.type === 'assignFac' && activeModal.id && (() => {
                // Find proposal from pending OR approvedNeedingAssignment lists
                const allProposals = [...(data.pendingProposals || []), ...(data.approvedNeedingAssignment || [])];
                const proposal = allProposals.find(p => p._id === activeModal.id);
                return (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="font-bold text-white text-lg">Assign Faculty Supervisor</h2>
                            <p className="text-blue-100 text-xs mt-0.5">Choose a faculty from your department to supervise this project.</p>
                          </div>
                          <button onClick={() => setActiveModal({ type: null, id: null })} className="text-white/70 hover:text-white transition-colors"><XCircle className="w-5 h-5" /></button>
                        </div>
                      </div>
                      {proposal && (
                        <div className="p-5 bg-blue-50/50 border-b border-blue-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project</p>
                          <p className="font-bold text-gray-900">{proposal.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{proposal.studentId?.name} • {proposal.studentId?.course} — {proposal.studentId?.branch}</p>
                          {proposal.description && <p className="text-xs text-gray-400 mt-2 border-l-4 border-blue-300 pl-2 line-clamp-2">{proposal.description}</p>}
                        </div>
                      )}
                      <div className="p-5 space-y-4">
                        {approvedFacultyList.length === 0 ? (
                          <div className="text-center py-6 text-gray-400">
                            <p className="text-sm font-medium">No approved faculty in your department.</p>
                            <p className="text-xs mt-1">Add faculty members from the Faculty tab first.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Faculty Supervisor</label>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                              {approvedFacultyList.map(f => (
                                <label key={f._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedFaculty === f._id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}`}>
                                  <input type="radio" name="faculty" value={f._id} checked={selectedFaculty === f._id} onChange={e => setSelectedFaculty(e.target.value)} className="accent-blue-600" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{f.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{f.department} • {f.email}</p>
                                  </div>
                                  {selectedFaculty === f._id && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3 pt-2">
                          <button onClick={() => { setActiveModal({ type: null, id: null }); setSelectedFaculty(''); }} className="flex-1 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Skip for Now</button>
                          <button onClick={() => assignFaculty(activeModal.id)} disabled={!selectedFaculty} className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25">Assign Supervisor</button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })()}

            {/* ═══════════════════════ ANNOUNCEMENTS ══════════════════════════ */}
            {activeTab === 'announcements' && (
              <motion.div key="announcements" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-gray-900 font-bold text-base">Announcements ({announcements.length})</h2>
                  <button onClick={() => setShowAnnForm(p => !p)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all">
                    <Plus className="w-4 h-4" /> New Announcement
                  </button>
                </div>

                {showAnnForm && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2"><Megaphone className="w-4 h-4 text-purple-500" /> Create Announcement</h3>
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
                      } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
                      finally { setAnnSubmitting(false); }
                    }} className="p-5 space-y-4">
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title *</label>
                        <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Announcement title" value={annForm.title} onChange={e => setAnnForm(p => ({...p, title: e.target.value}))} /></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Content *</label>
                        <textarea required rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Write content here…" value={annForm.content} onChange={e => setAnnForm(p => ({...p, content: e.target.value}))} /></div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target</label>
                          <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm" value={annForm.targetAudience} onChange={e => setAnnForm(p => ({...p, targetAudience: e.target.value}))}>
                            <option value="all">Everyone</option><option value="student">Students</option><option value="faculty">Faculty</option>
                          </select></div>
                        <label className="flex items-center gap-2 cursor-pointer mt-5 text-sm text-gray-700">
                          <input type="checkbox" className="w-4 h-4 accent-purple-600" checked={annForm.pinned} onChange={e => setAnnForm(p => ({...p, pinned: e.target.checked}))} /> Pin to top
                        </label>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAnnForm(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl">Cancel</button>
                        <button type="submit" disabled={annSubmitting} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl disabled:opacity-50">{annSubmitting ? 'Publishing…' : 'Publish'}</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {announcements.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">No announcements yet.</div>
                  )}
                  {announcements.map(ann => (
                    <div key={ann._id} className={`bg-white rounded-2xl border p-5 ${ann.pinned ? 'border-purple-200 bg-purple-50/30' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {ann.pinned && <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ann.targetAudience === 'all' ? 'bg-gray-100 text-gray-500' :
                              ann.targetAudience === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                            }`}>{ann.targetAudience === 'all' ? 'All Users' : ann.targetAudience === 'student' ? 'Students' : 'Faculty'}</span>
                          </div>
                          <h3 className="text-gray-900 font-bold text-sm">{ann.title}</h3>
                          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{ann.content}</p>
                          <p className="text-gray-400 text-xs mt-2">By <span className="font-semibold capitalize">{ann.createdByName}</span> · {ann.createdByRole} · {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={async () => { await api.patch(`/announcements/${ann._id}/pin`); const r = await api.get('/announcements'); setAnnouncements(r.data.announcements || []); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all">
                            {ann.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </button>
                          <button onClick={async () => { if(!window.confirm('Delete?')) return; await api.delete(`/announcements/${ann._id}`); const r = await api.get('/announcements'); setAnnouncements(r.data.announcements || []); toast.success('Deleted'); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
}
