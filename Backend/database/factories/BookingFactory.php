<?php

// Backend/database/factories/BookingFactory.php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $statuses = ['pending', 'accepted', 'declined', 'completed'];
        $status   = fake()->randomElement($statuses);

        $paymentStatus = match ($status) {
            'completed' => 'paid',
            'accepted'  => fake()->randomElement(['paid', 'unpaid']),
            default     => 'unpaid',
        };

        return [
            'service_id'     => Service::factory(),
            'client_id'      => User::factory()->client(),
            'provider_id'    => User::factory()->provider(),
            'client_message' => fake()->optional(0.7)->sentence(10),
            'amount'         => fake()->randomFloat(2, 50, 500),
            'status'         => $status,
            'payment_status' => $paymentStatus,
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending', 'payment_status' => 'unpaid']);
    }

    public function completed(): static
    {
        return $this->state(['status' => 'completed', 'payment_status' => 'paid']);
    }
}