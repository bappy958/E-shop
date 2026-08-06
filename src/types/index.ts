export type Language = 'bn' | 'en';

export type CategorySlug = 
  | 'mens-shirts'
  | 'mens-tshirts'
  | 'panjabi'
  | 'womens-hijab'
  | 'womens-borka'
  | 'girls-collection'
  | 'accessories';

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  featured?: boolean;
  itemCount: number;
  status?: 'active' | 'inactive';
  parentCategory?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface Review {
  id: string;
  productId?: string;
  productTitle?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  commentBn: string;
  commentEn: string;
  status?: 'approved' | 'pending' | 'rejected';
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  avatar?: string;
}

export interface ColorOption {
  nameBn: string;
  nameEn: string;
  hex: string;
}

export interface Product {
  id: string;
  titleBn: string;
  titleEn: string;
  slug: string;
  category: string;
  brand?: string;
  price: number; // in BDT
  originalPrice?: number; // for discount display
  discountPercent?: number;
  thumbnail?: string;
  images: string[];
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL'] or ['Free Size']
  colors: ColorOption[];
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number;
  sku?: string;
  material?: string;
  weight?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEndTime?: string;
  status?: 'published' | 'draft' | 'hidden';
  rating: number;
  reviewsCount: number;
  shortDescriptionBn?: string;
  shortDescriptionEn?: string;
  descriptionBn: string;
  descriptionEn: string;
  fabricBn: string;
  fabricEn: string;
  careInstructionsBn: string;
  careInstructionsEn: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  reviews?: Review[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 200 for ৳200
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'sslcommerz' | 'stripe';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  createdAt: string;
  notes?: string;
  estimatedDeliveryDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  createdAt: string;
  totalSpent?: number;
  totalOrdersCount?: number;
}

export interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaTextBn: string;
  ctaTextEn: string;
  link: string;
  image: string;
  badgeBn?: string;
  badgeEn?: string;
  active: boolean;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';
  searchQuery: string;
}

export interface AdminAnalyticsData {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  totalProducts: number;
  outOfStockCount: number;
  categoryRevenue: { name: string; value: number; color: string }[];
  monthlySales: { month: string; sales: number; orders: number }[];
  orderStatusDistribution: { status: string; count: number; color: string }[];
  topProducts: { id: string; titleEn: string; titleBn: string; category: string; soldQty: number; revenue: number; image: string }[];
}

