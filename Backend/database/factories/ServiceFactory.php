<?php

// Backend/database/factories/ServiceFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    private static array $SERVICES = [
        'Plomberie'    => [
            'titles' => [
                'Plombier certifié – intervention rapide',
                'Expert fuite et rénovation sanitaire',
                'Plomberie générale & dépannage 24h',
                'Installation chaudière et robinetterie',
            ],
            'descs' => [
                'Plombier certifié avec 10 ans d\'expérience. Dépannage rapide, installation et rénovation sanitaire. Devis gratuit.',
                'Spécialiste de la détection de fuites et de la rénovation de salles de bain. Intervention rapide en Île-de-France.',
                'Disponible 7j/7 pour tous travaux de plomberie. Intervention le jour même pour urgences.',
            ],
        ],
        'Électricité'  => [
            'titles' => [
                'Électricien qualifié IRVE & domotique',
                'Installation tableau électrique & borne',
                'Expert mise en conformité électrique',
                'Électricien certifié RGE',
            ],
            'descs' => [
                'Électricien certifié RGE. Installation de bornes de recharge, mise en conformité, domotique. Devis sous 24h.',
                'Spécialiste installation tableau électrique et dépannage courant faible/fort. Intervention rapide.',
                'Qualification RGE pour travaux d\'économie d\'énergie. Aide MaPrimeRénov disponible.',
            ],
        ],
        'Bricolage'    => [
            'titles' => [
                'Expert rénovation & travaux intérieurs',
                'Peinture, carrelage, parquet pro',
                'Multi-services bricolage & rénovation',
                'Artisan rénovation toutes surfaces',
            ],
            'descs' => [
                'Artisan expérimenté pour tous vos travaux de rénovation intérieure : peinture, pose de parquet, carrelage. Résultat garanti.',
                'Bricoleur professionnel pour réparations et petits travaux. Montage meubles, fixations, plâtrerie.',
                '15 ans d\'expérience en rénovation globale. Peinture, revêtements, cloisons. Tarifs compétitifs.',
            ],
        ],
        'Design'       => [
            'titles' => [
                'Architecte d\'intérieur diplômée DPLG',
                'Designer d\'espace & décoration',
                'Home staging professionnel',
                'Conseil déco & plans 3D',
            ],
            'descs' => [
                'Architecte d\'intérieur diplômée. Conception d\'espaces sur mesure, plans 3D, suivi de chantier. Esthétique et fonctionnel.',
                'Spécialiste du home staging et de la valorisation immobilière. Transformez votre bien avant vente.',
                'Conseil en décoration intérieure et aménagement d\'espace. Plans 3D inclus dans chaque prestation.',
            ],
        ],
        'Menuiserie'   => [
            'titles' => [
                'Menuisier ébéniste sur mesure',
                'Pose fenêtres, portes & parquet',
                'Fabrication meubles bois massif',
                'Menuiserie intérieure & extérieure',
            ],
            'descs' => [
                'Menuisier ébéniste avec 20 ans d\'expérience. Fabrication et pose de mobilier sur mesure en bois massif.',
                'Spécialiste de la pose de fenêtres, portes et parquet. Travail soigné, délais respectés.',
                'Création de meubles en bois massif sur mesure. Cuisine, dressing, bibliothèque. Finition artisanale.',
            ],
        ],
        'Nettoyage'    => [
            'titles' => [
                'Service ménage & nettoyage pro',
                'Nettoyage de fin de chantier',
                'Entretien locaux commerciaux',
                'Nettoyage vitres & façades',
            ],
            'descs' => [
                'Service de nettoyage professionnel pour particuliers et entreprises. Produits écologiques. Satisfaction garantie.',
                'Spécialiste du nettoyage après travaux et fin de chantier. Résultat impeccable garanti.',
                'Entretien régulier ou ponctuel de bureaux, commerces et appartements. Équipe sérieuse et fiable.',
            ],
        ],
    ];

    private static array $CITIES = [
        ['city' => 'Paris',     'country' => 'France'],
        ['city' => 'Lyon',      'country' => 'France'],
        ['city' => 'Marseille', 'country' => 'France'],
        ['city' => 'Bordeaux',  'country' => 'France'],
        ['city' => 'Nantes',    'country' => 'France'],
        ['city' => 'Toulouse',  'country' => 'France'],
        ['city' => 'Strasbourg','country' => 'France'],
        ['city' => 'Nice',      'country' => 'France'],
        ['city' => 'Montpellier','country' => 'France'],
        ['city' => 'Lille',     'country' => 'France'],
    ];

    public function definition(): array
    {
        $category = fake()->randomElement(array_keys(self::$SERVICES));
        $data     = self::$SERVICES[$category];
        $location = fake()->randomElement(self::$CITIES);

        return [
            'provider_id' => User::factory()->provider(),
            'title'       => fake()->randomElement($data['titles']),
            'category'    => $category,
            'description' => fake()->randomElement($data['descs']),
            'price'       => fake()->randomFloat(2, 25, 150),
            'city'        => $location['city'],
            'country'     => $location['country'],
            'video_url'   => null,
            'status'      => 'active',
        ];
    }
}