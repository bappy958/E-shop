import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_BRANDS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from './src/data/initialData.ts';
import { sanitizeText, toNumberOrDefault, toSlug } from './src/serverUtils.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory data persistence store initialized with rich Bangladeshi fashion data
let products: any[] = [...INITIAL_PRODUCTS];
let categories: any[] = [...INITIAL_CATEGORIES];
let brands: any[] = [...INITIAL_BRANDS];
let coupons: any[] = [...INITIAL_COUPONS];
let banners: any[] = [...INITIAL_BANNERS];
let reviews: any[] = [...INITIAL_REVIEWS];
let ordersStore: any[] = [...INITIAL_ORDERS];
let customersStore: any[] = [
  {
    id: 'usr-1',
    name: 'Md. Tanvir Hossain',
    email: 'tanvir@gmail.com',
    phone: '01711223344',
    role: 'customer',
    totalSpent: 2995,
    totalOrdersCount: 1,
    createdAt: '2026-08-01',
  },
  {
    id: 'usr-2',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@yahoo.com',
    phone: '01899887766',
    role: 'customer',
    totalSpent: 4330,
    totalOrdersCount: 1,
    createdAt: '2026-08-03',
  },
  {
    id: 'usr-3',
    name: 'Sakib Rahman',
    email: 'sakib@gmail.com',
    phone: '01911223344',
    role: 'customer',
    totalSpent: 4120,
    totalOrdersCount: 1,
    createdAt: '2026-08-05',
  },
];

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini API client initialization deferred or missing key:', err);
  }
}

// REST API Endpoints

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Unique Collection 4.0', timestamp: new Date().toISOString() });
});

// ==================== IMAGE UPLOAD API ====================
app.post('/api/upload', (req, res) => {
  const { imageBase64, imageName } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 field is required' });
  }

  // Generate a mock CDN/Cloudinary style URL for uploaded image
  const imgId = `uc-img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const mockUrl = imageBase64.startsWith('data:')
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  res.json({
    success: true,
    url: mockUrl,
    imageId: imgId,
    message: 'Image uploaded successfully!',
  });
});

// ==================== PRODUCTS APIs ====================
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, sortBy, onSale, inStock, status } = req.query;

  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status || (!p.status && status === 'published'));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.titleBn || '').toLowerCase().includes(q) ||
        (p.titleEn || '').toLowerCase().includes(q) ||
        (p.descriptionBn || '').toLowerCase().includes(q) ||
        (p.descriptionEn || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t: string) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (onSale === 'true') {
    filtered = filtered.filter((p) => (p.discountPercent || 0) > 0 || (p.originalPrice && p.originalPrice > p.price));
  }

  if (inStock === 'true') {
    filtered = filtered.filter((p) => p.inStock && p.stockCount > 0);
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        break;
    }
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create Product
app.post('/api/products', (req, res) => {
  const p = req.body || {};
  const titleEn = sanitizeText(p.titleEn, sanitizeText(p.titleBn, 'New Product'));
  const titleBn = sanitizeText(p.titleBn, titleEn);
  const category = sanitizeText(p.category, 'panjabi');
  const slug = sanitizeText(p.slug, toSlug(titleEn, 'product'));
  const sku = sanitizeText(p.sku, `UC-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
  const price = toNumberOrDefault(p.price, 0);
  const originalPrice = p.originalPrice !== undefined ? toNumberOrDefault(p.originalPrice, price) : undefined;
  const stockCount = toNumberOrDefault(p.stockCount, 50);
  const lowStockThreshold = toNumberOrDefault(p.lowStockThreshold, 10);
  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : toNumberOrDefault(p.discountPercent, 0);

  const newProduct = {
    id: `p-${Date.now()}`,
    titleBn,
    titleEn,
    slug,
    sku,
    category,
    brand: sanitizeText(p.brand, 'Unique Royal'),
    price,
    originalPrice,
    discountPercent,
    thumbnail: sanitizeText(p.thumbnail, Array.isArray(p.images) && p.images[0] ? String(p.images[0]) : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'),
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'],
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['M', 'L', 'XL'],
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ nameBn: 'কালো', nameEn: 'Black', hex: '#000000' }],
    inStock: stockCount > 0,
    stockCount,
    lowStockThreshold,
    material: sanitizeText(p.material, sanitizeText(p.fabricEn, 'Premium Cotton')),
    weight: sanitizeText(p.weight, '350g'),
    isNewArrival: p.isNewArrival ?? true,
    isBestSeller: p.isBestSeller ?? false,
    isFeatured: p.isFeatured ?? false,
    isFlashSale: p.isFlashSale ?? false,
    flashSaleEndTime: sanitizeText(p.flashSaleEndTime, ''),
    status: sanitizeText(p.status, 'published'),
    rating: 5.0,
    reviewsCount: 0,
    shortDescriptionBn: sanitizeText(p.shortDescriptionBn, ''),
    shortDescriptionEn: sanitizeText(p.shortDescriptionEn, ''),
    descriptionBn: sanitizeText(p.descriptionBn, 'প্রিমিয়াম কোয়ালিটির রাজকীয় পোশাক।'),
    descriptionEn: sanitizeText(p.descriptionEn, 'Premium quality luxury fashion attire.'),
    fabricBn: sanitizeText(p.fabricBn, '১০০% প্রিমিয়াম সুতি'),
    fabricEn: sanitizeText(p.fabricEn, '100% Premium Cotton'),
    careInstructionsBn: sanitizeText(p.careInstructionsBn, 'হাতে ধুয়ে ড্রায়ারে শুকান।'),
    careInstructionsEn: sanitizeText(p.careInstructionsEn, 'Gentle hand wash and line dry.'),
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['new', category],
    seoTitle: sanitizeText(p.seoTitle, titleEn),
    seoDescription: sanitizeText(p.seoDescription, sanitizeText(p.shortDescriptionEn, p.descriptionEn)),
    reviews: [],
    createdAt: new Date().toISOString(),
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// Update Product
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price ? Number(req.body.price) : existing.price,
    stockCount: req.body.stockCount !== undefined ? Number(req.body.stockCount) : existing.stockCount,
    inStock: req.body.stockCount !== undefined ? Number(req.body.stockCount) > 0 : existing.inStock,
  };

  products[index] = updated;
  res.json({ success: true, product: updated });
});

