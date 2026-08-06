import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Mail, Phone, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { language, t } = useLanguage();

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail || !password) return;

    setLoading(true);
    const res = await login(phoneOrEmail, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            লগইন করুন (Login)
          </h1>
          <p className="text-xs text-zinc-400">
            ইউনিক কালেকশন ৪.০ অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Demo Admin & User Credentials Quick Fill */}
        <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 space-y-2">
          <p className="font-bold text-[#D4AF37] flex items-center gap-1">
            <span>এডমিন ও ইউজার লগইন তথ্য (Credentials):</span>
          </p>
          <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
            <div>
              <span className="block font-semibold text-white">এডমিন (Admin): amsamiul27@gmail.com</span>
              <span className="text-[10px] text-zinc-400">পাসওয়ার্ড: amsamiul27</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhoneOrEmail('amsamiul27@gmail.com');
                setPassword('amsamiul27');
              }}
              className="px-2.5 py-1 bg-[#D4AF37] text-black font-extrabold rounded-lg text-[10px] hover:bg-[#b8952d] transition-colors shrink-0"
            >
              Fill Admin
            </button>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-zinc-800/60">
            <div>
              <span className="block font-semibold text-zinc-300">কাস্টমার (Customer): 01712345678</span>
              <span className="text-[10px] text-zinc-400">পাসওয়ার্ড: user123</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhoneOrEmail('01712345678');
                setPassword('user123');
              }}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-300 font-bold rounded-lg text-[10px] transition-colors shrink-0"
            >
              Fill User
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              ইমেইল বা মোবাইল নম্বর
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="01712345678 অথবা admin@uniquecollection.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-900 text-xs text-zinc-400">
          <span>নতুন গ্রাহক? </span>
          <button
            onClick={() => onNavigate('/register')}
            className="text-[#D4AF37] hover:underline font-bold"
          >
            রেজিস্ট্রেশন করুন
          </button>
        </div>

      </div>
    </div>
  );
};
