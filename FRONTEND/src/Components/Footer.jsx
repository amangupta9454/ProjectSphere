// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { MapPin, Phone, Mail, ChevronRight, ExternalLink, Activity } from 'lucide-react';
// import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const GmailIcon = ({ className }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
//   </svg>
// );

// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
//   })
// };

// const shimmer = {
//   initial: { x: '-100%' },
//   animate: { x: '100%' },
// };

// const Footer = () => {
//   const [hoveredLink, setHoveredLink] = useState(null);

//   const quickLinks = [
//     { label: 'Home', href: '/' },
//     { label: 'About Platform', href: '/about' },
//     { label: 'Contact Support', href: '/contact' },
//     { label: 'Student Login', href: '/login' },
//     { label: 'Faculty Access', href: '/login' }
//   ];

//   const policies = [
//     { label: 'Privacy Policy', href: '#' },
//     { label: 'Terms of Service', href: '#' },
//     { label: 'Submission Guidelines', href: '#' },
//     { label: 'Code of Conduct', href: '#' }
//   ];

//   const socials = [
//     { icon: FaGithub, label: 'GitHub', href: '#', color: 'rgba(255,255,255,0.9)' },
//     { icon: FaLinkedin, label: 'LinkedIn', href: '#', color: '#0a66c2' },
//     { icon: FaGoogle, label: 'Gmail', href: '#', color: '#ea4335' }
//   ];

//   const stats = [
//     { value: '2,400+', label: 'Projects Submitted' },
//     { value: '340+', label: 'Faculty Members' },
//     { value: '98%', label: 'Success Rate' }
//   ];

//   return (
//     <footer
//       className="relative overflow-hidden"
//       style={{ background: '#040a14', borderTop: '1px solid rgba(6,182,212,0.1)' }}
//     >
//       {/* Ambient glows */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div
//           className="absolute -top-32 left-1/4 w-96 h-96 rounded-full"
//           style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
//         />
//         <div
//           className="absolute -top-20 right-1/4 w-80 h-80 rounded-full"
//           style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }}
//         />
//         <div
//           className="absolute bottom-0 left-0 right-0 h-px"
//           style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }}
//         />
//       </div>

//       {/* Grid texture overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: 'linear-gradient(rgba(6,182,212,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.015) 1px, transparent 1px)',
//           backgroundSize: '60px 60px'
//         }}
//       />

//       {/* Stats bar */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//         className="relative z-10 border-b"
//         style={{ borderColor: 'rgba(6,182,212,0.1)', background: 'rgba(0,0,0,0.3)' }}
//       >
//         <div className="max-w-7xl mx-auto px-6 py-5">
//           <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-0">
//             {stats.map(({ value, label }, i) => (
//               <React.Fragment key={label}>
//                 <motion.div
//                   custom={i}
//                   variants={fadeUp}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   className="flex flex-col items-center gap-0.5"
//                 >
//                   <span className="text-xl font-bold text-cyan-400" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>{value}</span>
//                   <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
//                 </motion.div>
//                 {i < stats.length - 1 && (
//                   <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(6,182,212,0.15)' }} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </motion.div>

//       {/* Main content */}
//       <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: '-80px' }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
//         >
//           {/* Column 1: Brand */}
//           <motion.div custom={0} variants={fadeUp} className="space-y-6 lg:col-span-1">
//             <div className="space-y-4">
//               <div
//                 className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border relative overflow-hidden"
//                 style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}
//               >
//                 <motion.div
//                   variants={shimmer}
//                   initial="initial"
//                   animate="animate"
//                   transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
//                   className="absolute inset-0 w-full"
//                   style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)' }}
//                 />
//                 <Activity className="w-4 h-4 text-cyan-400" />
//                 <span className="text-sm font-bold text-cyan-400 relative z-10">Project Sphere</span>
//               </div>
//               <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>
//                 A comprehensive academic portal designed to streamline the lifecycle of Final Year Projects â€” bridging students, faculty, and department heads seamlessly.
//               </p>
//             </div>

//             {/* Social icons */}
//             <div className="flex gap-3 pt-1">
//               {socials.map(({ icon: Icon, label, href, color }) => (
//                 <motion.a
//                   key={label}
//                   href={href}
//                   aria-label={label}
//                   whileHover={{ y: -3, scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ type: 'spring', stiffness: 400, damping: 20 }}
//                   className="group relative p-2.5 rounded-xl border transition-colors duration-300"
//                   style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(148,163,184,0.1)' }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.borderColor = `${color}40`;
//                     e.currentTarget.style.background = `${color}12`;
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
//                     e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
//                   }}
//                 >
//                   <Icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-300" style={{ '--hover-color': color }} />
//                   <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-slate-700">
//                     {label}
//                   </span>
//                 </motion.a>
//               ))}
//             </div>
//           </motion.div>

