<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name'        => 'Admin JobMate',
            'email'       => 'admin@jobmate.fr',
            'password'    => Hash::make('admin123'),
            'role'        => 'admin',
            'is_verified' => true,
        ]);

        // Provider
        $provider = User::create([
            'name'        => 'Marc Lavalle',
            'email'       => 'marc@example.com',
            'password'    => Hash::make('password'),
            'phone'       => '06 12 34 56 78',
            'role'        => 'provider',
            'is_verified' => true,
        ]);

        // Client
        User::create([
            'name'     => 'Client Test',
            'email'    => 'client@example.com',
            'password' => Hash::make('password'),
            'role'     => 'client',
        ]);

        // Service
        Service::create([
            'provider_id' => $provider->id,
            'title'       => 'Expert Rénovation & Bricolage',
            'category'    => 'Bricolage',
            'description' => 'Spécialiste de la rénovation intérieure avec plus de 15 ans d\'expérience.',
            'price'       => 45.00,
            'city'        => 'Paris',
            'country'     => 'France',
            'status'      => 'active',
        ]);
    }
}