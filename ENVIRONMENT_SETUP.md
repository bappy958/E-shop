# Unique Collection 4.0 - Environment Setup & Configuration

This document explains environment variable setup, development server parameters, and cloud secret injection.

---

## 🔑 Required Environment Variables Overview

| Variable | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Number | Yes | `3000` | Port where Express application listens |
| `NODE_ENV` | String | Yes | `development` | Runtime environment (`development` / `production`) |
| `GEMINI_API_KEY` | String | Yes (AI Features) | None | Google AI Studio key for `@google/genai` SDK |
| `APP_URL` | String | Optional | `http://localhost:3000` | Public URL host for self-referential links |
| `MONGODB_URI` | String | Production | In-Memory | MongoDB Atlas connection string |
| `JWT_SECRET` | String | Production | `default_secret` | Secret key for signing customer JWT tokens |

---

## 🛠️ Step-by-Step Local Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate or obtain your **Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Click **Create API Key**.
   - Paste key into `.env`:
     ```env
     GEMINI_API_KEY="AIzaSy..."
     ```

3. Verification:
   Start dev server:
   ```bash
   npm run dev
   ```
   Check `/api/health` in browser or curl:
   ```bash
   curl http://localhost:3000/api/health
   ```
