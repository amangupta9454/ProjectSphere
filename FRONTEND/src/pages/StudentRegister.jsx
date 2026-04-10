// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Mail, Lock, User, Phone, BookOpen, Settings, ArrowRight, UserPlus, Hash, Camera, Activity, EyeOff, Eye } from 'lucide-react';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-sm";
// const selectClass = "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium appearance-none text-sm";

// const StudentRegister = () => {
//   const [formData, setFormData] = useState({
//     name: '', email: '', password: '', mobileNumber: '',
//     course: 'B.Tech', branch: 'CSE', year: '4', section: 'A',
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);

//   const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePhoto(file);
//       setPhotoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const dataPayload = new FormData();
//     Object.keys(formData).forEach(key => dataPayload.append(key, formData[key]));
//     if (profilePhoto) dataPayload.append('profilePhoto', profilePhoto);

//     try {
//       const { data } = await axios.post('/api/auth/register/student', dataPayload, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       toast.success(data.message || 'Registered! Check your email for the OTP.');
//       navigate('/verify-email', { state: { email: formData.email } });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen font-sans flex text-slate-300" style={{ background: '#040a14' }}>
      
//       {/* LEFT PANE - Visual/Info */}
//       <div className="hidden lg:flex w-1/2 relative flex-col p-12 overflow-hidden border-r border-slate-800/50" style={{ background: '#040a14' }}>
//          {/* Glow blobs */}
//          <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
//          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(50px)' }} />

//          {/* Logo */}
//          <div className="relative z-10 mb-12">
//            <Link to="/" className="inline-flex items-center gap-3">
//               <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50">
//                 <Activity className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-white tracking-tight">Project<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Gateway</span></span>
//            </Link>
//          </div>

//          {/* Main content */}
//          <div className="relative z-10 flex-1 flex flex-col justify-center">
//              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
//                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//                  Student Portal
//                </span>
//              </motion.div>

//              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
//                 Begin Your <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Academic Journey</span>
//              </motion.h1>

//              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 text-base mb-8 max-w-md leading-relaxed">
//                 Create your profile, connect with faculty guides, and manage all final-year project deliverables in one secure platform.
//              </motion.p>

//              {/* Feature bullets */}
//              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3 mb-8">
//                {[
//                  { icon: '🎯', text: 'Submit structured project proposals' },
//                  { icon: '👨‍🏫', text: 'Get matched with expert faculty guides' },
//                  { icon: '☁️', text: 'Upload deliverables to secure cloud vault' },
//                  { icon: '📊', text: 'Track approval status in real-time' },
//                ].map(({ icon, text }) => (
//                  <div key={text} className="flex items-center gap-3">
//                    <span className="text-base w-7 shrink-0">{icon}</span>
//                    <span className="text-sm text-slate-400 font-medium">{text}</span>
//                  </div>
//                ))}
//              </motion.div>

//              {/* Stats cards */}
//              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-3">
//                {[
//                  { value: '500+', label: 'Students', color: 'text-indigo-400' },
//                  { value: '50+', label: 'Faculty', color: 'text-purple-400' },
//                  { value: '98%', label: 'Success', color: 'text-cyan-400' },
//                ].map(({ value, label, color }) => (
//                  <div key={label} className="rounded-xl p-3.5 border border-slate-800 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
//                    <div className={`text-xl font-black ${color} mb-0.5`}>{value}</div>
//                    <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{label}</div>
//                  </div>
//                ))}
//              </motion.div>
//          </div>

//          {/* Bottom footer text */}
//          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/50">
//            <p className="text-xs font-medium text-slate-600 flex items-center gap-3">
//              <span>&copy; {new Date().getFullYear()} Project Gateway</span>
//              <span className="text-slate-800">•</span>
//              <Link to="/about" className="hover:text-indigo-400 transition-colors">About Platform</Link>
//            </p>
//          </div>
//       </div>

//       {/* RIGHT PANE - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto">
//          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none fixed"></div>

//          <motion.div 
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="w-full max-w-lg relative z-10 bg-slate-800/40 p-8 sm:p-10 rounded-[2rem] border border-slate-700/50 shadow-2xl backdrop-blur-xl my-8"
//          >
//             <div className="mb-8">
//                <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Registration</h2>
//                <p className="text-slate-400 mt-2 text-sm font-medium">Setup your portal identity</p>
//             </div>

//             <form onSubmit={handleRegister} className="space-y-4">
              
//               {/* Profile Photo Upload */}
//               <div className="flex flex-col items-center mb-6">
//                 <div className="relative group cursor-pointer">
//                   <div className="w-24 h-24 rounded-full border border-slate-600 flex items-center justify-center bg-slate-900/50 overflow-hidden transition-all group-hover:border-indigo-500 shadow-inner">
//                     {photoPreview ? (
//                       <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
//                     ) : (
//                       <Camera className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors" />
//                     )}
//                   </div>
//                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handlePhotoChange} />
//                   <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 shadow-[0_0_10px_rgba(79,70,229,0.5)] scale-0 group-hover:scale-100 transition-transform z-20">
//                     <Camera className="w-3 h-3 text-white" />
//                   </div>
//                 </div>
//                 <p className="text-xs font-bold text-slate-500 mt-3 tracking-wide">UPLOAD AVATAR</p>
//               </div>

