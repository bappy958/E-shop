# Unique Collection 4.0 - Super Admin User Manual

Welcome to the Super Admin User Manual for **Unique Collection 4.0**. This guide explains how store managers and administrative staff can operate the store.

---

## 🔑 Accessing the Admin Dashboard

1. Navigate to `http://localhost:3000/login` (or production URL `/login`).
2. Login with Super Admin credentials:
   - **Email**: `amsamiul27@gmail.com`
   - **Password**: `admin123`
3. Click the **"অ্যাডমিন ড্যাশবোর্ড" (Admin Dashboard)** link in top navigation header or account menu.

---

## 📊 Tab 1: Sales Analytics Center

- **Revenue Overview Widgets**: Displays total revenue, today's sales, monthly sales, total order counts, and out-of-stock items.
- **Monthly Revenue Chart**: Interactive area graph showing month-over-month BDT sales trends.
- **Category Sales Breakdown**: Pie chart showing percentage revenue generated across Panjabi, Shirts, Abaya, Hijab, T-Shirts, and Girls collection.
- **Top 5 Best-Selling Products**: Table highlighting top performing garments by quantity sold and gross revenue.

---

## 📦 Tab 2: Product Management & AI Writer

- **Adding a New Product**:
  1. Click `+ নতুন পণ্য যোগ করুন` (+ Add New Product) button.
  2. Enter English title, Bengali title, select Category, Brand, Price (BDT), Stock count, and fabric specifications.
  3. **AI Description Writer**: Click `✨ AI দিয়ে ডেসক্রিপশন তৈরি করুন` (Generate with AI) button. The system queries Gemini AI to generate Bengali and English product copy.
  4. Click `পণ্য সেভ করুন` (Save Product).
- **Product Actions**:
  - **Edit**: Modify price, stock, or status (`published` / `hidden`).
  - **Duplicate**: Create an instant copy for product variants.
  - **Delete**: Remove product.
  - **Bulk Actions**: Select multiple products to delete or toggle status in bulk.

---

## 🛍️ Tab 3: Order Processing Hub

- **Order Filtering**: View orders by status tabs (`All`, `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Updating Order Status**:
  1. Click `স্ট্যাটাস আপডেট` (Update Status) on any order row.
  2. Select new status (`processing`, `shipped`, `delivered`, or `cancelled`).
  3. Mark payment status as `paid` upon receiving bKash / Nagad payment confirmation.

---

## 🎟️ Tab 4: Promotional Coupons

- **Creating a Discount Coupon**:
  1. Click `+ নতুন কুপন যোগ করুন`.
  2. Enter coupon code (e.g. `EID2026`).
  3. Select discount type (`Percentage %` or `Flat Amount ৳`).
  4. Specify discount value, minimum order threshold, and expiration date.
  5. Save coupon.

---

## ⚠️ Tab 5: Inventory & Stock Alerts

- **Low Stock Table**: Automatically lists products where `stockCount <= lowStockThreshold` (default 10).
- **Quick Re-Stock Buttons**: Click `+10 রি-স্টক` or `+50` to instantly update inventory levels.
