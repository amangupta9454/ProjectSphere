import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    toast.success('Your message has been dispatched securely!');
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@gateway.edu',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: '123 Academic Block, Main Campus',
      color: 'from-emerald-500 to-cyan-600'
    }
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden pt-24 pb-20"
      style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #051424 100%)' }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -left-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.02) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ background: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)' }}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Get in Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            <span className="text-white">Let's Connect</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              We're Here to Help
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.8)' }}
          >
            Have questions regarding the platform or need administrative integration support? Our team responds within 24 hours.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                  className="group relative p-6 rounded-2xl border backdrop-blur-sm overflow-hidden cursor-default"
                  style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.15)' }}
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 -z-10"
                    style={{ background: `linear-gradient(135deg, ${info.color})`, opacity: 0.05 }}
                  />

                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 rounded-xl bg-gradient-to-br ${info.color}`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-300 mb-1">{info.label}</h4>
                      <p className="text-base text-white font-medium group-hover:text-cyan-400 transition-colors">{info.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Hours card */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl border"
              style={{ background: 'rgba(14,165,233,0.05)', borderColor: 'rgba(14,165,233,0.15)' }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-400 mt-1"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Operating Hours</h4>
                  <p className="text-sm text-slate-400">Monday - Friday</p>
                  <p className="text-base font-medium text-cyan-400">09:00 AM - 05:00 PM EST</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 p-8 md:p-10 rounded-3xl border backdrop-blur-md relative overflow-hidden"
            style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.1)' }}
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, transparent 100%)',
                padding: '1px',
                mask: 'linear-gradient(to right, black 0%, transparent 30%, transparent 70%, black 100%)'
              }}
            />

            <form onSubmit={submitHandler} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'firstName', placeholder: 'John', label: 'First Name' },
                  { name: 'lastName', placeholder: 'Doe', label: 'Last Name' }
                ].map((field) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-slate-300 mb-3">{field.label}</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      required
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-white placeholder-slate-500"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(6,182,212,0.2)'
                      }}
                      placeholder={field.placeholder}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(6,182,212,0.5)';
                        e.target.style.background = 'rgba(6,182,212,0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(6,182,212,0.2)';
                        e.target.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-3">Email Address</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-white placeholder-slate-500"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(6,182,212,0.2)'
                  }}
                  placeholder="you@university.edu"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.5)';
                    e.target.style.background = 'rgba(6,182,212,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-slate-300 mb-3">Your Message</label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  required
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-white placeholder-slate-500 resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(6,182,212,0.2)'
                  }}
                  placeholder="Write your inquiry here..."
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.5)';
                    e.target.style.background = 'rgba(6,182,212,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(6,182,212,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-between pt-4"
              >
                <p className="text-xs text-slate-500">We'll respond within 24 hours</p>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: isSubmitting
                      ? 'rgba(6,182,212,0.3)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Request
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Fast Response', description: '24-hour response time guaranteed', icon: CheckCircle2 },
            { title: 'Secure', description: 'End-to-end encrypted messages', icon: Mail },
            { title: 'Expert Support', description: 'Dedicated team of professionals', icon: MessageSquare }
          ].map((feature, idx) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                className="p-6 rounded-2xl border text-center"
                style={{ background: 'rgba(6,182,212,0.04)', borderColor: 'rgba(6,182,212,0.12)' }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 mb-4"
                >
                  <FeatureIcon className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