//               {/* Name + Mobile */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">FULL NAME</label>
//                   <div className="relative group">
//                     <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <input type="text" required className={inputClass} placeholder="John Doe" value={formData.name} onChange={set('name')} />
//                   </div>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">MOBILE NUMBER</label>
//                   <div className="relative group">
//                     <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <input type="text" required className={inputClass} placeholder="10-digit number" value={formData.mobileNumber} onChange={set('mobileNumber')} />
//                   </div>
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-1.5 border-t border-slate-700/50 pt-4 mt-2">
//                 <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">UNIVERSITY EMAIL</label>
//                 <div className="relative group">
//                   <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                   <input type="email" required className={inputClass} placeholder="you@institution.edu" value={formData.email} onChange={set('email')} />
//                 </div>
//               </div>

//               {/* Course + Branch */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">COURSE</label>
//                   <div className="relative group">
//                     <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <select className={selectClass} value={formData.course} onChange={set('course')}>
//                       <option value="B.Tech">B.Tech</option>
//                       <option value="M.Tech">M.Tech</option>
//                       <option value="BCA">BCA</option>
//                       <option value="MCA">MCA</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">BRANCH</label>
//                   <div className="relative group">
//                     <Settings className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <select className={selectClass} value={formData.branch} onChange={set('branch')}>
//                       <option value="CSE">CSE</option>
//                       <option value="IT">IT</option>
//                       <option value="ECE">ECE</option>
//                       <option value="ME">ME</option>
//                       <option value="CE">CE</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Year + Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">YEAR</label>
//                   <div className="relative group">
//                     <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <select className={selectClass} value={formData.year} onChange={set('year')}>
//                       <option value="1">1st Year</option>
//                       <option value="2">2nd Year</option>
//                       <option value="3">3rd Year</option>
//                       <option value="4">4th Year</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">SECTION</label>
//                   <div className="relative group">
//                     <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                     <select className={selectClass} value={formData.section} onChange={set('section')}>
//                       <option value="A">Section A</option>
//                       <option value="B">Section B</option>
//                       <option value="C">Section C</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-1.5 border-t border-slate-700/50 pt-4 mt-2">
//                 <label className="text-xs font-bold text-slate-300 ml-1 tracking-wide">SECURE PASSWORD <span className="text-[10px] text-slate-500 font-normal lowercase">(min 8)</span></label>
//                 <div className="relative group">
//                   <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
//                   <input
//                     type={showPassword ? "text" : "password"} required minLength={8}
//                     className={`${inputClass} tracking-wider pr-12`} placeholder="••••••••"
//                     value={formData.password} onChange={set('password')}
//                   />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none">
//                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit */}
//               <button type="submit" disabled={loading} className="w-full relative group bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl py-3.5 mt-8 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-70 border border-indigo-500">
//                 {loading
//                   ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   : <><UserPlus className="w-5 h-5"/> <span>Create Secure ID</span><ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></>
//                 }
//               </button>
//             </form>

//             <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
//                <p className="text-slate-400 text-sm font-medium">
//                   Already have an account?
//                   <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-2">Sign In</Link>
//                </p>
//             </div>
//          </motion.div>
//       </div>

//     </div>
//   );
// };

// export default StudentRegister;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, BookOpen, Settings, ArrowRight, UserPlus, Hash, Camera, Activity, EyeOff, Eye, Sparkles, GraduationCap, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const inputClass = "w-full bg-slate-900/60 border border-slate-700/80 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/70 transition-all duration-200 font-medium text-sm";
const selectClass = "w-full bg-slate-900/60 border border-slate-700/80 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/70 transition-all duration-200 font-medium appearance-none text-sm";

const FloatingOrb = ({ style, animate }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={animate}
    transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
  />
);

