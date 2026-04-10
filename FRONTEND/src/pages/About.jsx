import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, Zap, LayoutDashboard, Database, ArrowRight, Sparkles, Lightbulb, Rocket } from 'lucide-react';

const FloatingOrb = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const AnimatedCounter = ({ from = 0, to, duration = 2 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let interval;
    const increment = (to - from) / (duration * 60);
    let current = from;

    interval = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [from, to, duration]);

  return <span>{count}+</span>;
};

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    viewport={{ once: true, margin: '-100px' }}
    whileHover={{ y: -8, scale: 1.03 }}
    className={`relative group rounded-2xl border border-white/8 bg-gradient-to-br ${color} p-6 overflow-hidden backdrop-blur-sm`}
  >
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

const FeatureItem = ({ icon: Icon, title, description, index, color }) => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
    viewport={{ once: true }}
    whileHover={{ x: 8 }}
    className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all duration-300 group cursor-pointer"
  >
    <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${color} shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-blue-400 transition-all">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 self-start mt-0.5 flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100" />
  </motion.div>
);

const TechTag = ({ tech, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: 'backOut' }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.08, y: -4 }}
    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 font-semibold text-sm transition-all duration-300 shadow-lg backdrop-blur-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
  >
    {tech}
  </motion.div>
);

const ImageCard = ({ src, alt, delay, rotation = 3 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
    whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
    transition={{ delay, duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: true }}
    className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-blue-600/10 group-hover:from-indigo-600/40 group-hover:to-blue-600/20 transition-all duration-500 z-20" />
    <motion.img
      src={src}
      alt={alt}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full object-cover"
    />
  </motion.div>
);

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="font-sans bg-[#050810] min-h-screen text-slate-300 overflow-hidden">
      {/* Ambient Background Elements */}
      <FloatingOrb className="w-[600px] h-[600px] bg-indigo-700/15 -top-48 -left-48" />
      <FloatingOrb className="w-[500px] h-[500px] bg-blue-600/10 bottom-1/3 right-0" />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        />

        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-indigo-500/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">About Our Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Transforming Academic<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400">
              Delivery Systems
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Project Sphere solves the fundamental data scattering crisis across global University Engineering Departments by unifying deliverables, proposals, and workflows into one beautiful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-3 justify-center"
          >
            <div className="px-5 py-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-semibold">📊 10K+ Active Users</div>
            <div className="px-5 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold">⚡ 99.9% Uptime</div>
            <div className="px-5 py-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-semibold">🔒 Enterprise Security</div>
          </motion.div>
        </div>
      </section>

      {/* ── THE PROBLEM SECTION ── */}
      <section className="relative py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="relative group order-2 md:order-1"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <ImageCard src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Problem visualization" delay={0.2} rotation={-2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-3xl font-black text-white">The Core Problem</h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-5"
              >
                <motion.p variants={itemVariants} className="text-slate-400 leading-relaxed">
                  Universities worldwide rely on legacy platforms, scattered spreadsheets, and endless email chains to track Final Year Projects. This methodology <span className="text-red-400 font-semibold">catastrophically fails</span> when managing thousands of deliverables simultaneously.
                </motion.p>

                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 my-6">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-2xl font-black text-red-400">40%</p>
                    <p className="text-xs text-slate-400 mt-1">Time Lost</p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <p className="text-2xl font-black text-orange-400">70%</p>
                    <p className="text-xs text-slate-400 mt-1">Data Scattered</p>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                    <p className="text-2xl font-black text-yellow-400">∞</p>
                    <p className="text-xs text-slate-400 mt-1">Frustration</p>
                  </div>
                </motion.div>

                <motion.p variants={itemVariants} className="text-slate-400 leading-relaxed">
                  Administrators lose oversight, faculty struggle with capacity planning, and students lack transparency into their project progression.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION SECTION ── */}
      <section className="relative py-28 border-t border-white/5">
        <FloatingOrb className="w-[400px] h-[400px] bg-emerald-600/10 top-1/2 left-0 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white">Our Solution</h2>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-slate-400 leading-relaxed mb-8"
              >
                By architecting a modern, scalable MERN stack ecosystem deployed globally, we eliminate friction entirely—leaving only beautiful code and seamless workflows.
              </motion.p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                <FeatureItem
                  icon={Users}
                  title="Role-Based Access Control"
                  description="Cryptographic boundaries for Students, Faculty, HODs, and Admins"
                  index={0}
                  color="bg-indigo-500/20"
                />
                <FeatureItem
                  icon={LayoutDashboard}
                  title="Visual Intelligence Dashboards"
                  description="Spatial timelines and real-time analytics replacing text-heavy confusion"
                  index={1}
                  color="bg-purple-500/20"
                />
                <FeatureItem
                  icon={Database}
                  title="Global Cloud Infrastructure"
                  description="Secure CDN delivery and instant sync across all departments worldwide"
                  index={2}
                  color="bg-cyan-500/20"
                />
                <FeatureItem
                  icon={Rocket}
                  title="Enterprise Performance"
                  description="Sub-millisecond query response times with automated failover"
                  index={3}
                  color="bg-blue-500/20"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-cyan-600/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <ImageCard src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Solution dashboard" delay={0.2} rotation={2} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="relative py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-3">Impact by Numbers</h2>
            <p className="text-slate-400 text-lg">Real results from our global deployment</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <StatCard icon={Users} label="Active Users" value="10K+" color="from-indigo-600/10 to-blue-600/10" delay={0} />
            <StatCard icon={Zap} label="Uptime" value="99.9%" color="from-emerald-600/10 to-cyan-600/10" delay={0.1} />
            <StatCard icon={Database} label="Projects Tracked" value="5K+" color="from-purple-600/10 to-pink-600/10" delay={0.2} />
            <StatCard icon={Rocket} label="Departments" value="200+" color="from-orange-600/10 to-red-600/10" delay={0.3} />
          </motion.div>
        </div>
      </section>

      {/* ── TECH STACK SECTION ── */}
      <section className="relative py-28 border-t border-white/5">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-3">Technology Stack</h2>
            <p className="text-slate-400 text-lg">Enterprise-grade tools powering our platform</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              'React 19', 'Node.JS', 'Express.JS', 'MongoDB Atlas', 'Supabase',
              'TailwindCSS V4', 'Framer Motion', 'Cloudinary', 'JWT Auth', 'Stripe'
            ].map((tech, i) => (
              <TechTag key={i} tech={tech} delay={i * 0.05} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VISION SECTION ── */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden">
        <FloatingOrb className="w-[700px] h-[700px] bg-indigo-700/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Our Mission</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight"
          >
            Liberating Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Creativity</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-medium"
          >
            We envision universities unburdened by logistics—where faculty mentor brilliance, students create freely, and administrators orchestrate seamlessly. All powered by <span className="text-indigo-300 font-semibold">invisible, beautiful code</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20">
              <Rocket className="w-4.5 h-4.5" />
              Get Started
            </a>
            <a href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-indigo-500/30 text-white font-bold rounded-xl transition-all duration-300">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
