import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DISTRICTS_BANGLADESH } from '../data/initialData';
import { ShieldCheck, Truck, CreditCard, ArrowRight, Lock, CheckCircle, Tag } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const {
    cart,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    activeCoupon,
    selectedDistrict,
    setSelectedDistrict,
    clearCart,
    formatPrice,
  } = useCart();
  const { currentUser, addOrder } = useAuth();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [fullAddress, setFullAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'sslcommerz' | 'stripe'>('cod');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen py-20 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-bold font-serif">আপনার শপিং ব্যাগ ফাঁকা!</h2>
          <p className="text-xs text-zinc-400">চেকআউট করার জন্য প্রথমে শপ থেকে পণ্য কার্টে যুক্ত করুন।</p>
          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase rounded-xl"
          >
            কেনাকাটা করুন
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !fullAddress) {
      alert('অনুগ্রহ করে আপনার নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      items: cart,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: {
        district: selectedDistrict,
        fullAddress,
        notes: orderNotes,
      },
      paymentMethod,
      bkashTrxId: paymentMethod === 'bkash' ? bkashTrxId : undefined,
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
      couponCode: activeCoupon?.code,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        addOrder(data.order);
        clearCart();
        onNavigate(`/order-success/${data.order.id}`);
      } else {
        alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সংযোগ ত্রুটি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 pb-4 border-b border-zinc-800">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
            CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            অর্ডার সম্পন্ন করুন
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Customer & Shipping Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Personal Information */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <span>গ্রাহকের তথ্য (Customer Details)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    সম্পূর্ণ নাম <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    মোবাইল নম্বর <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01712345678"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ইমেইল অ্যাড্রেস (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black font-mono font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span>ডেলিভারি ঠিকানা (Shipping Address)</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  জেলা নির্বাচন করুন <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {DISTRICTS_BANGLADESH.map((d) => (
                    <option key={d.nameEn} value={d.nameEn}>
                      {language === 'bn' ? d.nameBn : d.nameEn} (ডেলিভারি চার্জ: ৳{d.deliveryFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  সম্পূর্ণ বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা/থানা) <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="যেমন: বাসা #৪৫, রোড #১২, ব্লক #বি, মিরপুর-১০, ঢাকা..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  বিশেষ নির্দেশনা বা ডেলিভারি নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="যেমন: বিকেলে ফোন দিয়ে আসবেন..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black font-mono font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span>পেমেন্ট পদ্ধতি নির্বাচন করুন</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-white">ক্যাশ অন ডেলিভারি (COD)</span>
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন।
                  </p>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-pink-400">বিকাশ / নগদ (bKash)</span>
                    <span className="text-[10px] bg-pink-500 text-white font-mono px-2 py-0.5 rounded">
                      ডিজিটাল
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    বিকাশ সেন্ড মানি করে ট্রানজেকশন আইডি প্রদান করুন।
                  </p>
                </label>

                {/* SSLCommerz */}
                <label
                  onClick={() => setPaymentMethod('sslcommerz')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'sslcommerz'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber-400">SSLCommerz</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    যেকোনো বাংলাদেশি ব্যাংক কার্ড ও ওয়ালেট দিয়ে পে করুন।
                  </p>
                </label>

                {/* Stripe */}
                <label
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'stripe'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#D4AF37]">Stripe Global Card</span>
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    আন্তর্জাতিক ক্রেডিট বা ডেবিট কার্ড (Visa/Mastercard)।
                  </p>
                </label>

              </div>

              {/* bKash Instructions Box */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 bg-pink-950/40 border border-pink-500/40 rounded-2xl space-y-3 text-xs">
                  <p className="text-pink-300 font-bold">
                    বিকাশ পার্সোনাল নম্বর: <span className="font-mono text-white">01700000000</span>
                  </p>
                  <p className="text-zinc-300 text-[11px]">
                    উপরোক্ত নম্বরে মোট <strong>{formatPrice(totalAmount, language)}</strong> টাকা সেন্ড মানি করুন এবং নিচে ট্রানজেকশন আইডিটি লিখুন।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      placeholder="যে নম্বর থেকে পাঠিয়েছেন (০১৭...)"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="TrxID (যেমন: 9A8B7C6D)"
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6 sticky top-24 shadow-2xl">
              
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
                অর্ডার সামারি ({cart.length} টি আইটেম)
              </h3>

              {/* Cart Items Brief */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-14 object-cover rounded-lg bg-zinc-900 shrink-0"
                    />
                    <div className="flex-1">
                      <h5 className="font-bold text-white line-clamp-1">
                        {language === 'bn' ? item.product.titleBn : item.product.titleEn}
                      </h5>
                      <p className="text-[10px] text-zinc-400">
                        সাইজ: {item.selectedSize} • পরিমাণ: {item.quantity}
                      </p>
                      <p className="text-[#D4AF37] font-bold font-mono mt-0.5">
                        {formatPrice(item.product.price * item.quantity, language)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-zinc-300 pt-4 border-t border-zinc-800">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-mono">{formatPrice(subtotal, language)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>ডিসকাউন্ট ছাড় ({activeCoupon?.code})</span>
                    <span className="font-mono">-{formatPrice(discountAmount, language)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? 'ফ্রি' : formatPrice(deliveryFee, language)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-[#D4AF37] font-mono text-lg">
                    {formatPrice(totalAmount, language)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'অর্ডার প্রসেসিং...' : 'অর্ডার নিশ্চিত করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                <span>আপনার তথ্য ও পেমেন্ট সম্পূর্ণ সুরক্ষিত</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
