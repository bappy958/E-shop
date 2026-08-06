# Unique Collection 4.0 - Database Schema & Data Models

This document specifies the MongoDB / Mongoose schema structure and entity relationship models for Unique Collection 4.0.

---

## 🗄️ Entity Overview & ER Relationships

```
┌──────────────┐         1:N         ┌──────────────┐
│   Customer   │────────────────────>│    Order     │
└──────────────┘                     └──────┬───────┘
                                            │ N:M (orderItems)
                                            ▼
┌──────────────┐         1:N         ┌──────────────┐
│   Category   │────────────────────>│   Product    │
└──────────────┘                     └──────┬───────┘
                                            │ 1:N
                                            ▼
                                     ┌──────────────┐
                                     │    Review    │
                                     └──────────────┘
```

---

## 📄 Schema Definitions

### 1. `ProductSchema` (Collection: `products`)

Stores details for fashion items across categories.

| Field Name | Type | Index / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` / `id` | String / ObjectId | Primary Key | Unique product identifier (e.g. `p-1`) |
| `titleBn` | String | Required, Trim | Bengali title (e.g. `রাজকীয় পাঞ্জাবি`) |
| `titleEn` | String | Required, Trim | English title (e.g. `Royal Luxury Panjabi`) |
| `slug` | String | Unique, Indexed | URL friendly slug (e.g. `royal-luxury-panjabi`) |
| `sku` | String | Unique, Indexed | Stock Keeping Unit (e.g. `UC-PAN-101`) |
| `category` | String | Indexed | Category slug reference (e.g. `panjabi`, `borka`) |
| `brand` | String | Default: `Unique Royal` | Brand name |
| `price` | Number | Required, Min: 0 | Selling price in BDT (৳) |
| `originalPrice`| Number | Optional | Original MRP before discount |
| `discountPercent`| Number | Default: 0 | Calculated discount percentage |
| `thumbnail` | String | Required | Primary image CDN URL |
| `images` | Array[String] | Max: 10 URLs | High-resolution product gallery images |
| `sizes` | Array[String] | Enum: `['S','M','L','XL','XXL','3XL']` | Available clothing size options |
| `colors` | Array[Object] | `{ nameBn, nameEn, hex }` | Color swatch metadata |
| `inStock` | Boolean | Default: `true` | Stock availability flag |
| `stockCount` | Number | Required, Min: 0 | Inventory quantity count |
| `lowStockThreshold`| Number | Default: 10 | Re-stock alert trigger threshold |
| `rating` | Number | Range: 1.0 - 5.0 | Average product rating |
| `reviewsCount` | Number | Default: 0 | Total number of approved reviews |
| `fabricBn` | String | Optional | Bengali fabric description |
| `fabricEn` | String | Optional | English fabric description |
| `status` | String | Enum: `['published', 'hidden', 'draft']` | Catalog visibility status |
| `createdAt` | Date | Indexed, Default: `Date.now()` | Record timestamp |

**Indexes**:
- `{ slug: 1 }` (Unique)
- `{ sku: 1 }` (Unique)
- `{ category: 1, price: 1 }`
- `{ status: 1, inStock: 1 }`

---

### 2. `OrderSchema` (Collection: `orders`)

Tracks customer checkout transactions and shipping lifecycles.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique human-readable Order ID (e.g. `ord-[#4821]`) |
| `trackingNumber` | String | Unique tracking code (e.g. `UC-2026-8819`) |
| `userName` | String | Customer full name |
| `userEmail` | String | Customer email address |
| `userPhone` | String | Customer mobile phone (e.g. `01711223344`) |
| `shippingAddress` | Object | `{ district, upazila, fullAddress, notes }` |
| `items` | Array[Object] | Array of `{ productId, titleEn, price, quantity, selectedSize, selectedColor }` |
| `subtotal` | Number | Total item price before shipping and discount |
| `shippingCost` | Number | Delivery charge (BDT 60 Dhaka / BDT 120 Outside) |
| `discountAmount` | Number | Applied coupon discount in BDT |
| `totalAmount` | Number | Final bill amount (`subtotal + shippingCost - discountAmount`) |
| `paymentMethod` | String | Enum: `['bkash', 'nagad', 'rocket', 'bank', 'cod']` |
| `paymentStatus` | String | Enum: `['pending', 'paid', 'failed', 'refunded']` |
| `orderStatus` | String | Enum: `['pending', 'processing', 'shipped', 'delivered', 'cancelled']` |
| `estimatedDeliveryDate` | String | Formatted date string (YYYY-MM-DD) |
| `createdAt` | Date | Timestamp of order placement |

**Indexes**:
- `{ trackingNumber: 1 }` (Unique)
- `{ userEmail: 1 }`
- `{ orderStatus: 1, createdAt: -1 }`

---

### 3. `CustomerSchema` (Collection: `users`)

Stores registered customer credentials and CRM metrics.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | String | User ID |
| `name` | String | Customer full name |
| `email` | String | Unique email address |
| `phone` | String | Mobile number |
| `passwordHash` | String | Bcrypt password hash |
| `role` | String | `admin` | `customer` |
| `totalSpent` | Number | Lifetime monetary spend in BDT |
| `totalOrdersCount`| Number | Number of completed orders |
| `address` | Object | Default shipping address |
| `createdAt` | Date | User sign-up timestamp |

---

### 4. `CouponSchema` (Collection: `coupons`)

Manages promotional discount codes.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `code` | String | Unique uppercase coupon code (e.g. `EID2026`) |
| `discountType` | String | `percentage` | `fixed` |
| `discountValue` | Number | Percentage value (1-100) or fixed BDT amount |
| `minOrderAmount` | Number | Minimum order threshold required |
| `maxDiscount` | Number | Cap on percentage discounts in BDT |
| `usageLimit` | Number | Maximum allowed redemptions |
| `usedCount` | Number | Current redemption tally |
| `expiresAt` | Date | Coupon expiration date |
| `isActive` | Boolean | Activation state toggle |

---

### 5. `CategorySchema` & `BrandSchema`

- **`Category`**: `{ id, slug, nameBn, nameEn, descriptionBn, descriptionEn, image, itemCount, parentCategory, status }`
- **`Brand`**: `{ id, name, slug, logo, description, status }`
