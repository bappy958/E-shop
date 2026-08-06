import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('আপনার বার্তা সফলভাবে প্রেরিত হয়েছে! আমরা দ্রুত উত্তর দেব।', 'Message sent successfully!');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
            CONTACT US
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            যোগাযোগ করুন
          </h1>
          <p className="text-xs text-zinc-400">
            যেকোনো প্রশ্ন, অর্ডার সাহায্য বা ফিডব্যাকের জন্য আমাদের সাথে সংযুক্ত থাকুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-6 bg-zinc-950 p-8 border border-zinc-800 rounded-3xl">
            <h3 className="text-lg font-serif font-bold text-white border-b border-zinc-800 pb-3">
              অফিস ও শো-রুম ঠিকানা
            </h3>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">প্রধান শো-রুম:</strong>
                  <span>লেভেল ৪, ব্লক সি, যমুনা ফিউচার পার্ক, কূড়িল, ঢাকা - ১২২৯</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">হটলাইন নম্বর:</strong>
                  <span className="font-mono text-[#D4AF37] font-bold">+880 1700-000000, +880 1800-000000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">ইমেইল:</strong>
                  <span className="font-mono">support@uniquecollection.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">কাস্টমার সার্ভিস সময়:</strong>
                  <span>প্রতিদিন সকাল ১০:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-950 p-8 border border-zinc-800 rounded-3xl">
            <h3 className="text-lg font-serif font-bold text-white border-b border-zinc-800 pb-3">
              সরাসরি মেসেজ পাঠান
            </h3>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">আপনার নাম</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="নাম লিখুন..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">মোবাইল নম্বর</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">আপনার মেসেজ</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="কিভাবে আপনাকে সাহায্য করতে পারি?..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা পাঠান</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
