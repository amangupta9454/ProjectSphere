import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('No email found. Please register again.');
    if (otp.length !== 6) return toast.error('OTP must be exactly 6 characters.');

    setLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center font-sans px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
          >
            <ShieldCheck className="text-blue-600 w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Security Check</h2>
          {email ? (
            <p className="text-gray-500 mt-2 text-sm">Enter the 6-character OTP sent to <span className="text-blue-600 font-semibold">{email}</span></p>
          ) : (
            <p className="text-red-500 mt-2 text-sm font-semibold">No email detected. <Link to="/register/student" className="underline">Register again</Link>.</p>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            required
            maxLength={6}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center text-3xl tracking-[0.5em] text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono shadow-inner transition-all"
            placeholder="XXXXXX"
            value={otp}
            onChange={(e) => setOtp(e.target.value.toUpperCase())}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !otp || !email}
            className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Complete Verification</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Wrong email?{' '}
            <Link to="/register/student" className="text-blue-600 font-semibold hover:underline">Re-register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
