<?php

// Backend/database/factories/ReviewFactory.php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    private static array $COMMENTS = [
        5 => [
            'Travail absolument exceptionnel ! Je recommande vivement ce prestataire.',
            'Professionnel, ponctuel et très soigné dans son travail. Parfait !',
            'Excellent service, je n\'hésiterai pas à faire appel à lui de nouveau.',
            'Résultat au-delà de mes attentes. Très satisfait !',
            'Prestataire de confiance, sérieux et compétent. 5 étoiles méritées.',
        ],
        4 => [
            'Très bon travail dans l\'ensemble, quelques petits ajustements nécessaires.',
            'Professionnel et efficace. Bonne communication tout au long du projet.',
            'Globalement satisfait, le résultat est propre et bien réalisé.',
            'Bon rapport qualité-prix. Je recommande.',
        ],
        3 => [
            'Travail correct, les délais ont été respectés.',
            'Service dans la moyenne, quelques points à améliorer.',
            'Prestation honorable sans être exceptionnelle.',
        ],
        2 => [
            'Quelques maladresses mais le problème a été résolu au final.',
            'Communication difficile par moments, résultat moyen.',
        ],
        1 => [
            'Déçu par la prestation, ne correspond pas aux attentes.',
            'Problèmes de communication et résultat insatisfaisant.',
        ],
    ];

    public function definition(): array
    {
        $rating = fake()->numberBetween(1, 5);

        // Weight towards higher ratings (more realistic)
        $weights = [1 => 3, 2 => 7, 3 => 15, 4 => 30, 5 => 45];
        $rand    = fake()->numberBetween(1, 100);
        $cumul   = 0;
        foreach ($weights as $r => $w) {
            $cumul += $w;
            if ($rand <= $cumul) { $rating = $r; break; }
        }

        return [
            'booking_id'  => Booking::factory()->completed(),
            'provider_id' => User::factory()->provider(),
            'client_id'   => User::factory()->client(),
            'rating'      => $rating,
            'comment'     => fake()->optional(0.85)
                ->randomElement(self::$COMMENTS[$rating]),
        ];
    }
}