import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
            ABOUT UNIQUE COLLECTION 4.0
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            আমাদের গল্প ও ঐতিহ্য
          </h1>
          <p className="text-sm text-[#D4AF37] font-serif italic">
            "আপনার স্টাইল, আমাদের দায়িত্ব।"
          </p>
        </div>

        {/* Story */}
        <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6 text-sm text-zinc-300 font-light leading-relaxed">
          <p>
            ইউনিক কালেকশন ৪.০ বাংলাদেশের একটি প্রতিশ্রুতিশীল ফ্যাশন ব্র্যান্ড। আমরা কাজ করি খাঁটি সুতি, সিল্ক, দুবাই চেরি ও প্রিমিয়াম ফেব্রিকে তৈরি আধুনিক পোশাক নিয়ে। আমাদের মূল লক্ষ্য হলো সাধারণ মানুষের হাতের নাগালে সর্বোচ্চ কোয়ালিটির পোশাক পৌঁছে দেওয়া।
          </p>

          <p>
            আমাদের প্রতিটি পুরুষদের পাঞ্জাবি, ফরমাল ও ক্যাজুয়াল শার্ট, মহিলাদের দুবাই চেরি আবায়া, প্রিমিয়াম হিজাব এবং গার্লস কালেকশন নিজস্ব ডিজাইনার ও অভিজ্ঞ কারিগর দিয়ে তৈরি।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="font-bold text-white text-xs uppercase">১০০% আসল কাপড়</h4>
              <p className="text-[11px] text-zinc-400 mt-1">কখনো মানের সাথে আপোষ নেই</p>
            </div>

            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <Award className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="font-bold text-white text-xs uppercase">নিখুঁত বুনন</h4>
              <p className="text-[11px] text-zinc-400 mt-1">দক্ষ কারিগরদের নিখুঁত কাজ</p>
            </div>

            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="font-bold text-white text-xs uppercase">গ্রাহক সন্তুষ্টি</h4>
              <p className="text-[11px] text-zinc-400 mt-1">৫০,০০০+ সন্তুষ্ট কাস্টমার</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('/shop')}
            className="px-8 py-3.5 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xl"
          >
            কালেকশন দেখুন
          </button>
        </div>

      </div>
    </div>
  );
};
