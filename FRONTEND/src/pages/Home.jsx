import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, BookOpen, ShieldCheck, UploadCloud,
  Users, FileText, CheckCircle, ChevronRight, Zap,
  GitBranch, Lock, BarChart2, Sparkles, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

function InView({ children, className = '', once = true, margin = '-60px' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: BookOpen,
    label: 'Structured Proposals',
    desc: 'Students submit formatted domain scopes and descriptions directly to the department for rapid, auditable review.',
    border: 'hover:border-cyan-500/40',
    glow: 'from-cyan-500/10',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    accentBar: 'bg-cyan-500',
  },
  {
    icon: ShieldCheck,
    label: 'Hierarchical Approvals',
    desc: 'Multi-tiered verification maps HOD conditional clearances sequentially to designated faculty guides.',
    border: 'hover:border-blue-500/40',
    glow: 'from-blue-500/10',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
    accentBar: 'bg-blue-500',
  },
  {
    icon: UploadCloud,
    label: 'Cloud Deliverables',
    desc: 'Secure Cloudinary integration handles zipped source bundles and compressed presentations with enterprise-grade reliability.',
    border: 'hover:border-teal-500/40',
    glow: 'from-teal-500/10',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    iconColor: 'text-teal-400',
    accentBar: 'bg-teal-500',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Student Maps Scope',
    desc: 'The lifecycle begins when a student drafts their project idea and registers to the portal network.',
    accent: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400',
    line: 'bg-gradient-to-b from-cyan-500/40 via-blue-500/20 to-transparent',
  },
  {
    num: '02',
    title: 'HOD Assignment',
    desc: 'Department Heads review the global project pool and actively assign proposals to authorised faculty handlers.',
    accent: 'border-blue-500/40 bg-blue-500/5 text-blue-400',
    line: 'bg-gradient-to-b from-blue-500/40 via-teal-500/20 to-transparent',
  },
  {
    num: '03',
    title: 'Vault Uploads Active',
    desc: 'Upon faculty acceptance the student dashboard unlocks the secure artifact vault for all deliverable uploads.',
    accent: 'border-teal-500/40 bg-teal-500/5 text-teal-400',
    line: null,
  },
];

const PILLS = [
  { icon: GitBranch, text: 'Version-tracked submissions' },
  { icon: Lock, text: 'Role-based access control' },
  { icon: BarChart2, text: 'Real-time status dashboard' },
  { icon: Zap, text: 'Instant faculty notifications' },
  { icon: FileText, text: 'Automated audit trail' },
  { icon: Users, text: 'Multi-role collaboration' },
  { icon: TrendingUp, text: 'Progress analytics' },
  { icon: Sparkles, text: 'Smart assignment engine' },
];

