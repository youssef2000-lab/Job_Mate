<?php

// Backend/database/factories/UserFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => fake()->name(),
            'email'       => fake()->unique()->safeEmail(),
            'password'    => Hash::make('password'),
            'phone'       => '06 ' . fake()->numerify('## ## ## ##'),
            'avatar'      => null,   // seeder attaches Unsplash URLs via avatar_url override
            'role'        => 'client',
        ];
    }

    public function admin(): static
    {
        return $this->state(['role' => 'admin']);
    }

    public function provider(): static
    {
        return $this->state(['role' => 'provider']);
    }

    public function client(): static
    {
        return $this->state(['role' => 'client']);
    }
}