//           {/* Column 2: Quick Links */}
//           <motion.div custom={1} variants={fadeUp} className="space-y-6">
//             <div className="flex items-center gap-3">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Quick Links</h3>
//               <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
//             </div>
//             <ul className="space-y-2.5">
//               {quickLinks.map(({ label, href }, idx) => (
//                 <li key={idx}>
//                   <Link
//                     to={href}
//                     onMouseEnter={() => setHoveredLink(`q-${idx}`)}
//                     onMouseLeave={() => setHoveredLink(null)}
//                     className="group flex items-center justify-between text-sm transition-colors duration-200"
//                     style={{ color: hoveredLink === `q-${idx}` ? 'rgb(34,211,238)' : 'rgba(148,163,184,0.7)' }}
//                   >
//                     <span className="flex items-center gap-2">
//                       <motion.span
//                         animate={{ width: hoveredLink === `q-${idx}` ? 16 : 0, opacity: hoveredLink === `q-${idx}` ? 1 : 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="inline-block h-px bg-cyan-400 rounded-full overflow-hidden"
//                       />
//                       {label}
//                     </span>
//                     <ExternalLink
//                       className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
//                     />
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Column 3: Policies */}
//           <motion.div custom={2} variants={fadeUp} className="space-y-6">
//             <div className="flex items-center gap-3">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Policies</h3>
//               <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
//             </div>
//             <ul className="space-y-2.5">
//               {policies.map(({ label, href }, idx) => (
//                 <li key={idx}>
//                   <motion.a
//                     href={href}
//                     whileHover={{ x: 4 }}
//                     transition={{ type: 'spring', stiffness: 400, damping: 25 }}
//                     className="group flex items-center justify-between text-sm transition-colors duration-200"
//                     style={{ color: 'rgba(148,163,184,0.7)' }}
//                     onMouseEnter={e => e.currentTarget.style.color = 'rgb(34,211,238)'}
//                     onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
//                   >
//                     <span className="flex items-center gap-2">
//                       <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                       {label}
//                     </span>
//                   </motion.a>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Column 4: Contact */}
//           <motion.div custom={3} variants={fadeUp} className="space-y-6">
//             <div className="flex items-center gap-3">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Connect</h3>
//               <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.3), transparent)' }} />
//             </div>
//             <ul className="space-y-4">
//               {[
//                 { icon: MapPin, text: '123 Academic Block, University Campus' },
//                 { icon: Phone, text: '+1 (555) 123-4567' },
//                 { icon: Mail, text: 'support@institution.edu' }
//               ].map(({ icon: Icon, text }, idx) => (
//                 <motion.li
//                   key={idx}
//                   whileHover={{ x: 3 }}
//                   transition={{ type: 'spring', stiffness: 400, damping: 25 }}
//                   className="group flex items-start gap-3 cursor-default"
//                 >
//                   <div
//                     className="p-1.5 rounded-lg border shrink-0 mt-0.5 transition-all duration-300"
//                     style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.15)' }}
//                   >
//                     <Icon className="w-3 h-3 text-cyan-400" />
//                   </div>
//                   <span className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.7)' }}>{text}</span>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Animated divider */}
//       <div className="relative h-px mx-6" style={{ background: 'rgba(148,163,184,0.06)' }}>
//         <motion.div
//           initial={{ scaleX: 0, originX: 0 }}
//           whileInView={{ scaleX: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(14,165,233,0.2), transparent)' }}
//         />
//       </div>

//       {/* Copyright */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.7, delay: 0.2 }}
//         className="py-7 relative z-10"
//       >
//         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
//           <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.7)' }}>
//             &copy; {new Date().getFullYear()} Project Sphere. All rights reserved.
//           </p>
//           <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(100,116,139,0.7)' }}>
//             Engineered with precision by
//             <span className="font-semibold text-cyan-500">The Dev Team</span>
//           </p>
//         </div>
//       </motion.div>
//     </footer>
//   );
// };

// export default Footer;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ChevronRight, Sparkles, Shield, ArrowUpRight, Activity } from 'lucide-react';

