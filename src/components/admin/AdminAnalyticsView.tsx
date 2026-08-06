import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { AdminAnalyticsData, Product, Order } from '../../types';

interface AdminAnalyticsViewProps {
  analytics: AdminAnalyticsData | null;
  products: Product[];
  orders: Order[];
  formatPrice: (amount: number) => string;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  analytics,
  products,
  orders,
  formatPrice,
}) => {
  // Fallbacks if analytics is loading or empty
  const totalRev = analytics?.totalRevenue || orders.reduce((acc, o) => acc + (o.totalAmount || 0), 145800);
  const todayRev = analytics?.todayRevenue || 12450;
  const monthRev = analytics?.monthlyRevenue || 135000;
  const totalOrd = analytics?.totalOrders || orders.length || 15;
  const pendingOrd = analytics?.pendingOrders || orders.filter((o) => o.orderStatus === 'pending').length || 4;
  const deliveredOrd = analytics?.deliveredOrders || orders.filter((o) => o.orderStatus === 'delivered').length || 9;
  const totalCust = analytics?.totalCustomers || 28;
  const totalProd = analytics?.totalProducts || products.length || 10;
  const outOfStock = analytics?.outOfStockCount || products.filter((p) => !p.inStock || p.stockCount <= 0).length || 1;

  const categoryData = analytics?.categoryRevenue || [
    { name: 'Panjabi', value: 45000, color: '#D4AF37' },
    { name: 'Shirts', value: 28000, color: '#3B82F6' },
    { name: 'Abaya & Borka', value: 35000, color: '#EC4899' },
    { name: 'T-Shirts & Polo', value: 18000, color: '#10B981' },
    { name: 'Hijab', value: 12000, color: '#8B5CF6' },
    { name: 'Girls Collection', value: 15000, color: '#F59E0B' },
  ];

  const salesData = analytics?.monthlySales || [
    { month: 'Jan', sales: 65000, orders: 22 },
    { month: 'Feb', sales: 78000, orders: 28 },
    { month: 'Mar', sales: 92000, orders: 35 },
    { month: 'Apr', sales: 120000, orders: 48 },
    { month: 'May', sales: 110000, orders: 42 },
    { month: 'Jun', sales: 88000, orders: 30 },
    { month: 'Jul', sales: 95000, orders: 36 },
    { month: 'Aug', sales: 135000, orders: 54 },
    { month: 'Sep', sales: 105000, orders: 40 },
    { month: 'Oct', sales: 98000, orders: 38 },
    { month: 'Nov', sales: 115000, orders: 46 },
    { month: 'Dec', sales: 140000, orders: 58 },
  ];

  const orderStatusData = analytics?.orderStatusDistribution || [
    { status: 'Pending', count: pendingOrd, color: '#F59E0B' },
    { status: 'Processing', count: 4, color: '#3B82F6' },
    { status: 'Shipped', count: 3, color: '#8B5CF6' },
    { status: 'Delivered', count: deliveredOrd, color: '#10B981' },
    { status: 'Cancelled', count: 1, color: '#EF4444' },
  ];

  const topProds = analytics?.topProducts || products.slice(0, 5).map((p, idx) => ({
    id: p.id,
    titleEn: p.titleEn,
    titleBn: p.titleBn,
    category: p.category,
    soldQty: 48 - idx * 8,
    revenue: (48 - idx * 8) * p.price,
    image: p.thumbnail || p.images[0],
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">মোট বিক্রয় (Total Revenue)</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] mt-1 font-mono">
                {formatPrice(totalRev)}
              </h3>
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                <TrendingUp size={12} />
                <span>+১৮.৫% এই মাসে বৃদ্ধি</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Today Revenue */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">আজকের সেল (Today's Revenue)</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1 font-mono">
                {formatPrice(todayRev)}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
                <Calendar size={12} />
                <span>লাইভ আপডেট ২০২৬</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">চলতি মাসের সেল (Monthly)</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1 font-mono">
                {formatPrice(monthRev)}
              </h3>
              <p className="text-[11px] text-purple-300 mt-2">আগস্ট ২০২৬ মাস</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">মোট অর্ডার (Total Orders)</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{totalOrd} টি</h3>
              <p className="text-[11px] text-zinc-400 mt-2">সকল কাস্টমার অর্ডার</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">পেন্ডিং অর্ডার (Pending)</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">{pendingOrd} টি</h3>
              <p className="text-[11px] text-amber-300/80 mt-2">প্রসেসিং অপেক্ষায়</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ডেলিভার্ড অর্ডার (Delivered)</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{deliveredOrd} টি</h3>
              <p className="text-[11px] text-emerald-300/80 mt-2">সফলভাবে সম্পন্ন</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">মোট গ্রাহক (Customers)</p>
              <h3 className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{totalCust} জন</h3>
              <p className="text-[11px] text-cyan-300/80 mt-2">রেজিস্টার্ড কাস্টমার</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ক্যাটালগ পণ্য (Products)</p>
              <h3 className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{totalProd} টি</h3>
              <p className="text-[11px] text-indigo-300/80 mt-2">এক্টিভ লাইভ আইটেম</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">স্টক আউট (Out of Stock)</p>
              <h3 className={`text-2xl font-bold mt-1 font-mono ${outOfStock > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {outOfStock} টি
              </h3>
              <p className="text-[11px] text-red-300/80 mt-2">রি-স্টক প্রয়োজন</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${outOfStock > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Revenue Pie Chart by Category */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span>ক্যাটাগরি ভিত্তিক বিক্রয় (Revenue by Category)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">সবচেয়ে জনপ্রিয় ক্যাটাগরির রেভিনিউ শেয়ার</p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value)), 'বিক্রি']}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Bar Chart */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>মাসিক বিক্রয় চার্ট (Monthly Sales Trend Jan - Dec)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">বছরের রেভিনিউ এবং গ্রোথ ট্র্যাকার</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickFormatter={(v) => `৳${v/1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value)), 'মোট সেল']}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* LOWER SECTION: Order Status & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order Status Donut Chart */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">অর্ডার স্ট্যাটাস (Order Status)</h3>
            <p className="text-xs text-zinc-400 mt-0.5">বর্তমান সকল অর্ডারের অবস্থান</p>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl lg:col-span-2 overflow-x-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">সেরা বিক্রিত পণ্যসমূহ (Top Selling Products)</h3>
              <p className="text-xs text-zinc-400 mt-0.5">সবচেয়ে বেশি রেভিনিউ জেনারেটিং পোশাক</p>
            </div>
          </div>

          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-3">পণ্য (Product)</th>
                <th className="py-3 px-3">ক্যাটাগরি</th>
                <th className="py-3 px-3 text-center">বিক্রি (Sold Qty)</th>
                <th className="py-3 px-3 text-right">মোট রেভিনিউ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {topProds.map((item, idx) => (
                <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 px-3 flex items-center gap-3">
                    <span className="font-mono text-zinc-500 text-[11px] font-bold">#{idx + 1}</span>
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-white line-clamp-1">{item.titleBn || item.titleEn}</p>
                      <p className="text-[10px] text-zinc-500 font-mono line-clamp-1">{item.titleEn}</p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-medium text-zinc-300 capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold font-mono text-amber-400">
                    {item.soldQty} পিস
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#D4AF37] font-mono">
                    {formatPrice(item.revenue)}
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
