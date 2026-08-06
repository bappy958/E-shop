import React, { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { Order } from '../../types';

interface AdminCustomersViewProps {
  orders: Order[];
  formatPrice: (amount: number) => string;
}

export const AdminCustomersView: React.FC<AdminCustomersViewProps> = ({ orders, formatPrice }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique customers from orders
  const customerMap = new Map<string, { name: string; phone: string; email?: string; district: string; address: string; totalOrders: number; totalSpent: number; lastOrderDate: string }>();

  orders.forEach((o) => {
    const key = o.customerInfo.phone || o.customerInfo.email || o.customerInfo.name;
    const existing = customerMap.get(key);

    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += o.totalAmount;
    } else {
      customerMap.set(key, {
        name: o.customerInfo.name,
        phone: o.customerInfo.phone,
        email: o.customerInfo.email,
        district: o.customerInfo.district,
        address: o.customerInfo.address,
        totalOrders: 1,
        totalSpent: o.totalAmount,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customersList = Array.from(customerMap.values());

  const filtered = customersList.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#D4AF37]" size={22} />
            <span>গ্রাহক তালিকা (Customer Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">মোট {customersList.length} জন সম্মানিত গ্রাহক নিবন্ধিত আছেন</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="গ্রাহকের নাম, ফোন বা ইমেইল..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">গ্রাহক তথ্য (Customer)</th>
                <th className="py-3.5 px-4">ফোন & ইমেইল</th>
                <th className="py-3.5 px-4">ঠিকানা & জেলা</th>
                <th className="py-3.5 px-4 text-center">মোট অর্ডার</th>
                <th className="py-3.5 px-4 text-right font-mono">মোট কেনাকাটা</th>
                <th className="py-3.5 px-4 text-right">সর্বশেষ কেনাকাটা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((cust, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold flex items-center justify-center font-mono text-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <span>{cust.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    <p className="text-white">{cust.phone}</p>
                    <p className="text-[10px] text-zinc-500">{cust.email || 'N/A'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <p>{cust.district}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{cust.address}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold font-mono text-amber-400">
                    {cust.totalOrders} টি
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#D4AF37] font-mono">
                    {formatPrice(cust.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-zinc-500 text-[10px]">
                    {cust.lastOrderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
