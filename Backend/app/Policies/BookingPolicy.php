<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return in_array($user->id, [$booking->client_id, $booking->provider_id])
            || $user->isAdmin();
    }

    public function updateStatus(User $user, Booking $booking): bool
    {
        // Only provider can accept/decline; client triggers payment
        return $user->id === $booking->provider_id || $user->isAdmin();
    }
}