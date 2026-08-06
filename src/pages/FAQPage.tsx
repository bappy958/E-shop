import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
      a: 'ঢাকার ভেতরে আমরা ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি প্রদান করি। ঢাকার বাইরে ৬৪ জেলায় সাধারণ কুরিয়ার সার্ভিসের মাধ্যমে ২ থেকে ৩ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।',
    },
    {
      q: 'পণ্য হাতে পাওয়ার পর চেক করার সুযোগ আছে কি?',
      a: 'হ্যাঁ! আমাদের প্রতিটি কুরিয়ার ডেলিভারিতে আপনি ডেলিভারি ম্যানের সামনে প্যাকেট খুলে পণ্য দেখে কাপড়ের কোয়ালিটি ও সাইজ নিশ্চিত করে মূল্য পরিশোধ করতে পারবেন।',
    },
    {
      q: 'সাইজ ছোট বা বড় হলে পরিবর্তন করার উপায় কি?',
      a: 'যদি কোনো কারণে সাইজ মানানসই না হয়, আপনি ৭ দিনের মধ্যে আমাদের কাস্টমার কেয়ারে কল করে সম্পূর্ণ বিনামূল্যে সাইজ পরিবর্তন (Size Replacement) করে নিতে পারবেন।',
    },
    {
      q: 'পেমেন্ট কিভাবে করতে পারবো?',
      a: 'আমরা ক্যাশ অন ডেলিভারি (Cash on Delivery), বিকাশ (bKash), নগদ (Nagad), অনলাইন ব্যাংক কার্ড (Visa / Mastercard) এবং স্ট্রাইপ (Stripe) আন্তর্জাতিক পেমেন্ট সাপোর্ট করি।',
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block">
            HELP & FAQ
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            সাধারণ জিজ্ঞাসা (Frequently Asked Questions)
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl cursor-pointer transition-all hover:border-[#D4AF37]/50"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div className="flex items-center justify-between font-bold text-sm text-white">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </div>
              {openIdx === idx && (
                <p className="mt-3 pt-3 border-t border-zinc-900 text-xs text-zinc-300 font-light leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
