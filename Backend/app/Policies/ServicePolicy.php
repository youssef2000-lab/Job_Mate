<?php
// Backend/app/Policies/ServicePolicy.php
// ✅ FIX 6: Added `create()` method — ServiceController::store() calls
//   $this->authorize('create', Service::class) which threw AuthorizationException
//   because this method was missing. Providers can now create services.

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    // ✅ FIX 6: was missing — caused AuthorizationException on every service create
    public function create(User $user): bool
    {
        return $user->isProvider() || $user->isAdmin();
    }

    public function update(User $user, Service $service): bool
    {
        return $user->id === $service->provider_id || $user->isAdmin();
    }

    public function delete(User $user, Service $service): bool
    {
        return $user->id === $service->provider_id || $user->isAdmin();
    }
}
