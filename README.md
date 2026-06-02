# JobMate — Full-Stack Setup Guide

## Architecture Overview

```
jobmate/
├── backend/          ← Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ServiceController.php
│   │   │   ├── BookingController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── AdminController.php
│   │   │   └── UploadController.php
│   │   ├── Http/Middleware/
│   │   │   └── RoleMiddleware.php
│   │   ├── Http/Requests/
│   │   │   ├── RegisterRequest.php
│   │   │   ├── LoginRequest.php
│   │   │   ├── ServiceRequest.php
│   │   │   └── BookingRequest.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Service.php
│   │   │   ├── Booking.php
│   │   │   ├── Review.php
│   │   │   └── ServiceMedia.php
│   │   └── Policies/
│   │       ├── ServicePolicy.php
│   │       └── BookingPolicy.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/DatabaseSeeder.php
│   └── routes/api.php
│
└── frontend/         ← React 19 + Redux Toolkit
    ├── src/
    │   ├── api/
    │   │   ├── client.js          ← Axios base
    │   │   ├── authApi.js
    │   │   ├── serviceApi.js
    │   │   ├── bookingApi.js
    │   │   ├── reviewApi.js
    │   │   └── adminApi.js
    │   ├── store/
    │   │   ├── store.js
    │   │   ├── authSlice.js       ← Real Sanctum auth
    │   │   ├── serviceSlice.js    ← API-backed
    │   │   ├── bookingSlice.js    ← API-backed
    │   │   └── reviewSlice.js     ← API-backed
    │   ├── router/
    │   │   └── guards.jsx         ← ProtectedRoute, AdminRoute
    │   ├── pages/
    │   │   ├── BrowsePage.jsx     ← Server-side filtering
    │   │   ├── ProfilePage.jsx    ← Real service + booking
    │   │   ├── Dashboard.jsx      ← Real bookings/services
    │   │   ├── CheckoutPage.jsx   ← Real payment flow
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminUsers.jsx
    │   │       ├── AdminServices.jsx
    │   │       └── AdminBookings.jsx
    │   ├── components/
    │   │   ├── AuthModal.jsx      ← Real API + FormData
    │   │   └── ServiceFormModal.jsx ← Real file uploads
    │   └── App.jsx                ← Full routing
```

---

## Quick Start

### Backend

```bash
cd backend

# Install dependencies
composer install

# Environment
cp .env.example .env
php artisan key:generate

# Configure .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jobmate
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Migrate and seed
php artisan migrate:fresh --seed

# Link storage
php artisan storage:link

# Start
php artisan serve
```

### Frontend

```bash
cd frontend

# Install
npm install

# Environment
echo 'VITE_API_URL=http://localhost:8000/api' > .env.local

# Install additional dependency
npm install axios

# Start
npm run dev
```

---

## Key Changes From localStorage Version

| Area | Before | After |
|------|--------|-------|
| Auth | Fake users array in localStorage | Laravel Sanctum tokens |
| Services | Hard-coded static array | MySQL via Laravel API |
| Bookings | localStorage JSON | Real DB with status workflow |
| Reviews | Static fake data | DB with booking-gated access |
| File uploads | Base64 FileReader | multipart/form-data → storage/public |
| Phone exposure | Immediately visible | Only after payment (server-side) |
| Role assignment | Frontend enum (tamper-able) | Server-side, validated, never from client |
| Admin panel | Non-existent | Full CRUD /admin routes + UI |

---

## Security Improvements

### Phone number protection
- `ServiceController::show()` never includes `provider_phone` in the response
- Only `BookingController::updateStatus()` returns phone numbers when `payment_status === 'paid'`
- Frontend `ProfilePage` never shows a phone number

### Role protection
- `RoleMiddleware` gates all provider/admin routes
- `RegisterController` forces role to `client|provider` — admin role can never be self-assigned
- All booking operations check ownership via `BookingPolicy`

### File upload security
- `RegisterRequest` validates `avatar`: image, max 2MB
- `ServiceRequest` validates gallery/cert files individually
- All uploads go to `storage/app/public/` — never web-accessible by path guessing

---

## Admin Credentials (after seed)

```
Email:    admin@jobmate.fr
Password: admin123
URL:      http://localhost:5173/admin
```

---

## Step-by-Step Applied Changes

### Step 1 — Remove all localStorage fake persistence
Delete: `getInitialState()` helpers, `jobmate_v3_*` keys, inline `localStorage.setItem` in reducers.

### Step 2 — Add API layer
Copy the five files from `src/api/` into your project. They wrap Axios and expose typed functions.

### Step 3 — Replace slices
Swap the four slice files. They now use `createAsyncThunk` connected to the API layer.

### Step 4 — Update AuthModal
Replace the `FileReader` base64 logic with a plain `File` reference → `FormData` on submit.

### Step 5 — Update BrowsePage
Remove the client-side `.filter()` loop. All filtering now happens on the server via query params.

### Step 6 — Update App.jsx
Add `ProtectedRoute` and `AdminRoute` guards. Add `/admin/*` nested routes.

### Step 7 — Add ServiceFormModal
Drop-in replacement for the inline service creation form. Handles gallery + certificates as `File[]`.

### Step 8 — Backend
Follow `BACKEND.md` for the complete Laravel implementation — all migrations, models, controllers, routes, middleware.

### Step 9 — Seed database
`php artisan migrate:fresh --seed` creates admin, one provider, one client, and a sample service.

### Step 10 — Test end-to-end
1. Register as client → browse → book a service
2. Login as provider → see pending booking → accept
3. Provider pays commission → `/checkout/:id` → status becomes `paid` → phone revealed
4. Login as `admin@jobmate.fr` → visit `/admin` → manage users, services, bookings
