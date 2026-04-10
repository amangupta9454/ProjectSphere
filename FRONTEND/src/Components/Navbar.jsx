import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 font-sans ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md shadow-sm border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
  <div className="p-1 bg-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform border border-indigo-400">
    <img 
      src="/logo.png" 
      alt="ProjectSphere Logo" 
      className="w-12 h-12 object-contain"
    />
  </div>

  <span className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
    Project
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
      Sphere
    </span>
  </span>
</Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8">
              {links.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.includes(link.path));
                return (
                  <li key={link.name}>
                    <Link to={link.path} className={`text-sm font-bold transition-colors relative group tracking-wide ${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'text-slate-400 hover:text-indigo-300'}`}>
                      {link.name}
                      <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-indigo-500 transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,1)] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4 pl-8 border-l border-slate-700">
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Sign In</Link>
              <Link to="/register/student" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex items-center gap-1.5 group border border-indigo-500">
                Launch Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform drop-shadow-md" />
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg shadow-sm">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#0f172a]/80 backdrop-blur-md md:hidden">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="absolute right-0 h-full w-4/5 max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col pt-20 px-6">
              <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 bg-slate-800 rounded-full hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)} className={`text-xl font-extrabold ${location.pathname === link.path ? 'text-indigo-400 drop-shadow-md' : 'text-slate-300 hover:text-white'}`}>
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-slate-800 flex flex-col gap-4">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center text-white font-bold bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors">Sign In Portal</Link>
                <Link to="/register/student" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500 transition-all">Create Account</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
