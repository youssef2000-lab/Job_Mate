<?php

// Backend/app/Providers/AppServiceProvider.php
// ─────────────────────────────────────────────────────────────
// FIX 3: Policies were never registered.
//
// Original problem:
//   - AppServiceProvider extended bare Illuminate\Support\ServiceProvider
//   - No $policies map was defined
//   - registerPolicies() was never called
//
// Result: $this->authorize('create', Service::class) in ServiceController
// threw AuthorizationException. Providers could never create a service.
// $this->authorize('updateStatus', $booking) in BookingController
// also failed silently or threw, depending on Laravel's gate resolution.
//
// Fix: Extend AuthServiceProvider, define $policies map, call registerPolicies().
// ─────────────────────────────────────────────────────────────

namespace App\Providers;

use App\Models\Booking;
use App\Models\Service;
use App\Policies\BookingPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider;

class AppServiceProvider extends AuthServiceProvider
{
    /**
     * FIX 3: Explicit policy map — ensures authorize() always
     * finds the correct policy class regardless of auto-discovery.
     */
    protected $policies = [
        Service::class => ServicePolicy::class,
        Booking::class => BookingPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // FIX 3: registers the policies defined above
        $this->registerPolicies();
    }
}
