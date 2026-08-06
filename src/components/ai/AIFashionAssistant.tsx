import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { Sparkles, X, Send, Bot, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: Product[];
}

export const AIFashionAssistant: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { addToCart, formatPrice } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text:
        language === 'bn'
          ? 'আসসালামু আলাইকুম! আমি "ইউনিক কালেকশন ৪.০" এর এআই স্টাইলিস্ট। ঈদ, বিয়েবাড়ি বা অফিসের জন্য উপযুক্ত আউটফিট নির্বাচন করতে আমাকে যেকোনো প্রশ্ন করুন!'
          : 'Welcome! I am your AI Fashion Stylist at Unique Collection 4.0. Ask me for outfit recommendations for Eid, weddings, or office wear!',
    },
  ]);

  const quickPrompts = [
    'ঈদের জন্য পাঞ্জাবি ও নাগরা জুতার কম্বিনেশন দেখাও',
    'দুবাই চেরি আবায়ার সাথে মানানসই হিজাব কালার কোনটা হবে?',
    'অফিসের জন্য প্রিমিয়াম কটন শার্টের কালেকশন',
    'বিয়ে বাড়ির জমকালো পোশাকের সাজেশন চাই',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || loading) return;

    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/styler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          userLanguage: language,
        }),
      });

      const data = await res.json();

      const aiMsgObj: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: language === 'bn' ? data.replyBn || data.reply : data.replyEn || data.reply,
        recommendedProducts: data.recommendedProducts || [],
      };

      setMessages((prev) => [...prev, aiMsgObj]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text:
            language === 'bn'
              ? 'দুঃখিত, এই মুহূর্তে সংযোগের সমস্যা হচ্ছে। অনুগ্রহ করে শপ পেজে আমাদের প্রিমিয়াম কালেকশন দেখুন।'
              : 'Sorry, connection error. Please view our premium collection directly on the shop page.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white p-3.5 rounded-2xl border border-[#D4AF37] shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group cursor-pointer"
        title="AI Fashion Consultant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
            AI STYLIST
          </p>
          <p className="text-xs font-bold text-white leading-tight">
            {language === 'bn' ? 'ফ্যাশন এআই সাহায্য নিন' : 'Ask AI Fashion Assistant'}
          </p>
        </div>
      </button>

      {/* Chat Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 left-6 z-50 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-black via-zinc-900 to-black border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>ইউনিক এআই স্টাইলিস্ট</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {language === 'bn' ? 'আপনার ব্যক্তিগত ফ্যাশন কনসালটেন্ট' : 'Your Personal Fashion Advisor'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-zinc-950 to-black">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#D4AF37] text-black font-semibold rounded-br-none'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Recommended Product Cards inside Chat */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                          পছন্দসই কিছু সাজেস্টেড আউটফিট:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.recommendedProducts.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex gap-3 p-2 bg-black border border-zinc-800 rounded-xl hover:border-[#D4AF37]/50 transition-colors"
                            >
                              <img
                                src={prod.images[0]}
                                alt={prod.titleBn}
                                className="w-14 h-16 object-cover object-top rounded-lg bg-zinc-900 shrink-0"
                              />
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-[11px] font-semibold text-white line-clamp-1">
                                    {language === 'bn' ? prod.titleBn : prod.titleEn}
                                  </h4>
                                  <p className="text-xs font-bold text-[#D4AF37]">
                                    {formatPrice(prod.price, language)}
                                  </p>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <button
                                    onClick={() => addToCart(prod)}
                                    className="px-2 py-1 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-white text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                                  >
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>কার্ট</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsOpen(false);
                                      onNavigate(`/product/${prod.id}`);
                                    }}
                                    className="px-2 py-1 text-zinc-400 hover:text-white text-[10px] underline"
                                  >
                                    ডিটেইলস
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 w-fit">
                  <Sparkles className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>এআই স্টাইলিস্ট চিন্তা করছে...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2.5 bg-zinc-950 border-t border-zinc-900 flex gap-1.5 overflow-x-auto">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[10px] bg-zinc-900 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-zinc-400 border border-zinc-800 rounded-full whitespace-nowrap transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-black border-t border-zinc-800 flex gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="আপনার ফ্যাশন জিজ্ঞাসা লিখুন..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={loading || !inputMsg.trim()}
                className="p-2 bg-[#D4AF37] hover:bg-[#b8952d] text-black rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
