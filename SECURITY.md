# Unique Collection 4.0 - Security Architecture & Vulnerability Reporting

This document outlines the security architecture, data privacy measures, and security guidelines implemented in **Unique Collection 4.0**.

---

## 🔒 Security Architecture Highlights

### 1. HTTP Security Response Headers
The Express server (`server.ts`) enforces security headers on every request:
- `X-Content-Type-Options: nosniff` - Prevents MIME-type sniffing exploits.
- `X-Frame-Options: SAMEORIGIN` - Mitigates clickjacking attacks.
- `X-XSS-Protection: 1; mode=block` - Enables cross-site scripting filters in client browsers.
- `Referrer-Policy: strict-origin-when-cross-origin` - Shields referrer leakages.

### 2. API Key Protection & Server-Side Proxying
- The `GEMINI_API_KEY` is strictly confined to server-side code (`server.ts`).
- Never prefix secrets with `VITE_` or expose them in client bundles.
- All AI queries pass through `/api/ai/*` server endpoints.

### 3. Input Validation & Body Parsing Limits
- Express body parsing is capped at `25mb` for base64 upload endpoints.
- User input fields are sanitized against injection.

### 4. Authentication & Authorization
- Role-based authorization (`admin` vs. `customer`).
- Super Admin routes require verified admin credentials (`amsamiul27@gmail.com`).

---

## 🐛 Vulnerability Disclosure & Reporting

If you discover a potential security vulnerability in Unique Collection 4.0, please follow responsible disclosure guidelines:

1. **Email**: Send details directly to `amsamiul27@gmail.com` or `security@uniquecollection.bd`.
2. **Details**: Include proof-of-concept steps, affected endpoints, and severity assessment.
3. **Timeline**: We aim to acknowledge reports within 24 hours and patch critical issues within 72 hours.