// Delete Product
app.delete('/api/products/:id', (req, res) => {
  products = products.filter((p) => p.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Duplicate Product
app.post('/api/products/duplicate/:id', (req, res) => {
  const source = products.find((p) => p.id === req.params.id);
  if (!source) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const duplicated = {
    ...source,
    id: `p-${Date.now()}`,
    titleBn: `${source.titleBn} (কপি)`,
    titleEn: `${source.titleEn} (Copy)`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    sku: `${source.sku || 'UC'}-COPY-${Math.floor(10 + Math.random() * 90)}`,
    createdAt: new Date().toISOString(),
  };

  products.unshift(duplicated);
  res.status(201).json({ success: true, product: duplicated });
});

// Bulk Operations
app.post('/api/products/bulk-action', (req, res) => {
  const { action, ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Product IDs array required' });
  }

  if (action === 'delete') {
    products = products.filter((p) => !ids.includes(p.id));
  } else if (action === 'publish') {
    products = products.map((p) => (ids.includes(p.id) ? { ...p, status: 'published' } : p));
  } else if (action === 'unpublish' || action === 'hide') {
    products = products.map((p) => (ids.includes(p.id) ? { ...p, status: 'hidden' } : p));
  }

  res.json({ success: true, count: ids.length, action });
});

// ==================== CATEGORIES APIs ====================
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { nameBn, nameEn, slug, descriptionBn, descriptionEn, image, status, parentCategory } = req.body || {};
  const categoryNameEn = sanitizeText(nameEn, 'Category');
  const newCat = {
    id: `cat-${Date.now()}`,
    slug: sanitizeText(slug, toSlug(categoryNameEn, 'category')),
    nameBn: sanitizeText(nameBn, categoryNameEn),
    nameEn: categoryNameEn,
    descriptionBn: sanitizeText(descriptionBn, ''),
    descriptionEn: sanitizeText(descriptionEn, ''),
    image: sanitizeText(image, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'),
    itemCount: 0,
    status: sanitizeText(status, 'active'),
    parentCategory: sanitizeText(parentCategory, 'None'),
  };
  categories.unshift(newCat);
  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const idx = categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  categories[idx] = { ...categories[idx], ...req.body };
  res.json({ success: true, category: categories[idx] });
});

app.delete('/api/categories/:id', (req, res) => {
  categories = categories.filter((c) => c.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// ==================== BRANDS APIs ====================
app.get('/api/brands', (req, res) => {
  res.json(brands);
});

app.post('/api/brands', (req, res) => {
  const { name, slug, logo, description, status } = req.body || {};
  const brandName = sanitizeText(name, 'Brand');
  const newBrand = {
    id: `b-${Date.now()}`,
    name: brandName,
    slug: sanitizeText(slug, toSlug(brandName, 'brand')),
    logo: sanitizeText(logo, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80'),
    description: sanitizeText(description, ''),
    status: sanitizeText(status, 'active'),
  };
  brands.unshift(newBrand);
  res.status(201).json({ success: true, brand: newBrand });
});

app.put('/api/brands/:id', (req, res) => {
  const idx = brands.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Brand not found' });
  brands[idx] = { ...brands[idx], ...req.body };
  res.json({ success: true, brand: brands[idx] });
});

app.delete('/api/brands/:id', (req, res) => {
  brands = brands.filter((b) => b.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// ==================== COUPONS APIs ====================
app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.post('/api/coupons', (req, res) => {
  const { code, discountType, discountValue, minOrderAmount, expiresAt, isActive, maxDiscount, usageLimit } = req.body || {};
  const normalizedCode = sanitizeText(code, 'SAVE').toUpperCase().trim();
  const newCoupon = {
    id: `c-${Date.now()}`,
    code: normalizedCode,
    discountType: sanitizeText(discountType, 'percentage'),
    discountValue: toNumberOrDefault(discountValue, 10),
    minOrderAmount: toNumberOrDefault(minOrderAmount, 1000),
    maxDiscount: maxDiscount !== undefined ? toNumberOrDefault(maxDiscount, undefined as never) : undefined,
    usageLimit: usageLimit !== undefined ? toNumberOrDefault(usageLimit, 100) : 100,
    usedCount: 0,
    expiresAt: sanitizeText(expiresAt, '2026-12-31T23:59:59Z'),
    isActive: isActive ?? true,
  };
  coupons.unshift(newCoupon);
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.put('/api/coupons/:id', (req, res) => {
  const idx = coupons.findIndex((c) => c.id === req.params.id || c.code === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Coupon not found' });
  coupons[idx] = { ...coupons[idx], ...req.body };
  res.json({ success: true, coupon: coupons[idx] });
});

app.delete('/api/coupons/:id', (req, res) => {
  coupons = coupons.filter((c) => c.id !== req.params.id && c.code !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = coupons.find((c) => c.code === (code || '').toUpperCase().trim() && c.isActive);

  if (!coupon) {
    return res.status(400).json({ valid: false, messageBn: 'অবৈধ বা মেয়ারোত্তীর্ণ কুপন কোড!', messageEn: 'Invalid or expired coupon code!' });
  }

  if (subtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      valid: false,
      messageBn: `এই কুপনের জন্য সর্বনিম্ন অর্ডার ৳${coupon.minOrderAmount}`,
      messageEn: `Minimum order ৳${coupon.minOrderAmount} required for this coupon`,
    });
  }

  res.json({ valid: true, coupon });
});

// ==================== REVIEWS APIs ====================
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

app.patch('/api/reviews/:id/status', (req, res) => {
  const { status } = req.body;
  const idx = reviews.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found' });
  reviews[idx].status = status;
  res.json({ success: true, review: reviews[idx] });
});

app.delete('/api/reviews/:id', (req, res) => {
  reviews = reviews.filter((r) => r.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// ==================== CUSTOMERS APIs ====================
app.get('/api/customers', (req, res) => {
  res.json(customersStore);
});

// ==================== ORDERS APIs ====================
app.get('/api/orders', (req, res) => {
  res.json(ordersStore);
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: `ord-[#${Math.floor(1000 + Math.random() * 9000)}]`,
    trackingNumber: `UC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    orderStatus: orderData.orderStatus || 'pending',
    paymentStatus: orderData.paymentStatus || 'pending',
    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
  ordersStore.unshift(newOrder);

  // Update customer spend stats if matching user
  const custIndex = customersStore.findIndex((c) => c.email === newOrder.userEmail);
  if (custIndex !== -1) {
    customersStore[custIndex].totalSpent = (customersStore[custIndex].totalSpent || 0) + newOrder.totalAmount;
    customersStore[custIndex].totalOrdersCount = (customersStore[custIndex].totalOrdersCount || 0) + 1;
  } else if (newOrder.userEmail) {
    customersStore.push({
      id: `usr-${Date.now()}`,
      name: newOrder.userName || 'Customer',
      email: newOrder.userEmail,
      phone: newOrder.userPhone || '01700000000',
      role: 'customer',
      totalSpent: newOrder.totalAmount,
      totalOrdersCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    });
  }

  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status, paymentStatus } = req.body;
  const idx = ordersStore.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });

  if (status) ordersStore[idx].orderStatus = status;
  if (paymentStatus) ordersStore[idx].paymentStatus = paymentStatus;

  res.json({ success: true, order: ordersStore[idx] });
});

app.get('/api/orders/track/:trackingNumber', (req, res) => {
  const order = ordersStore.find(
    (o) => o.trackingNumber.toLowerCase() === req.params.trackingNumber.toLowerCase() || o.id === req.params.trackingNumber
  );
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// ==================== ADMIN ANALYTICS API ====================
app.get('/api/admin/analytics', (req, res) => {
  const totalRevenue = ordersStore.reduce((acc, o) => acc + (o.totalAmount || 0), 11445);
  const totalOrders = ordersStore.length + 12;
  const pendingOrders = ordersStore.filter((o) => o.orderStatus === 'pending').length + 3;
  const deliveredOrders = ordersStore.filter((o) => o.orderStatus === 'delivered').length + 8;
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockCount <= 0).length;

  const categoryRevenue = [
    { name: 'Panjabi', value: 45000, color: '#D4AF37' },
    { name: 'Shirts', value: 28000, color: '#3B82F6' },
    { name: 'Abaya & Borka', value: 35000, color: '#EC4899' },
    { name: 'T-Shirts & Polo', value: 18000, color: '#10B981' },
    { name: 'Hijab', value: 12000, color: '#8B5CF6' },
    { name: 'Girls Collection', value: 15000, color: '#F59E0B' },
  ];

  const monthlySales = [
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

  const orderStatusDistribution = [
    { status: 'Pending', count: pendingOrders, color: '#F59E0B' },
    { status: 'Processing', count: 4, color: '#3B82F6' },
    { status: 'Shipped', count: 3, color: '#8B5CF6' },
    { status: 'Delivered', count: deliveredOrders, color: '#10B981' },
    { status: 'Cancelled', count: 1, color: '#EF4444' },
  ];

  const topProducts = products.slice(0, 5).map((p, i) => ({
    id: p.id,
    titleEn: p.titleEn,
    titleBn: p.titleBn,
    category: p.category,
    soldQty: 45 - i * 7,
    revenue: (45 - i * 7) * p.price,
    image: p.thumbnail || p.images[0],
  }));

  res.json({
    totalRevenue,
    todayRevenue: 8650,
    monthlyRevenue: 135000,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalCustomers: customersStore.length + 24,
    totalProducts: products.length,
    outOfStockCount,
    categoryRevenue,
    monthlySales,
    orderStatusDistribution,
    topProducts,
  });
});

// AI Description Generator (Admin Endpoint)
app.post('/api/ai/generate-description', async (req, res) => {
  const { titleEn, category, fabricEn } = req.body;

  if (!titleEn) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!ai && !process.env.GEMINI_API_KEY) {
    return res.json({
      descriptionBn: `ইউনিক কালেকশন ৪.০ এর প্রিমিয়াম ${titleEn}। ১০০% আসল ${fabricEn || 'কটন'} ফ্যাব্রিকসে চমৎকার এম্ব্রয়ডারি ও নিখুঁত স্টিচিং দিয়ে তৈরি। যেকোনো উৎসব ও পার্টিতে রাজকীয় লুক এনে দেবে।`,
      descriptionEn: `Royal luxury ${titleEn} from Unique Collection 4.0. Handcrafted with high thread count ${fabricEn || 'cotton'} fabric, offering flawless tailoring, regal elegance, and supreme comfort.`,
      fabricBn: fabricEn || '১০০% প্রিমিয়াম সুতি',
      fabricEn: fabricEn || '100% Premium Cotton',
    });
  }

  try {
    const client = ai || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Write a luxury marketing product description for a Bangladeshi high-end clothing brand "Unique Collection 4.0".
Product Name: ${titleEn}
Category: ${category}
Fabric: ${fabricEn || '100% Premium Cotton'}

Return JSON format:
{
  "descriptionBn": "Polished, elegant Bengali description emphasizing luxury stitching, fabric softness, Bangladeshi cultural elegance.",
  "descriptionEn": "Sophisticated English description for premium buyers.",
  "fabricBn": "Bengali fabric specification",
  "fabricEn": "English fabric specification"
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err) {
    res.json({
      descriptionBn: `ইউনিক কালেকশন ৪.০ এর প্রিমিয়াম ${titleEn}।`,
      descriptionEn: `Exclusive ${titleEn} by Unique Collection 4.0.`,
      fabricBn: fabricEn || 'প্রিমিয়াম কটন',
      fabricEn: fabricEn || 'Premium Cotton',
    });
  }
});

// AI Fashion Assistant / Styler
app.post('/api/ai/styler', async (req, res) => {
  const { userMessage, userLanguage = 'bn', occasion } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai && !process.env.GEMINI_API_KEY) {
    return res.json({
      replyBn: `স্বাগতম! ইউনিক কালেকশন ৪.০ এর পক্ষ থেকে আপনাকে শুভেচ্ছা। নিচে আপনার জন্য আমাদের সেরা কিছু পোশাক দেখানো হলো:`,
      replyEn: `Welcome from Unique Collection 4.0. Here are our top handpicked recommendations for you:`,
      recommendedProducts: products.slice(0, 3),
    });
  }

  try {
    const client = ai || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const catalogContext = products
      .slice(0, 8)
      .map((p) => `ID: ${p.id}, Title: ${p.titleEn}, Price: BDT ${p.price}, Category: ${p.category}`)
      .join('\n');

    const prompt = `You are "Unique AI Styler" for Bangladeshi fashion store "Unique Collection 4.0".
Catalog:
${catalogContext}

User Query: "${userMessage}"
Language: ${userLanguage}

Return JSON with "reply" and "recommendedIds" (max 3 IDs).`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    const recommendedProducts = products.filter((p) => (parsed.recommendedIds || []).includes(p.id));

    res.json({
      reply: parsed.reply,
      recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 3),
    });
  } catch (err) {
    res.json({
      reply: userLanguage === 'bn' ? 'আমাদের সেরা কালেকশনগুলো দেখুন:' : 'Check out our top collections:',
      recommendedProducts: products.slice(0, 3),
    });
  }
});

// Serve Vite frontend in development & built static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unique Collection 4.0 Server running on ${APP_URL}`);
    console.log(`Environment: ${NODE_ENV}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the existing process or set a different PORT.`);
      process.exit(1);
    }

    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
}

startServer();