const FeatureItem = ({ icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 group"
  >
    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
      style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
      <span className="text-xs">{icon}</span>
    </div>
    <span className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">{text}</span>
  </motion.div>
);

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobileNumber: '',
    course: 'B.Tech', branch: 'CSE', year: '4', section: 'A',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataPayload = new FormData();
    Object.keys(formData).forEach(key => dataPayload.append(key, formData[key]));
    if (profilePhoto) dataPayload.append('profilePhoto', profilePhoto);
    try {
      const { data } = await axios.post('/api/auth/register/student', dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(data.message || 'Registered! Check your email for the OTP.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stagger = (i) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 * i, duration: 0.3 } });

  return (
    <div className="min-h-screen font-sans flex text-slate-300 overflow-hidden" style={{ background: '#040c18' }}>

      {/* LEFT PANE */}
      <div className="hidden lg:flex w-[45%] relative flex-col overflow-hidden border-r border-slate-800/60" style={{ background: 'linear-gradient(135deg, #040c18 0%, #060d1f 100%)' }}>

        {/* Animated background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Orbs */}
        <FloatingOrb
          style={{ top: '-80px', left: '-80px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        />
        <FloatingOrb
          style={{ bottom: '60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        />
        <FloatingOrb
          style={{ top: '50%', left: '30%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(30px)' }}
          animate={{ y: [-20, 20, -20] }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="p-2 rounded-xl shadow-lg border border-blue-500/30"
                style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Project<span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee)' }}>Sphere</span>
              </span>
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-10 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border"
              style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Student Portal
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4"
          >
            Begin Your<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)' }}>
              Academic Journey
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            className="text-slate-400 text-sm mb-7 max-w-xs leading-relaxed">
            Create a student profile to access project repositories, connect with expert guides, and manage all final-year deliverables securely.
          </motion.p>

          {/* Features */}
          <div className="space-y-2.5 mb-8">
            {[
              { icon: '🎯', text: 'Submit structured project proposals', delay: 0.32 },
              { icon: '👨‍🏫', text: 'Get matched with expert faculty guides', delay: 0.36 },
              { icon: '☁️', text: 'Upload deliverables to secure cloud', delay: 0.40 },
              { icon: '📊', text: 'Track approval status in real-time', delay: 0.44 },
            ].map((f) => <FeatureItem key={f.text} {...f} />)}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-2.5 mb-auto"
          >
            {[
              { value: '500+', label: 'Students', color: '#60a5fa' },
              { value: '50+', label: 'Faculty', color: '#22d3ee' },
              { value: '98%', label: 'Success', color: '#34d399' },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-xl p-3 border border-slate-800/80 text-center transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/20"
                style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="text-xl font-black mb-0.5" style={{ color }}>{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Decorative card at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="mt-6 rounded-xl p-4 border border-blue-500/15 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(8,145,178,0.06))' }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }} />
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300 mb-0.5">Secure & Encrypted</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Your academic data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/50">
            <p className="text-[11px] font-medium text-slate-600 flex items-center gap-3">
              <span>&copy; {new Date().getFullYear()} Project Sphere</span>
              <span className="text-slate-800">•</span>
              <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-6 relative overflow-y-auto">

        {/* BG glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-xl my-4"
          style={{ background: 'rgba(8,18,36,0.85)' }}
        >
          {/* Form header accent line */}
          <div className="h-px w-full rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(6,182,212,0.4), transparent)' }} />

          <div className="p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Student Registration</h2>
                <p className="text-slate-500 mt-0.5 text-xs font-medium">Setup your portal identity below</p>
              </div>
              <div className="p-2 rounded-xl border border-blue-500/20 bg-blue-500/8">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">

              {/* Avatar Upload */}
              <motion.div {...stagger(1)} className="flex items-center gap-4 p-3 rounded-xl border border-slate-700/60 bg-slate-900/30">
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900/70 overflow-hidden transition-all group-hover:border-blue-500/60">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-blue-600 rounded-full p-1 shadow-lg scale-0 group-hover:scale-100 transition-transform border border-slate-900">
                    <Camera className="w-2.5 h-2.5 text-white" />
                  </div>
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handlePhotoChange} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">Profile Photo</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Click avatar to upload image</p>
                </div>
              </motion.div>

              {/* Name + Mobile */}
              <motion.div {...stagger(2)} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type="text" required className={inputClass} placeholder="John Doe" value={formData.name} onChange={set('name')} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input type="text" required className={inputClass} placeholder="10-digit" value={formData.mobileNumber} onChange={set('mobileNumber')} />
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div {...stagger(3)} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="email" required className={inputClass} placeholder="you@institution.edu" value={formData.email} onChange={set('email')} />
                </div>
              </motion.div>

              {/* Course + Branch */}
              <motion.div {...stagger(4)} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Course</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select className={selectClass} value={formData.course} onChange={set('course')}>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Branch</label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select className={selectClass} value={formData.branch} onChange={set('branch')}>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Year + Section */}
              <motion.div {...stagger(5)} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Year</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select className={selectClass} value={formData.year} onChange={set('year')}>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">Section</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select className={selectClass} value={formData.section} onChange={set('section')}>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Password */}
              <motion.div {...stagger(6)} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-0.5 tracking-wider uppercase">
                  Password <span className="text-slate-600 lowercase font-normal">(min 8 chars)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type={showPassword ? "text" : "password"} required minLength={8}
                    className={`${inputClass} tracking-wider pr-10`} placeholder="••••••••"
                    value={formData.password} onChange={set('password')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div {...stagger(7)}>
                <button
                  type="submit" disabled={loading}
                  className="w-full relative group overflow-hidden text-white font-bold rounded-xl py-3 mt-1 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 border border-blue-500/40"
                  style={{ background: loading ? '#1d4ed8' : 'linear-gradient(135deg, #1d4ed8, #0891b2)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', transform: 'skewX(-20deg) translateX(-200%)', animation: 'none' }} />
                  <div className="relative flex items-center gap-2">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Secure Account</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>

            {/* Sign in link */}
            <div className="mt-4 pt-4 border-t border-slate-800/70 flex items-center justify-between">
              <p className="text-slate-500 text-xs font-medium">
                Already registered?{' '}
                <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Sign In</Link>
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                <Zap className="w-3 h-3 text-blue-500/60" />
                <span>Secure Registration</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default StudentRegister;
