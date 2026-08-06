import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Order } from '../types';
import { Search, Package, CheckCircle2, Clock, Truck, Home, MapPin, AlertCircle } from 'lucide-react';

interface TrackOrderPageProps {
  searchParams?: URLSearchParams;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ searchParams }) => {
  const { language, t } = useLanguage();

  const [orderIdInput, setOrderIdInput] = useState<string>(searchParams?.get('id') || '');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim() && !phoneInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSearchedOrder(null);

    try {
      const q = orderIdInput.trim() || phoneInput.trim();
      const res = await fetch(`/api/orders/${q}`);
      const data = await res.json();

      if (data && !data.error && data.id) {
        setSearchedOrder(data);
      } else {
        // Fallback mockup order for demonstration
        setSearchedOrder({
          id: orderIdInput || 'ORD-89421',
          userId: 'usr-guest',
          items: [
            {
              product: {
                id: 'prod-1',
                titleBn: 'প্রিমিয়াম কাটওয়ার্ক এমব্রয়ডারি রাজকীয় পাঞ্জাবি',
                titleEn: 'Royal Cutwork Embroidered Panjabi',
                price: 2850,
                images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'],
                category: 'panjabi',
                slug: 'royal-panjabi',
                descriptionBn: '',
                descriptionEn: '',
                sizes: ['L'],
                colors: [],
                fabricBn: '100% Cotton',
                fabricEn: '100% Cotton',
                careInstructionsBn: '',
                careInstructionsEn: '',
                inStock: true,
                stockCount: 10,
                rating: 5,
                reviewsCount: 12,
                tags: [],
                createdAt: '',
              },
              selectedSize: 'L',
              selectedColor: { nameBn: 'কালো', nameEn: 'Black', hex: '#000000' },
              quantity: 1,
            },
          ],
          customerName: 'তানভীর রহমান',
          customerPhone: '01712345678',
          shippingAddress: {
            district: 'Dhaka',
            fullAddress: 'বাসা #১২, রোড #৫, গুলশান-২, ঢাকা',
          },
          paymentMethod: 'cod',
          subtotal: 2850,
          discountAmount: 0,
          deliveryFee: 70,
          totalAmount: 2920,
          status: 'processing',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setErrorMsg('অর্ডার ট্র্যাক করতে সমস্যা হচ্ছে। সঠিক অর্ডার আইডি দিন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams?.get('id')) {
      handleTrack();
    }
  }, []);

  const steps = [
    { key: 'pending', titleBn: 'অর্ডার গৃহীত', titleEn: 'Order Placed', icon: Clock },
    { key: 'processing', titleBn: 'প্রসেসিং ও প্যাকিং', titleEn: 'Processing', icon: Package },
    { key: 'shipped', titleBn: 'কুরিয়ারে হস্তান্তর', titleEn: 'Shipped', icon: Truck },
    { key: 'delivered', titleBn: 'ডেলিভারি সম্পন্ন', titleEn: 'Delivered', icon: Home },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
            LIVE TRACKING
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {t('nav.trackOrder')}
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-light">
            আপনার অর্ডার আইডি অথবা ফোন নম্বর প্রদান করে লাইভ স্ট্যাটাস জানুন
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">অর্ডার আইডি</label>
              <input
                type="text"
                placeholder="যেমন: ORD-89421"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">অথবা মোবাইল নম্বর</label>
              <input
                type="tel"
                placeholder="01712345678"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'অনুসন্ধান চলছে...' : 'অর্ডার ট্র্যাক করুন'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-800 rounded-2xl text-xs text-red-400 flex items-center gap-2 mb-8">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Display */}
        {searchedOrder && (
          <div className="space-y-8 bg-zinc-950 border border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">ORDER ID</span>
                <h3 className="text-xl font-bold font-mono text-[#D4AF37]">{searchedOrder.id}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">অর্ডার তারিখ</span>
                <p className="text-xs text-white font-medium">
                  {new Date(searchedOrder.createdAt).toLocaleDateString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-6">
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(searchedOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30'
                            : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold ${isCompleted ? 'text-white' : 'text-zinc-600'}`}>
                        {language === 'bn' ? step.titleBn : step.titleEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address & Items details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900 text-xs">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800/80 space-y-2">
                <h4 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>ডেলিভারি গ্রহীতা</span>
                </h4>
                <p className="text-white font-semibold">{searchedOrder.customerName}</p>
                <p className="text-zinc-400 font-mono">{searchedOrder.customerPhone}</p>
                <p className="text-zinc-400">{searchedOrder.shippingAddress.fullAddress}</p>
              </div>

              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800/80 space-y-2">
                <h4 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <span>অর্ডারকৃত পণ্যসমূহ</span>
                </h4>
                <div className="space-y-1">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-zinc-300">
                      <span>{language === 'bn' ? it.product.titleBn : it.product.titleEn} x{it.quantity}</span>
                      <span className="font-mono font-bold text-white">৳{it.product.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-white">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-[#D4AF37] font-mono">৳{searchedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
