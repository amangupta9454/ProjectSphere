import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ChevronRight, ExternalLink, Activity } from 'lucide-react';
import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GmailIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const shimmer = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Platform', href: '/about' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Student Login', href: '/login' },
    { label: 'Faculty Access', href: '/login' }
  ];

  const policies = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Submission Guidelines', href: '#' },
    { label: 'Code of Conduct', href: '#' }
  ];

  const socials = [
    { icon: FaGithub, label: 'GitHub', href: '#', color: 'rgba(255,255,255,0.9)' },
    { icon: FaLinkedin, label: 'LinkedIn', href: '#', color: '#0a66c2' },
    { icon: FaGoogle, label: 'Gmail', href: '#', color: '#ea4335' }
  ];

  const stats = [
    { value: '2,400+', label: 'Projects Submitted' },
    { value: '340+', label: 'Faculty Members' },
    { value: '98%', label: 'Success Rate' }
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#040a14', borderTop: '1px solid rgba(6,182,212,0.1)' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute -top-20 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }}
        />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-b"
        style={{ borderColor: 'rgba(6,182,212,0.1)', background: 'rgba(0,0,0,0.3)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-0">
            {stats.map(({ value, label }, i) => (
              <React.Fragment key={label}>
                <motion.div
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-xl font-bold text-cyan-400" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>{value}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
                </motion.div>
                {i < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(6,182,212,0.15)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
        >
          {/* Column 1: Brand */}
          <motion.div custom={0} variants={fadeUp} className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border relative overflow-hidden"
                style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}
              >
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
                  className="absolute inset-0 w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)' }}
                />
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-cyan-400 relative z-10">Project Sphere</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
                A comprehensive academic portal designed to streamline the lifecycle of Final Year Projects — bridging students, faculty, and department heads seamlessly.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 pt-1">
              {socials.map(({ icon: Icon, label, href, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="group relative p-2.5 rounded-xl border transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(148,163,184,0.1)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}40`;
                    e.currentTarget.style.background = `${color}12`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-300" style={{ '--hover-color': color }} />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div custom={1} variants={fadeUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Quick Links</h3>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
            </div>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }, idx) => (
                <li key={idx}>
                  <Link
                    to={href}
                    onMouseEnter={() => setHoveredLink(`q-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-center justify-between text-sm transition-colors duration-200"
                    style={{ color: hoveredLink === `q-${idx}` ? 'rgb(34,211,238)' : 'rgba(148,163,184,0.7)' }}
                  >
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ width: hoveredLink === `q-${idx}` ? 16 : 0, opacity: hoveredLink === `q-${idx}` ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block h-px bg-cyan-400 rounded-full overflow-hidden"
                      />
                      {label}
                    </span>
                    <ExternalLink
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Policies */}
          <motion.div custom={2} variants={fadeUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Policies</h3>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
            </div>
            <ul className="space-y-2.5">
              {policies.map(({ label, href }, idx) => (
                <li key={idx}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group flex items-center justify-between text-sm transition-colors duration-200"
                    style={{ color: 'rgba(148,163,184,0.7)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgb(34,211,238)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div custom={3} variants={fadeUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Connect</h3>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
            </div>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: '123 Academic Block, University Campus' },
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: Mail, text: 'support@institution.edu' }
              ].map(({ icon: Icon, text }, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group flex items-start gap-3 cursor-default"
                >
                  <div
                    className="p-1.5 rounded-lg border shrink-0 mt-0.5 transition-all duration-300"
                    style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.15)' }}
                  >
                    <Icon className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated divider */}
      <div className="relative h-px mx-6" style={{ background: 'rgba(148,163,184,0.06)' }}>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(14,165,233,0.2), transparent)' }}
        />
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="py-7 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.7)' }}>
            &copy; {new Date().getFullYear()} Project Sphere. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(100,116,139,0.7)' }}>
            Engineered with precision by
            <span className="font-semibold text-cyan-500">The Dev Team</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
