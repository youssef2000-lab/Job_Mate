<?php

// Backend/database/factories/ServiceMediaFactory.php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceMediaFactory extends Factory
{
    // Curated Unsplash image IDs for each category
    // These are real public Unsplash photos that never expire
    private static array $IMAGES = [
        'Plomberie'   => ['gkiKjYgFZ8s', 'IVsjKZ8L6a4', 'HGFZx5V1F8Y', 'QnDE_4NtRxc'],
        'Électricité' => ['m3hn2Kn5Bns', 'RFAHj4tI37Y', '2_K82gx9Dk8', 'nreHs_fMEeQ'],
        'Bricolage'   => ['7okkFhxrxNw', 'npxXWgQ33ZQ', 'OB2F6CsMva8', 'E8Ufcyxz514'],
        'Design'      => ['IYfp2Ixe9nM', '1td5Iq5IvNc', 'Lh_bn9SgRSY', '_HqHX3LBN18'],
        'Menuiserie'  => ['xekxE_VR0Ec', 'tvc5imO5pXk', 'GsZLXA4JPcM', 'u9cG4cuJ6bU'],
        'Nettoyage'   => ['OgvqXGL7XO4', 'ib7jwp7m0iA', 'YVSA_k_CbM0', 'N_Y88TWmGwA'],
        'default'     => ['photo-1581578731548-c64695cc6952', 'photo-1558618666-fcd25c85cd64'],
    ];

    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'path'       => 'services/gallery/placeholder.jpg',
            'type'       => 'gallery',
        ];
    }

    /**
     * Create a media record with a real Unsplash URL stored as path.
     * Since we can't actually download images in seeder, we store the
     * Unsplash direct URL. The frontend will use these as src directly.
     */
    public static function imageUrl(string $category = 'default'): string
    {
        $ids = self::$IMAGES[$category] ?? self::$IMAGES['default'];
        $id  = fake()->randomElement($ids);

        // Unsplash source URLs are free and don't require API key
        return "https://source.unsplash.com/{$id}/800x600";
    }
}