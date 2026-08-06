import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  MapPin,
  Phone,
  User,
  CreditCard,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Order } from '../../types';

interface AdminOrdersViewProps {
  orders: Order[];
  formatPrice: (amount: number) => string;
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshOrders: () => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  formatPrice,
  showToast,
  onRefreshOrders,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Colors Mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold">পেন্ডিং (Pending)</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-bold">কনফার্মড (Confirmed)</span>;
      case 'processing':
        return <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] font-bold">প্রসেসিং (Processing)</span>;
      case 'shipping':
        return <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-bold">শিপিং (Shipping)</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold">ডেলিভার্ড (Delivered)</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold">বাতিল (Cancelled)</span>;
      default:
        return <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-lg text-[10px] font-bold">{status}</span>;
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.order || data.success) {
        showToast('অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!', 'Order status updated successfully!');
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as any });
        }
        onRefreshOrders();
      }
    } catch (err) {
      alert('স্ট্যাটাস আপডেট করা সম্ভব হয়নি।');
    }
  };

  // Filter logic
  let filtered = [...orders];

  if (activeTab !== 'all') {
    filtered = filtered.filter((o) => o.orderStatus === activeTab);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerInfo.name.toLowerCase().includes(q) ||
        o.customerInfo.phone.includes(q) ||
        (o.trackingNumber || '').toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-[#D4AF37]" size={22} />
            <span>অর্ডার ম্যানেজমেন্ট (Order Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">মোট {orders.length} টি কাস্টমার অর্ডারের রিয়েল-টাইম ট্র্যাকিং</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder="অর্ডার ID, ফোন বা কাস্টমারের নাম..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-zinc-900/90 p-2 rounded-2xl border border-zinc-800 text-xs font-bold">
        {[
          { id: 'all', label: 'সকল অর্ডার', count: orders.length },
          { id: 'pending', label: 'পেন্ডিং (Pending)', count: orders.filter((o) => o.orderStatus === 'pending').length },
          { id: 'confirmed', label: 'কনফার্মড', count: orders.filter((o) => o.orderStatus === 'confirmed').length },
          { id: 'processing', label: 'প্রসেসিং', count: orders.filter((o) => o.orderStatus === 'processing').length },
          { id: 'shipping', label: 'শিপিং (Shipping)', count: orders.filter((o) => o.orderStatus === 'shipping').length },
          { id: 'delivered', label: 'ডেলিভার্ড', count: orders.filter((o) => o.orderStatus === 'delivered').length },
          { id: 'cancelled', label: 'বাতিলকৃত', count: orders.filter((o) => o.orderStatus === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-zinc-400 hover:text-white bg-zinc-950/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded-md text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">অর্ডার নং (Order ID)</th>
                <th className="py-3.5 px-4">গ্রাহকের নাম & ঠিকানা</th>
                <th className="py-3.5 px-4">তারিখ</th>
                <th className="py-3.5 px-4">পেমেন্ট মেথড</th>
                <th className="py-3.5 px-4 font-mono">মোট মূল্য</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    <ShoppingBag size={36} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">কোনো অর্ডার পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                      #{ord.id}
                      {ord.trackingNumber && (
                        <p className="text-[10px] text-zinc-500 font-normal">Track: {ord.trackingNumber}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{ord.customerInfo.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{ord.customerInfo.phone}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">{ord.customerInfo.district}, {ord.customerInfo.address}</p>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{ord.createdAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold uppercase text-zinc-300">
                        {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(ord.orderStatus)}
                        {/* Quick Change Selector */}
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipping">Shipping</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye size={14} />
                        <span>বিস্তারিত (View)</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 text-white space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] font-bold">ORDER DETAILS</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>অর্ডার নং #{selectedOrder.id}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Address Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
              <div className="space-y-1">
                <p className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <User size={14} />
                  <span>গ্রাহক তথ্য (Customer Info)</span>
                </p>
                <p className="font-bold text-white text-sm">{selectedOrder.customerInfo.name}</p>
                <p className="text-zinc-400 font-mono flex items-center gap-1">
                  <Phone size={12} />
                  <span>{selectedOrder.customerInfo.phone}</span>
                </p>
                {selectedOrder.customerInfo.email && (
                  <p className="text-zinc-400 font-mono">{selectedOrder.customerInfo.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>ডেলিভারি ঠিকানা (Shipping Address)</span>
                </p>
                <p className="text-zinc-200">{selectedOrder.customerInfo.address}</p>
                <p className="text-zinc-400">জেলা: {selectedOrder.customerInfo.district}</p>
                {selectedOrder.customerInfo.orderNotes && (
                  <p className="text-amber-300 italic mt-1">নোট: "{selectedOrder.customerInfo.orderNotes}"</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">অর্ডারকৃত আইটেমসমূহ (Ordered Items)</h4>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden text-xs">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between border-b border-zinc-800/60 last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.titleEn} className="w-10 h-10 rounded object-cover border border-zinc-800" />
                      <div>
                        <p className="font-bold text-white">{item.titleBn || item.titleEn}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          সাইজ: {item.selectedSize} | কালার: {item.selectedColor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="font-bold text-white">{formatPrice(item.price)} &times; {item.quantity}</p>
                      <p className="text-[#D4AF37] font-bold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>সাবটোটাল (Subtotal)</span>
                <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>ডেলিভারি চার্জ (Delivery Charge)</span>
                <span className="font-mono">{formatPrice(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>ডিসকাউন্ট (Coupon Discount)</span>
                  <span className="font-mono">-{formatPrice(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#D4AF37] pt-2 border-t border-zinc-800">
                <span>সর্বমোট (Total Amount)</span>
                <span className="font-mono text-base">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Status Update Control inside modal */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">বর্তমান স্ট্যাটাস:</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 text-xs text-white px-3 py-1.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipping">Shipping</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