/* â”€â”€â”€ Inline SVG social icons â”€â”€â”€ */
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Platform', href: '/about' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Student Login', href: '/login' },
    { label: 'Faculty Access', href: '/login' },
  ];

  const policies = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Submission Guidelines', href: '#' },
    { label: 'Code of Conduct', href: '#' },
  ];

  const socials = [
    { Icon: GithubIcon,  label: 'GitHub',   href: '#', hover: 'hover:bg-slate-100 hover:border-slate-300' },
    { Icon: LinkedinIcon, label: 'LinkedIn', href: '#', hover: 'hover:bg-blue-50 hover:border-blue-200' },
    { Icon: GoogleIcon,  label: 'Gmail',     href: '#', hover: 'hover:bg-red-50 hover:border-red-200' },
  ];

  const contactItems = [
    { icon: MapPin, text: '123 Academic Block, University Campus', href: '#' },
    { icon: Phone,  text: '+1 (555) 123-4567',                     href: 'tel:+15551234567' },
    { icon: Mail,   text: 'support@institution.edu',               href: 'mailto:support@institution.edu' },
  ];

  return (
    <footer className="relative w-full bg-white border-t border-slate-100 overflow-hidden">

      {/* Static dot grid â€” no parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px',
          opacity: 0.35,
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />

      {/* â”€â”€ MAIN GRID â”€â”€ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >

          {/* â”€â”€ BRAND â”€â”€ */}
          <motion.div custom={0} variants={fadeUp} className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-sm relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'linear' }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)', width: '60%' }}
              />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-500 relative z-10" />
              </motion.div>
              <span className="text-sm font-black text-blue-700 relative z-10 tracking-tight">Project Sphere</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              A comprehensive academic portal streamlining Final Year Projects â€” bridging students, faculty, and department heads.
            </p>

            <div className="flex gap-2">
              {socials.map(({ Icon, label, href, hover }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 ${hover}`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-colors duration-200" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none shadow-lg">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <span className="text-[11px] font-semibold text-emerald-600">All systems operational</span>
            </div>
          </motion.div>

          {/* â”€â”€ QUICK LINKS â”€â”€ */}
          <motion.div custom={1} variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest whitespace-nowrap">Quick Links</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent" />
            </div>
            <ul className="space-y-0.5">
              {quickLinks.map(({ label, href }, idx) => (
                <li key={idx}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onMouseEnter={() => setHoveredLink(`q-${idx}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group flex items-center justify-between py-1 text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <motion.span
                        animate={{ width: hoveredLink === `q-${idx}` ? 12 : 0, opacity: hoveredLink === `q-${idx}` ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="inline-block h-0.5 bg-blue-500 rounded-full overflow-hidden flex-shrink-0"
                      />
                      {label}
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-400" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* â”€â”€ POLICIES â”€â”€ */}
          <motion.div custom={2} variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest whitespace-nowrap">Policies</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-300 to-transparent" />
            </div>
            <ul className="space-y-0.5">
              {policies.map(({ label, href }, idx) => (
                <li key={idx}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group flex items-center gap-2 py-1 text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* GDPR badge */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow flex-shrink-0">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">GDPR Compliant</p>
                  <p className="text-[10px] text-slate-500">Data never sold to third parties.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* â”€â”€ CONTACT â”€â”€ */}
          <motion.div custom={3} variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest whitespace-nowrap">Connect</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-teal-300 to-transparent" />
            </div>
            <ul className="space-y-2">
              {contactItems.map(({ icon: Icon, text, href }, idx) => (
                <li key={idx}>
                  <motion.a
                    href={href}
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group flex items-start gap-2.5 p-2 rounded-lg border border-transparent hover:border-blue-100 hover:bg-blue-50/60 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 border border-slate-200 group-hover:border-blue-200 flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5 shadow-sm">
                      <Icon className="w-3 h-3 text-slate-500 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-[11px] text-slate-500 group-hover:text-slate-800 transition-colors duration-200 leading-relaxed font-medium break-all">
                      {text}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* â”€â”€ DIVIDER â”€â”€ */}
      <div className="relative h-px mx-4 sm:mx-6 bg-slate-100">
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, #60a5fa 30%, #22d3ee 70%, transparent)' }}
        />
      </div>

      {/* â”€â”€ COPYRIGHT â”€â”€ */}
      <div className="relative z-10 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Project Sphere. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            Engineered by{' '}
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 ml-0.5">
              The Dev Team
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
