# Unique Collection 4.0 - Production Deployment & Cloud Infrastructure Guide

This guide details step-by-step instructions for deploying Unique Collection 4.0 across modern cloud infrastructure providers including **Google Cloud Run, Vercel, Render, AWS App Runner, MongoDB Atlas, and Cloudinary**.

---

## ☁️ Architecture Overview

The application is engineered as a unified Node.js / Express application hosting Vite SPA assets in production mode.

```
                  ┌───────────────────────────────┐
                  │    Custom Domain / DNS        │
                  │   (uniquecollection.com)      │
                  └───────────────┬───────────────┘
                                  │ HTTPS (SSL)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Google Cloud Run Container                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Node.js Server (Port 3000) serving dist/server.cjs & static│  │
│  └──────────────┬───────────────────────────────┬─────────────┘  │
└─────────────────┼───────────────────────────────┼────────────────┘
                  │                               │
                  ▼                               ▼
┌──────────────────────────────────┐    ┌──────────────────────────┐
│     MongoDB Atlas Database       │    │ Cloudinary Image CDN     │
└──────────────────────────────────┘    └──────────────────────────┘
```

---

## 🚀 Option 1: Google Cloud Run Deployment (Recommended)

Google Cloud Run provides auto-scaling serverless container hosting ideal for Node.js + Express full-stack applications.

### Step 1: Dockerfile Configuration
Create a `Dockerfile` at the root directory:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

### Step 2: Build & Push to Google Artifact Registry
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/unique-collection:v4.0 .

# Deploy to Cloud Run
gcloud run deploy unique-collection \
  --image gcr.io/YOUR_PROJECT_ID/unique-collection:v4.0 \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY="your_gemini_key",NODE_ENV="production"
```

---

## 🍃 Option 2: MongoDB Atlas Database Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a M0 Free Cluster or M10 Shared Cluster in region `asia-southeast1 (Singapore)`.
3. Go to **Database Access** -> Add User (`uc_admin` / Strong Password).
4. Go to **Network Access** -> Add IP Address `0.0.0.0/0` (Allow Cloud Run).
5. Copy Connection String:
   ```
   mongodb+srv://uc_admin:<password>@cluster0.mongodb.net/unique_collection?retryWrites=true&w=majority
   ```

---

## 🖼️ Option 3: Cloudinary CDN Setup for Product Images

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Obtain your `Cloud Name`, `API Key`, and `API Secret` from Dashboard.
3. Configure environment variables in `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="unique-collection-cdn"
   CLOUDINARY_API_KEY="1234567890"
   CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
   ```

---

## 🌐 Custom Domain & SSL Certificate Setup

1. In Google Cloud Run Dashboard, go to **Custom Domains**.
2. Click **Add Mapping** and enter `uniquecollection.com`.
3. Add the generated `CNAME` and `A` records to your Domain Registrar (e.g. Namecheap, Cloudflare, GoDaddy).
4. Google Cloud Run automatically provisions an SSL/TLS Managed Certificate within 15-30 minutes.

---

## 📊 Post-Deployment Monitoring & Health Checks

- Health Check Endpoint: `https://uniquecollection.com/api/health`
- Cloud Run Logging: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=unique-collection"`
- Set CPU Auto-scaling: Min Instances = 1 (to eliminate cold starts), Max Instances = 10.
