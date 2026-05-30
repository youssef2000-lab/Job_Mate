<?php
// Backend/app/Providers/AppServiceProvider.php
// ✅ FIX 7: Policies were never registered. Without explicit registration,
//   $this->authorize() in controllers could throw or be inconsistent.
//   Registering them explicitly is the safe approach for Laravel 12.

namespace App\Providers;

use App\Models\Booking;
use App\Models\Service;
use App\Policies\BookingPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // ✅ FIX 7: policy map — ensures authorize() always finds the right policy
    protected $policies = [
        Service::class => ServicePolicy::class,
        Booking::class => BookingPolicy::class,
    ];

    public function register(): void {}

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
