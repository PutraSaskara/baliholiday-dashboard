# 🤖 AI AGENT CONTEXT: Authentication & Routing Architecture

**To Any AI Agent / Assistant reading this file:** 
This file contains the strict architectural guidelines for routing and authentication in this Express.js backend project. You MUST follow these patterns when modifying or creating new routes.

---

## 1. Dual Authentication System
This project uses a dual-layer authentication system to protect its endpoints:

### A. Public Routes (Read-Only / `GET`)
- **Middleware:** `apiKeyAuth` (`middleware/apiKeyAuth.js`)
- **Purpose:** Protects public endpoints from unauthorized bot scraping. Intended to be consumed by the main frontend website.
- **Mechanism:** Expects a header `x-api-key` which must match the `PUBLIC_API_KEY` defined in the `.env` file.

### B. Private / Admin Routes (Write / `POST`, `PATCH`, `DELETE`)
- **Middleware:** `authMiddleware` (`middleware/auth.js`)
- **Purpose:** Protects administrative endpoints (Dashboard operations).
- **Mechanism:** Uses JWT (JSON Web Token). Expects a header `Authorization: Bearer <token>`. The token is generated via the `/login` endpoint (`routes/authRoutes.js`).

---

## 2. Route Structuring Pattern (Strict Rule)
To maintain clean code and prevent accidental exposure of admin routes, DO NOT inject middleware into every single route line. Instead, use the **Top-Middle-Bottom Grouping Pattern** within the route files.

### The Pattern:
1. **TOP (Public Group):** All `GET` routes. Inject `apiKeyAuth` directly into these lines.
2. **MIDDLE (The Gate):** Apply `router.use(authMiddleware);`. This creates a checkpoint. Everything below this line strictly requires a valid JWT.
3. **BOTTOM (Private Group):** All `POST`, `PATCH`, `DELETE` routes. Do NOT write `authMiddleware` on these lines as they inherit it from the middle gate.

---

## 3. Code Example (Blueprint)
When generating new route files (e.g., `CategoryRoute.js`), you MUST format it exactly like this:

```javascript
const express = require('express');
const ExampleController = require('../controllers/ExampleController');
const authMiddleware = require('../middleware/auth.js'); 
const apiKeyAuth = require('../middleware/apiKeyAuth.js');

const router = express.Router();

// --- KELOMPOK PUBLIK (Hanya butuh API Key) ---
router.get('/example', apiKeyAuth, ExampleController.getAll);
router.get('/example/:id', apiKeyAuth, ExampleController.getById);

// --- GERBANG JWT ---
// Mulai dari sini ke bawah, semua rute wajib pakai Token JWT
router.use(authMiddleware);

// --- KELOMPOK PRIVAT / ADMIN ---
router.post('/example', ExampleController.create);
router.patch('/example/:id', ExampleController.update);
router.delete('/example/:id', ExampleController.delete);

module.exports = router;
```

---

## 4. Required Environment Variables (.env)
For the system to work, the `.env` file must contain:
```env
PUBLIC_API_KEY=your_secret_api_key_here
ADMIN_USERNAME=admin_user
ADMIN_PASSWORD=admin_pass
```
*(Note: The `/login` route uses `process.env.ADMIN_USERNAME` and `process.env.ADMIN_PASSWORD` as hardcoded admin credentials).*

---

## 🚨 AI Instruction Check
If the human user asks you to "create a new route for X", **DO NOT** use the old pattern of putting `authMiddleware` on every line like `router.post('/x', authMiddleware, controller.create)`. **ALWAYS** use the `router.use(authMiddleware)` grouping pattern shown above.