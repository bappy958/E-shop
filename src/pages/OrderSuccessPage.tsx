import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Package, Printer, ArrowRight, PhoneCall } from 'lucide-react';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { language } = useLanguage();
  const { formatPrice } = useCart();

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Animated Check Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
            ORDER CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto">
            আমাদের প্রতিনিধি আপনার মোবাইল নম্বরে কল দিয়ে অর্ডারের সত্যতা নিশ্চিত করবেন এবং দ্রুত ডেলিভারি সম্পন্ন করবেন।
          </p>
        </div>

        {/* Order ID Badge Card */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3 max-w-lg mx-auto shadow-xl">
          <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
            <span>অর্ডার ট্র্যাকিং কোড:</span>
            <span className="font-bold text-[#D4AF37] text-sm">{orderId}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>স্ট্যাটাস:</span>
            <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] font-bold rounded-md">
              প্রসেসিং চলছে (Pending Confirmation)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate(`/track-order?id=${orderId}`)}
            className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg"
          >
            <Package className="w-4 h-4" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>ইনভয়েস প্রিন্ট করুন</span>
          </button>

          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-3.5 bg-black hover:bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            আরও কেনাকাটা করুন
          </button>
        </div>

        {/* Help Banner */}
        <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-900 text-xs text-zinc-400 inline-flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
          <span>যেকোনো প্রয়োজনে কল করুন আমাদের হেল্পলাইনে: <strong>+880 1700-000000</strong></span>
        </div>

      </div>
    </div>
  );
};
