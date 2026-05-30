<?php

// Backend/bootstrap/app.php
// ─────────────────────────────────────────────────────────────
// FIX 2: API routes were never loaded.
// The original withRouting() had no `api:` entry, so routes/api.php
// was silently ignored. Every request to /api/* returned HTTP 404.
// ─────────────────────────────────────────────────────────────

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',   // ← FIX 2: was missing entirely
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