export default function Home() {
  return (
    <div
      className="font-sans min-h-screen text-slate-300 overflow-x-hidden"
      style={{ background: '#020810' }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 pb-16 sm:pt-8 lg:pt-12 lg:pb-32 overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.09) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-64 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-64 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
              <span
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(6,182,212,0.07)', borderColor: 'rgba(6,182,212,0.22)', color: '#22d3ee' }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                </span>
                Portal System Active
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-[clamp(2.4rem,7.5vw,5.8rem)] font-black tracking-tight leading-[0.92] mb-6 sm:mb-8 text-white"
            >
              ProjectSphere
              <br />
              
            </motion.h1>

            <style>{`
              @keyframes shimmer {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            >
              The central hub for academic project reviews — connecting students with faculty, managing deliverables in the cloud, and eliminating every paperwork bottleneck.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link
                to="/register/student"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 w-full sm:w-auto justify-center"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #38bdf8)', color: '#020810', boxShadow: '0 0 40px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(6,182,212,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-300 border transition-all duration-300 w-full sm:w-auto justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(148,163,184,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                How It Works
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-600">
              {['No setup fees', 'Instant access', 'Secure & private'].map((item, i) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-cyan-600" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard mock */}
          <InView className="mt-16 lg:mt-20 max-w-5xl mx-auto" margin="-20px">
            <motion.div variants={fadeUp}>
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(148,163,184,0.1)',
                  boxShadow: '0 0 0 1px rgba(6,182,212,0.08), 0 50px 100px rgba(0,0,0,0.7), 0 0 80px rgba(6,182,212,0.06)',
                }}
              >
                {/* Glow top edge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }} />

                {/* Browser chrome */}
                <div
                  className="flex items-center gap-3 px-5 py-3.5 border-b"
                  style={{ background: 'rgba(10,18,36,0.98)', borderColor: 'rgba(148,163,184,0.08)' }}
                >
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.7)' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                  </div>
                  <div className="flex-1 mx-4">
                    <div
                      className="max-w-[280px] mx-auto h-6 rounded-md flex items-center px-3 text-xs text-slate-500"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <span className="mr-2 opacity-40">🔒</span> portal.university.edu/dashboard
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="w-2.5 h-0.5 rounded-full bg-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard body */}
                <div
                  className="grid grid-cols-1 md:grid-cols-4 gap-0"
                  style={{ background: 'rgba(4,10,20,0.98)' }}
                >
                  {/* Sidebar */}
                  <div className="hidden md:block border-r p-4 space-y-1" style={{ borderColor: 'rgba(148,163,184,0.07)' }}>
                    <div className="px-3 py-1.5 mb-3">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Navigation</p>
                    </div>
                    {[
                      { label: 'Dashboard', active: true },
                      { label: 'My Project', active: false },
                      { label: 'Submissions', active: false },
                      { label: 'Faculty', active: false },
                      { label: 'Documents', active: false },
                    ].map(({ label, active }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
                        style={active ? { background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.15)', color: '#22d3ee' } : { color: 'rgba(148,163,184,0.5)' }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                        <span className={active ? 'font-semibold' : ''}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="md:col-span-3 p-5 md:p-6 space-y-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 mb-0.5">Welcome back</p>
                        <p className="text-sm font-bold text-white">Ahmad Raza's Dashboard</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400"
                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Active Project
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Project Status', value: 'Approved', color: 'text-green-400', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.15)' },
                        { label: 'Assigned Faculty', value: 'Dr. Ahmad', color: 'text-cyan-400', bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.15)' },
                        { label: 'Files Uploaded', value: '4 / 6', color: 'text-blue-400', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)' },
                      ].map(({ label, value, color, bg, border }) => (
                        <div key={label} className="rounded-xl p-3.5" style={{ background: bg, border: `1px solid ${border}` }}>
                          <p className="text-xs text-slate-500 mb-1">{label}</p>
                          <p className={`text-sm font-bold ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress card */}
                    <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Submission Progress</p>
                        <span className="text-xs text-cyan-400 font-bold">67%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #22d3ee)', backgroundSize: '200% auto' }}
                          initial={{ width: 0 }}
                          animate={{ width: '67%' }}
                          transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { name: 'Project Proposal.pdf', done: true },
                          { name: 'Source Code v1.zip', done: true },
                          { name: 'Presentation Final.pptx', done: false },
                        ].map(({ name, done }) => (
                          <div key={name} className="flex items-center gap-2 text-xs">
                            <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-cyan-400' : 'text-slate-700'}`} />
                            <span className={done ? 'text-slate-400' : 'text-slate-600'}>{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <section
        className="relative py-12 sm:py-16 border-y overflow-hidden"
        style={{ borderColor: 'rgba(148,163,184,0.07)', background: 'rgba(6,182,212,0.02)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />
        <InView className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '500+', label: 'Active Students', icon: Users },
              { value: '50+', label: 'Faculty Members', icon: BookOpen },
              { value: '12K', label: 'Files Stored', icon: UploadCloud },
              { value: '100%', label: 'Digital Workflow', icon: Zap, accent: true },
            ].map(({ value, label, icon: Icon, accent }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="relative text-center p-6 rounded-2xl group cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accent ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div className={`w-8 h-8 mx-auto mb-3 rounded-lg flex items-center justify-center ${accent ? 'bg-cyan-500/10' : 'bg-slate-800/80'}`}>
                  <Icon className={`w-4 h-4 ${accent ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <div
                  className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 tracking-tight ${accent ? 'text-cyan-400' : 'text-white'}`}
                  style={accent ? { textShadow: '0 0 30px rgba(6,182,212,0.5)' } : {}}
                >
                  {value}
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </InView>
      </section>

      {/* ─── CAPABILITY PILLS ─────────────────────────────────────────────── */}
      <div className="relative py-6 overflow-hidden border-b" style={{ borderColor: 'rgba(148,163,184,0.06)' }}>
        <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 no-scrollbar max-w-7xl mx-auto flex-wrap justify-center">
          {PILLS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-slate-400 border whitespace-nowrap transition-all duration-200 cursor-default hover:text-slate-300"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(148,163,184,0.1)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)'; e.currentTarget.style.background = 'rgba(6,182,212,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <Icon className="w-3.5 h-3.5 text-slate-500" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <InView>
            <motion.div variants={fadeUp} className="text-center mb-14 sm:mb-20">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#22d3ee' }}
              >
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                Enterprise-Grade Tools
                <br />
                <span className="text-slate-400 font-normal text-2xl sm:text-3xl md:text-4xl">Built for Academia</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
                We built the Project Sphere to eliminate paperwork constraints and structural bottlenecks within university departments.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {FEATURES.map(({ icon: Icon, label, desc, border, glow, iconBg, iconColor, accentBar }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`group relative rounded-2xl p-7 sm:p-8 border border-slate-800/80 ${border} transition-all duration-500 overflow-hidden cursor-default`}
                  style={{ background: 'rgba(12,20,38,0.7)', backdropFilter: 'blur(16px)' }}
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  {/* Top accent */}
                  <div className={`absolute top-0 left-8 right-8 h-px ${accentBar} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className={`relative w-12 h-12 ${iconBg} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <h3 className="relative text-base sm:text-lg font-bold text-white mb-3">{label}</h3>
                  <p className="relative text-sm text-slate-400 leading-relaxed">{desc}</p>

                  <div className="relative mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-600 group-hover:text-slate-500 transition-colors">
                    Learn more <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </InView>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section
        className="py-24 sm:py-32 relative border-t overflow-hidden"
        style={{ borderColor: 'rgba(148,163,184,0.07)', background: 'rgba(255,255,255,0.01)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <InView>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
              {/* Left */}
              <div>
                <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#22d3ee' }}>
                  The Workflow
                </motion.span>
                <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                  Designed for
                  <br />Seamless Operations
                </motion.h2>
                <motion.p variants={fadeUp} className="text-slate-400 mb-12 leading-relaxed text-sm sm:text-base">
                  Our portal ensures complex administrative logic never hinders academic progression. The mapping is intentionally linear, auditable, and fast.
                </motion.p>

                <div className="relative space-y-0">
                  {STEPS.map(({ num, title, desc, accent, line }) => (
                    <motion.div key={num} variants={fadeUp} className="relative flex gap-5 sm:gap-6">
                      {line && (
                        <div className={`absolute left-[21px] top-[52px] w-px h-[calc(100%)] ${line}`} />
                      )}
                      <div className={`shrink-0 w-[43px] h-[43px] rounded-xl border ${accent} flex items-center justify-center text-xs font-black`}>
                        {num}
                      </div>
                      <div className="pb-10">
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <motion.div variants={fadeUp} className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.12) 100%)',
                    filter: 'blur(50px)',
                    transform: 'scale(0.9)',
                  }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(148,163,184,0.1)',
                    background: 'rgba(12,20,38,0.9)',
                    boxShadow: '0 0 0 1px rgba(6,182,212,0.08), 0 30px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Top edge glow */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />

                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Students collaborating"
                    className="w-full aspect-[4/3] object-cover opacity-20"
                  />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8"
                    style={{ background: 'linear-gradient(180deg, rgba(4,10,20,0.5) 0%, rgba(4,10,20,0.85) 100%)' }}
                  >
                    <div className="w-full max-w-sm space-y-3">
                      {[
                        { label: 'Proposal Submitted', status: 'complete', color: 'text-cyan-400', dot: 'bg-cyan-400', border: 'rgba(6,182,212,0.2)' },
                        { label: 'HOD Review', status: 'complete', color: 'text-cyan-400', dot: 'bg-cyan-400', border: 'rgba(6,182,212,0.2)' },
                        { label: 'Faculty Assigned', status: 'active', color: 'text-blue-400', dot: 'bg-blue-400', border: 'rgba(59,130,246,0.25)' },
                        { label: 'Vault Access Unlocked', status: 'pending', color: 'text-slate-500', dot: 'bg-slate-700', border: 'rgba(255,255,255,0.06)' },
                      ].map(({ label, status, color, dot, border }) => (
                        <div
                          key={label}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}` }}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 ${dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
                          <span className={`text-xs font-semibold flex-1 ${color}`}>{label}</span>
                          {status === 'complete' && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          {status === 'active' && <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 animate-spin border-t-transparent shrink-0" />}
                          {status === 'pending' && <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </InView>
        </div>
      </section>

      {/* ─── ROLE CARDS ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-28 relative border-t overflow-hidden" style={{ borderColor: 'rgba(148,163,184,0.07)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <InView>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}
              >
                Role-Based Access
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                A Portal Built for Everyone
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  role: 'Student',
                  icon: Users,
                  desc: 'Submit proposals, track approval status, upload deliverables and communicate directly with assigned faculty.',
                  cta: { label: 'Register as Student', to: '/register/student' },
                  accent: 'border-cyan-500/25 hover:border-cyan-500/40',
                  badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                  ctaBg: 'linear-gradient(135deg, #22d3ee, #38bdf8)',
                  ctaColor: '#020810',
                  glowColor: 'rgba(6,182,212,0.1)',
                },
                {
                  role: 'Faculty',
                  icon: BookOpen,
                  desc: 'Review assigned projects, provide structured feedback, manage deliverable milestones and report to the department.',
                  cta: { label: 'Register as Faculty', to: '/register/faculty' },
                  accent: 'border-blue-500/25 hover:border-blue-500/40',
                  badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  ctaBg: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  ctaColor: '#020810',
                  glowColor: 'rgba(59,130,246,0.1)',
                },
                {
                  role: 'HOD',
                  icon: ShieldCheck,
                  desc: 'Oversee department-wide project pools, assign projects to faculty, enforce approvals and monitor overall progress.',
                  cta: { label: 'HOD Access', to: '/login' },
                  accent: 'border-teal-500/25 hover:border-teal-500/40',
                  badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
                  ctaBg: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
                  ctaColor: '#020810',
                  glowColor: 'rgba(20,184,166,0.1)',
                },
              ].map(({ role, icon: Icon, desc, cta, accent, badgeColor, ctaBg, ctaColor, glowColor }) => (
                <motion.div
                  key={role}
                  variants={fadeUp}
                  className={`group relative rounded-2xl p-7 sm:p-8 border border-slate-800/80 ${accent} transition-all duration-300 flex flex-col overflow-hidden`}
                  style={{ background: 'rgba(12,20,38,0.7)', backdropFilter: 'blur(16px)' }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${glowColor} 0%, transparent 65%)` }}
                  />
                  <div className="relative flex-1 flex flex-col">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 w-fit ${badgeColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {role}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">{desc}</p>
                    <Link
                      to={cta.to}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold w-fit group-hover:scale-[1.03] transition-transform duration-200"
                      style={{ background: ctaBg, color: ctaColor }}
                    >
                      {cta.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </InView>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-t" style={{ borderColor: 'rgba(148,163,184,0.07)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
        />
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[600, 800, 1000].map(size => (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size, height: size,
                border: '1px solid rgba(6,182,212,0.04)',
              }}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <InView>
            <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#22d3ee' }}>
              Ready to Begin?
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-[0.93]">
              Optimize Your
              <br />Academic Workflow
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-sm sm:text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Join hundreds of students and faculty using one unified workspace to manage projects from proposal to final submission.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register/student"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 w-full sm:w-auto justify-center"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #38bdf8)', color: '#020810', boxShadow: '0 0 50px rgba(6,182,212,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 70px rgba(6,182,212,0.5)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(6,182,212,0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Access Portal Gateway
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-slate-300 border transition-all duration-300 w-full sm:w-auto justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(148,163,184,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                Sign In
              </Link>
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
     
    </div>
  );
}
