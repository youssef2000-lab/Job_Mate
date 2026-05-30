<?php

// Backend/app/Policies/ServicePolicy.php
// ─────────────────────────────────────────────────────────────
// FIX 4: Added create() method.
//
// Original problem:
//   ServiceController::store() calls $this->authorize('create', Service::class)
//   The policy had no create() method → Laravel threw AuthorizationException:
//   "This action is unauthorized."
//   Every POST /api/services call returned HTTP 403.
//   Providers could never create a service.
//
// Fix: Add create() — returns true for providers and admins.
// ─────────────────────────────────────────────────────────────

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    /**
     * FIX 4: was missing — caused 403 on every service creation attempt.
     * The 'role:provider,admin' middleware already gates the route,
     * but authorize() still needs this method to exist.
     */
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
