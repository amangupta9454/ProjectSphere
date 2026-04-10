// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, LogIn, Activity, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Forgot Password Flow States
//   const [forgotModal, setForgotModal] = useState(false);
//   const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
//   const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
//   const [resetLoading, setResetLoading] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
  
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data } = await axios.post('/api/auth/login', formData);
//       localStorage.setItem('user', JSON.stringify(data));
//       toast.success('Login successful!');
      
//       if (data.role === 'student') navigate('/student/dashboard');
//       else if (data.role === 'faculty') navigate('/faculty/dashboard');
//       else if (data.role === 'hod') navigate('/hod/dashboard');
//       else if (data.role === 'admin') navigate('/admin/dashboard');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendResetOtp = async (e) => {
//     e.preventDefault();
//     if(!resetData.email) return toast.error('Enter your email');
//     setResetLoading(true);
//     try {
//       await axios.post('/api/auth/forgot-password', { email: resetData.email });
//       toast.success('OTP sent to your email');
//       setResetStep(2);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to send OTP');
//     } finally { setResetLoading(false); }
//   };

//   const handleVerifyResetOtp = async (e) => {
//     e.preventDefault();
//     if(!resetData.otp) return toast.error('Enter OTP');
//     setResetLoading(true);
//     try {
//       const { data } = await axios.post('/api/auth/verify-reset-otp', { email: resetData.email, otp: resetData.otp });
//       setResetData(prev => ({ ...prev, resetToken: data.resetToken }));
//       toast.success('OTP Verified. Set your new password.');
//       setResetStep(3);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Invalid OTP');
//     } finally { setResetLoading(false); }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if(resetData.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
//     if(resetData.newPassword !== resetData.confirmPassword) return toast.error('Passwords do not match');
//     setResetLoading(true);
//     try {
//       await axios.post('/api/auth/reset-password', { resetToken: resetData.resetToken, newPassword: resetData.newPassword });
//       toast.success('Password reset successfully!');
//       setForgotModal(false);
//       setResetStep(1);
//       setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to reset password');
//     } finally { setResetLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] font-sans flex text-slate-300">
      
//       {/* LEFT PANE - Visual/Info */}
//       <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800/50 bg-slate-900/40">
//          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none"></div>
         
//          <div className="relative z-10">
//            <Link to="/" className="flex items-center gap-3">
//               <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400">
//                 <Activity className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold text-white tracking-tight">Project<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Gateway</span></span>
//            </Link>
//          </div>

//          <div className="relative z-10 transform translate-y-[-20%]">
//              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-sm">
//                 Authenticate Your <br/> <span className="text-indigo-400">Academic Hub</span>
//              </motion.h1>
//              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed font-medium">
//                 Log into the unified interface to securely manage deliverables, track global proposals, and interact with your departmental workflows.
//              </motion.p>
             
//              <div className="grid grid-cols-2 gap-4 max-w-sm">
//                 <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
//                    <h4 className="text-3xl font-black text-white mb-1 drop-shadow-md">99%</h4>
//                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Uptime Active</p>
//                 </div>
//                 <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
//                    <h4 className="text-3xl font-black text-white mb-1 drop-shadow-md">10K</h4>
//                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">Daily Users</p>
//                 </div>
//              </div>
//          </div>
         
//          <div className="relative z-10 text-xs font-medium text-slate-500 flex items-center gap-4">
//              <span>&copy; {new Date().getFullYear()} Project Gateway</span>
//              <span>•</span>
//              <Link to="/about" className="hover:text-indigo-400 transition-colors">Platform Info</Link>
//          </div>
//       </div>

//       {/* RIGHT PANE - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
//          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

//          <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="w-full max-w-md relative z-10 bg-slate-800/40 p-10 rounded-[2rem] border border-slate-700/50 shadow-2xl backdrop-blur-xl"
//          >
//             <div className="mb-8">
//                <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
//                <p className="text-slate-400 mt-2 text-sm font-medium">Enter your assigned credentials to proceed</p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-5">
//                <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">EMAIL ADDRESS</label>
//                   <div className="relative group">
//                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                      <input type="email" required placeholder="you@institution.edu"
//                         className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
//                         value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
//                      />
//                   </div>
//                </div>

//                <div className="space-y-1.5">
//                   <div className="flex justify-between items-center ml-1">
//                      <label className="text-xs font-bold text-slate-300 tracking-wide">PASSWORD</label>
//                      <button type="button" onClick={() => setForgotModal(true)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</button>
//                   </div>
//                   <div className="relative group">
//                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                      <input type={showPassword ? "text" : "password"} required placeholder="••••••••"
//                         className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium tracking-wider"
//                         value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
//                      />
//                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none">
//                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                      </button>
//                   </div>
//                </div>

