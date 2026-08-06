import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Product, Order, Coupon, Category, Brand, Review, AdminAnalyticsData } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from '../data/initialData';
import {
  BarChart2,
  Package,
  ShoppingBag,
  Layers,
  Award,
  Users,
  Tag,
  Star,
  AlertTriangle,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

import { AdminAnalyticsView } from '../components/admin/AdminAnalyticsView';
import { AdminProductsView } from '../components/admin/AdminProductsView';
import { AdminCategoriesView } from '../components/admin/AdminCategoriesView';
import { AdminBrandsView } from '../components/admin/AdminBrandsView';
import { AdminOrdersView } from '../components/admin/AdminOrdersView';
import { AdminCustomersView } from '../components/admin/AdminCustomersView';
import { AdminCouponsView } from '../components/admin/AdminCouponsView';
import { AdminReviewsView } from '../components/admin/AdminReviewsView';
import { AdminInventoryView } from '../components/admin/AdminInventoryView';

export const AdminDashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { language } = useLanguage();
  const { formatPrice, showToast } = useCart();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'categories' | 'brands' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'inventory'
  >('analytics');

  // Master States
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data from APIs
  const loadAnalytics = () => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => setAnalyticsData(data))
      .catch(() => {});
  };

  const loadProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]));
  };

  const loadCategories = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  };

  const loadBrands = () => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBrands(data);
        } else {
          setBrands([]);
        }
      })
      .catch(() => setBrands([]));
  };

  const loadOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]));
  };

  const loadCoupons = () => {
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoupons(data);
        } else {
          setCoupons([]);
        }
      })
      .catch(() => setCoupons([]));
  };

  const loadReviews = () => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch(() => setReviews([]));
  };

  const loadAllData = () => {
    setIsLoading(true);
    Promise.all([
      loadAnalytics(),
      loadProducts(),
      loadCategories(),
      loadBrands(),
      loadOrders(),
      loadCoupons(),
      loadReviews(),
    ]).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const lowStockCount = products.filter((p) => p.stockCount <= (p.lowStockThreshold || 10)).length;

  return (
    <div className="bg-black text-white min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-[10px] tracking-widest uppercase flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>SUPER ADMIN DASHBOARD</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 text-[11px] font-mono">Live System Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
              ইউনিক কালেকশন ৪.০ অ্যাডমিন ড্যাশবোর্ড
            </h1>

            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <span>এডমিন: <strong className="text-white">{currentUser?.name || 'Am Samiul Islam Abir'}</strong> ({currentUser?.email || 'amsamiul27@gmail.com'})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>ওয়েবসাইট ভিজিট করুন (Storefront)</span>
            </button>

            <button
              onClick={loadAllData}
              title="ডাটা রিফ্রেশ করুন"
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-[#D4AF37] rounded-xl transition-all"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>লগআউট (Logout)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-zinc-950 p-2 rounded-2xl border border-zinc-800/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <BarChart2 size={16} />
            <span>এনালাইটিক্স (Analytics)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Package size={16} />
            <span>পণ্যসমূহ ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ShoppingBag size={16} />
            <span>অর্ডারসমূহ ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Layers size={16} />
            <span>ক্যাটাগরি ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'brands'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Award size={16} />
            <span>ব্র্যান্ডসমূহ ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Users size={16} />
            <span>গ্রাহকগণ</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Tag size={16} />
            <span>কুপন ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Star size={16} />
            <span>রিভিউ ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <AlertTriangle size={16} className={lowStockCount > 0 ? 'text-amber-400' : ''} />
            <span>স্টক অ্যালার্ট</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-mono">
                {lowStockCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Views */}
        <div>
          {activeTab === 'analytics' && (
            <AdminAnalyticsView
              analytics={analyticsData}
              products={products}
              orders={orders}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsView
              products={products}
              categories={categories}
              brands={brands}
              formatPrice={formatPrice}
              showToast={showToast}
              onRefreshProducts={loadProducts}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesView
              categories={categories}
              showToast={showToast}
              onRefreshCategories={loadCategories}
            />
          )}

          {activeTab === 'brands' && (
            <AdminBrandsView
              brands={brands}
              showToast={showToast}
              onRefreshBrands={loadBrands}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersView
              orders={orders}
              formatPrice={formatPrice}
              showToast={showToast}
              onRefreshOrders={loadOrders}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomersView
              orders={orders}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'coupons' && (
            <AdminCouponsView
              coupons={coupons}
              formatPrice={formatPrice}
              showToast={showToast}
              onRefreshCoupons={loadCoupons}
            />
          )}

          {activeTab === 'reviews' && (
            <AdminReviewsView
              reviews={reviews}
              showToast={showToast}
              onRefreshReviews={loadReviews}
            />
          )}

          {activeTab === 'inventory' && (
            <AdminInventoryView
              products={products}
              formatPrice={formatPrice}
              showToast={showToast}
              onRefreshProducts={loadProducts}
            />
          )}
        </div>

      </div>
    </div>
  );
};
