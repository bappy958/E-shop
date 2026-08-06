import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Phone, Lock } from 'lucide-react';

export const RegisterPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password) return;

    setLoading(true);
    const res = await register(name, email, phone, password);
    setLoading(false);

    if (res.success) {
      alert('রেজিস্ট্রেশন সফল হয়েছে! অ্যাকাউন্ট ড্যাশবোর্ডে প্রবেশ করছেন...');
      onNavigate('/dashboard');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            নতুন অ্যাকাউন্ট খুলুন (Register)
          </h1>
          <p className="text-xs text-zinc-400">
            ইউনিক কালেকশন ৪.০ এর পরিবারে যোগ দিন
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              আপনার নাম <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: তানভীর রহমান"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              মোবাইল নম্বর <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              ইমেইল অ্যাড্রেস (ঐচ্ছিক)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              পাসওয়ার্ড নির্বাচন করুন <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>{loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'রেজিস্ট্রেশন সম্পূর্ণ করুন'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-900 text-xs text-zinc-400">
          <span>পূর্বেই অ্যাকাউন্ট রয়েছে? </span>
          <button
            onClick={() => onNavigate('/login')}
            className="text-[#D4AF37] hover:underline font-bold"
          >
            লগইন করুন
          </button>
        </div>

      </div>
    </div>
  );
};