//                <button type="submit" disabled={loading} className="w-full relative group bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-4 mt-8 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all disabled:opacity-70 border border-indigo-500">
//                   {loading ? (
//                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                      <><LogIn className="w-5 h-5" /> <span>Secure Authentication</span> <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></>
//                   )}
//                </button>
//             </form>

//             <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
//                <p className="text-slate-400 text-sm font-medium">
//                   Don't have an account? <br className="lg:hidden block mb-2"/>
//                   <span className="lg:inline-block block lg:mt-0 mt-2">
//                      <Link to="/register/student" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors mx-2">Student Setup</Link>
//                      <span className="hidden lg:inline text-slate-600">|</span>
//                      <Link to="/register/faculty" className="text-purple-400 font-bold hover:text-purple-300 transition-colors mx-2">Faculty Setup</Link>
//                   </span>
//                </p>
//             </div>
//          </motion.div>
//       </div>

//       {/* FORGOT PASSWORD MODAL */}
//       <AnimatePresence>
//         {forgotModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setForgotModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></motion.div>
            
//             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-hidden z-10">
//                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
               
//                <div className="text-center mb-6">
//                   <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
//                      <KeyRound className="w-6 h-6 text-indigo-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-1">Reset Password</h3>
//                   <p className="text-xs text-slate-400 font-medium">Securely recover your account access.</p>
//                </div>

//                <div className="space-y-4">
//                   {resetStep === 1 && (
//                      <form onSubmit={handleSendResetOtp}>
//                         <div className="mb-4">
//                            <label className="text-xs font-bold text-slate-400 mb-1 block">REGISTERED EMAIL</label>
//                            <input type="email" required placeholder="you@institution.edu" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" value={resetData.email} onChange={e => setResetData({...resetData, email: e.target.value})} />
//                         </div>
//                         <button type="submit" disabled={resetLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex justify-center items-center">
//                            {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Send Recovery OTP'}
//                         </button>
//                      </form>
//                   )}

//                   {resetStep === 2 && (
//                      <form onSubmit={handleVerifyResetOtp}>
//                         <p className="text-xs text-indigo-400 mb-4 text-center font-bold bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">OTP sent to {resetData.email}</p>
//                         <div className="mb-4">
//                            <label className="text-xs font-bold text-slate-400 mb-1 block">ENTER 6-DIGIT OTP</label>
//                            <input type="text" required placeholder="123456" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-center tracking-[0.5em] font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" value={resetData.otp} onChange={e => setResetData({...resetData, otp: e.target.value})} maxLength={6} />
//                         </div>
//                         <button type="submit" disabled={resetLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex justify-center items-center">
//                            {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Verify Code'}
//                         </button>
//                      </form>
//                   )}

//                   {resetStep === 3 && (
//                      <form onSubmit={handleResetPassword}>
//                         <div className="mb-3 relative group">
//                            <label className="text-xs font-bold text-slate-400 mb-1 block">NEW PASSWORD <span className="text-[10px] lowercase font-normal">(min 8 chars)</span></label>
//                            <input type={showNewPassword ? "text" : "password"} required placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm tracking-wider pr-10" value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})} minLength={8} />
//                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-9 text-slate-500 hover:text-indigo-400">
//                                {showNewPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
//                            </button>
//                         </div>
//                         <div className="mb-5">
//                            <label className="text-xs font-bold text-slate-400 mb-1 block">CONFIRM PASSWORD</label>
//                            <input type="password" required placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm tracking-wider" value={resetData.confirmPassword} onChange={e => setResetData({...resetData, confirmPassword: e.target.value})} minLength={8} />
//                         </div>
//                         <button type="submit" disabled={resetLoading} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all flex justify-center items-center">
//                            {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <><CheckCircle className="w-4 h-4 mr-2"/> Apply New Password</>}
//                         </button>
//                      </form>
//                   )}
//                </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, LogIn, Activity, ArrowRight, Eye, EyeOff,
  KeyRound, CheckCircle, Shield, Zap, Users, X, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const FloatingOrb = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const FeatureCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col gap-1"
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <span className="text-2xl font-black text-white">{value}</span>
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
  </motion.div>
);

