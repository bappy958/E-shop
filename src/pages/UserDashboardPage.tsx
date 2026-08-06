import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { User, Package, MapPin, Heart, LogOut, ExternalLink, Shield } from 'lucide-react';

export const UserDashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, userOrders, logout } = useAuth();
  const { language, t } = useLanguage();
  const { formatPrice } = useCart();

  if (!currentUser) {
    return (
      <div className="bg-black text-white min-h-screen py-20 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="text-xl font-bold font-serif">ড্যাশবোর্ড ব্যবহারের জন্য লগইন করুন</h2>
          <button
            onClick={() => onNavigate('/login')}
            className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-xl"
          >
            লগইন পেজে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center text-xl font-bold font-serif">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2">
                <span>স্বাগতম, {currentUser.name}!</span>
                {currentUser.role === 'admin' && (
                  <span className="px-2.5 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold rounded uppercase">
                    এডমিন
                  </span>
                )}
              </h1>
              <p className="text-xs text-zinc-400 font-mono">{currentUser.phone} • {currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span>এডমিন প্যানেল</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-3">
                <User className="w-4 h-4" />
                <span>প্রোফাইল তথ্য</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 block">নাম:</span>
                  <span className="font-semibold text-white">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">মোবাইল নম্বর:</span>
                  <span className="font-mono text-zinc-300">{currentUser.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">ইমেইল:</span>
                  <span className="font-mono text-zinc-300">{currentUser.email || 'নাই'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>কুইক লিংকস</span>
              </h3>
              <button
                onClick={() => onNavigate('/wishlist')}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition-colors"
              >
                <span>আমার উইশলিস্ট দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* My Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>আমার অর্ডারের তালিকা ({userOrders.length})</span>
              </h3>

              {userOrders.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  আপনি এখনো কোনো অর্ডার করেননি।
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pb-2 border-b border-zinc-800">
                        <div>
                          <span className="text-zinc-400">অর্ডার কোড: </span>
                          <strong className="text-[#D4AF37] font-mono">{ord.id}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded font-bold uppercase text-[10px]">
                            {ord.status}
                          </span>
                          <span className="text-zinc-500">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-zinc-300">
                        {ord.items.map((it, idx) => (
                          <p key={idx}>
                            • {language === 'bn' ? it.product.titleBn : it.product.titleEn} (সাইজ: {it.selectedSize}) x{it.quantity}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                        <div>
                          <span className="text-zinc-400">সর্বমোট: </span>
                          <span className="font-bold text-[#D4AF37] font-mono">
                            {formatPrice(ord.totalAmount, language)}
                          </span>
                        </div>

                        <button
                          onClick={() => onNavigate(`/track-order?id=${ord.id}`)}
                          className="px-3 py-1.5 bg-black hover:bg-[#D4AF37] hover:text-black border border-zinc-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>ট্র্যাক করুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
