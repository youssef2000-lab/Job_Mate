<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

// ─── Public ───────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::get('services',         [ServiceController::class, 'index']);
Route::get('services/{service}', [ServiceController::class, 'show']);
Route::get('providers/{id}/reviews', [ReviewController::class, 'providerReviews']);

// ─── Authenticated ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    Route::post('upload/avatar', [UploadController::class, 'avatar']);

    // Services (providers only for write)
    Route::middleware('role:provider,admin')->group(function () {
        Route::post('services',           [ServiceController::class, 'store']);
        Route::put('services/{service}',  [ServiceController::class, 'update']);
        Route::delete('services/{service}', [ServiceController::class, 'destroy']);
    });

    // Bookings
    Route::get('bookings',                     [BookingController::class, 'index']);
    Route::middleware('role:client')->post('bookings', [BookingController::class, 'store']);
    Route::put('bookings/{booking}/status',    [BookingController::class, 'updateStatus']);

    // Reviews (clients only)
    Route::middleware('role:client')->post('reviews', [ReviewController::class, 'store']);
});

// ─── Admin ────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('dashboard',               [AdminController::class, 'dashboard']);
    Route::get('users',                   [AdminController::class, 'users']);
    Route::get('services',                [AdminController::class, 'services']);
    Route::get('bookings',                [AdminController::class, 'bookings']);
    Route::delete('users/{user}',         [AdminController::class, 'deleteUser']);
    Route::delete('services/{service}',   [AdminController::class, 'deleteService']);
    Route::put('services/{service}/status', [AdminController::class, 'updateServiceStatus']);
});