const StepDot = ({ step, current }) => (
  <div className="flex items-center gap-1.5">
    <motion.div
      animate={{
        backgroundColor: step <= current ? '#6366f1' : '#1e293b',
        borderColor: step <= current ? '#6366f1' : '#334155',
        scale: step === current ? 1.15 : 1,
      }}
      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
    >
      {step < current ? <CheckCircle className="w-3.5 h-3.5" /> : step}
    </motion.div>
    {step < 3 && (
      <motion.div
        animate={{ backgroundColor: step < current ? '#6366f1' : '#334155' }}
        className="w-8 h-0.5 rounded-full"
      />
    )}
  </div>
);

const InputField = ({ label, icon: Icon, right, children, error }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">{label}</label>}
    <div className="relative group">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200 z-10" />
      )}
      {children}
      {right && <div className="absolute right-4 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
    {error && <p className="text-xs text-red-400 font-medium ml-1">{error}</p>}
  </div>
);

const inputClass = (withLeft = true, withRight = false) =>
  `w-full bg-slate-900/60 border border-slate-700/70 rounded-xl py-3.5 ${withLeft ? 'pl-11' : 'pl-4'} ${withRight ? 'pr-11' : 'pr-4'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200 text-sm font-medium`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [forgotModal, setForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    setResetData(prev => ({ ...prev, otp: next.join('') }));
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const closeForgotModal = () => {
    setForgotModal(false);
    setTimeout(() => {
      setResetStep(1);
      setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '', resetToken: '' });
      setOtpDigits(['', '', '', '', '', '']);
    }, 300);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Login successful!');
      if (data.role === 'student') navigate('/student/dashboard');
      else if (data.role === 'faculty') navigate('/faculty/dashboard');
      else if (data.role === 'hod') navigate('/hod/dashboard');
      else if (data.role === 'admin') navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!resetData.email) return toast.error('Enter your email');
    setResetLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: resetData.email });
      toast.success('OTP sent to your email');
      setResetStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally { setResetLoading(false); }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    if (!resetData.otp || resetData.otp.length < 6) return toast.error('Enter complete OTP');
    setResetLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-reset-otp', { email: resetData.email, otp: resetData.otp });
      setResetData(prev => ({ ...prev, resetToken: data.resetToken }));
      toast.success('OTP verified!');
      setResetStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally { setResetLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (resetData.newPassword !== resetData.confirmPassword) return toast.error('Passwords do not match');
    setResetLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { resetToken: resetData.resetToken, newPassword: resetData.newPassword });
      toast.success('Password reset successfully!');
      closeForgotModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally { setResetLoading(false); }
  };

  const stepLabels = ['Email', 'Verify OTP', 'New Password'];

  return (
    <div className="min-h-screen bg-[#060c1a] font-sans flex text-slate-300 overflow-hidden">

      {/* Ambient background */}
      <FloatingOrb className="w-[500px] h-[500px] bg-indigo-700/20 top-[-100px] left-[-100px]" />
      <FloatingOrb className="w-[400px] h-[400px] bg-blue-600/15 bottom-[-80px] left-[30%]" />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[52%] relative flex-col justify-between p-14 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-900/20 to-transparent pointer-events-none" />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Floating decorative circle */}
        <motion.div
          className="absolute right-[-60px] top-[20%] w-80 h-80 rounded-full border border-indigo-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute right-[-30px] top-[25%] w-56 h-56 rounded-full border border-indigo-400/8"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Logo */}
        

        {/* Hero Content */}
        <div className="relative z-10 -mt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Secure Academic Platform</span>
            </div>

            <h1 className="text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Authenticate Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-400">
                Academic Hub
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-[400px] mb-10">
              Log into the unified interface to securely manage deliverables, track proposals, and interact with your departmental workflows.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            <FeatureCard icon={Zap} title="Uptime" value="99.9%" color="bg-indigo-500/20" delay={0.3} />
            <FeatureCard icon={Users} title="Active Users" value="10K+" color="bg-blue-500/20" delay={0.4} />
            <FeatureCard icon={Shield} title="Secured" value="256-bit" color="bg-sky-500/20" delay={0.5} />
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 text-xs text-slate-600 flex items-center gap-3"
        >
          <span>&copy; {new Date().getFullYear()} ProjectSphere</span>
          <span>•</span>
          <Link to="/about" className="hover:text-slate-400 transition-colors">Platform Info</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 sm:p-10 relative">
        <FloatingOrb className="w-[300px] h-[300px] bg-indigo-600/10 top-0 right-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Project<span className="text-indigo-400">Sphere</span></span>
          </div>

          {/* Card */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/8 rounded-[28px] p-8 sm:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-400 mt-1.5 text-sm font-medium">Sign in to continue to your workspace</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <InputField label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    required
                    placeholder="you@institution.edu"
                    className={inputClass(true, false)}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </InputField>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <InputField
                  icon={Lock}
                  right={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  }
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className={`${inputClass(true, true)} tracking-widest`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </InputField>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 relative group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2.5 shadow-[0_8px_32px_rgba(79,70,229,0.35)] hover:shadow-[0_8px_40px_rgba(79,70,229,0.55)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4.5 h-4.5" />
                      <span>Sign In Securely</span>
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="ml-1"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-7 border-t border-white/6"
            >
              <p className="text-slate-500 text-sm text-center mb-3 font-medium">New to ProjectSphere?</p>
              <div className="flex gap-3">
                <Link
                  to="/register/student"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-700/50 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all duration-200 group"
                >
                  Student Setup
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/register/faculty"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-700/50 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all duration-200 group"
                >
                  Faculty Setup
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-slate-600 text-xs mt-5 font-medium"
          >
            Protected by industry-standard encryption
          </motion.p>
        </motion.div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {forgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgotModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative bg-[#0c1628] border border-white/8 w-full max-w-[400px] rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden z-10"
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-500" />

              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

              {/* Close button */}
              <button
                onClick={closeForgotModal}
                className="absolute top-5 right-5 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Header */}
              <div className="text-center mb-7 relative z-10">
                <motion.div
                  key={resetStep}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 bg-gradient-to-br from-indigo-600/30 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/25 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                >
                  {resetStep === 3
                    ? <KeyRound className="w-6 h-6 text-indigo-300" />
                    : resetStep === 2
                      ? <Mail className="w-6 h-6 text-indigo-300" />
                      : <KeyRound className="w-6 h-6 text-indigo-300" />
                  }
                </motion.div>
                <h3 className="text-xl font-black text-white mb-0.5">Reset Password</h3>
                <p className="text-xs text-slate-500 font-medium">Step {resetStep} of 3 — {stepLabels[resetStep - 1]}</p>
              </div>

              {/* Step progress */}
              <div className="flex items-center justify-center mb-7">
                {[1, 2, 3].map(s => <StepDot key={s} step={s} current={resetStep} />)}
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={resetStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {resetStep === 1 && (
                    <form onSubmit={handleSendResetOtp} className="space-y-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Registered Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                          <input
                            type="email" required
                            placeholder="you@institution.edu"
                            className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm"
                            value={resetData.email}
                            onChange={e => setResetData({ ...resetData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={resetLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(99,102,241,0.3)] disabled:opacity-60">
                        {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Mail className="w-4 h-4" /> Send Recovery OTP</>}
                      </button>
                    </form>
                  )}

                  {resetStep === 2 && (
                    <form onSubmit={handleVerifyResetOtp} className="space-y-5">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-center">
                        <p className="text-xs text-indigo-300 font-semibold">OTP sent to</p>
                        <p className="text-sm text-white font-bold mt-0.5">{resetData.email}</p>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block text-center">Enter 6-Digit Code</label>
                        <div className="flex gap-2 justify-center">
                          {otpDigits.map((d, i) => (
                            <input
                              key={i}
                              id={`otp-${i}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={d}
                              onChange={e => handleOtpChange(i, e.target.value)}
                              onKeyDown={e => handleOtpKeyDown(i, e)}
                              className="w-10 h-12 text-center bg-slate-800 border border-slate-700 rounded-xl text-white font-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={resetLoading || resetData.otp.length < 6} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(99,102,241,0.3)] disabled:opacity-60">
                        {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verify Code</>}
                      </button>
                    </form>
                  )}

                  {resetStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                          New Password <span className="lowercase font-normal text-slate-500">(min. 8 chars)</span>
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required minLength={8}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm tracking-widest"
                            value={resetData.newPassword}
                            onChange={e => setResetData({ ...resetData, newPassword: e.target.value })}
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                          <input
                            type="password"
                            required minLength={8}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm tracking-widest"
                            value={resetData.confirmPassword}
                            onChange={e => setResetData({ ...resetData, confirmPassword: e.target.value })}
                          />
                        </div>
                        {resetData.confirmPassword && resetData.newPassword !== resetData.confirmPassword && (
                          <p className="text-xs text-red-400 mt-1 ml-1">Passwords do not match</p>
                        )}
                      </div>
                      <button type="submit" disabled={resetLoading} className="w-full py-3 mt-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.3)] disabled:opacity-60">
                        {resetLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Set New Password</>}
                      </button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

