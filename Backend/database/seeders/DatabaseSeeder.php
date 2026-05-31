<?php

// Backend/database/seeders/DatabaseSeeder.php
// ─────────────────────────────────────────────────────────────
// Generates realistic demo data for the JobMate platform.
// After running: php artisan migrate:fresh --seed
//
// Accounts you can log in with immediately:
//   admin@jobmate.fr  / admin123
//   marc@example.com  / password   (provider, verified)
//   client@example.com / password  (client)
// ─────────────────────────────────────────────────────────────

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceMedia;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    // Unsplash direct image URLs per category (no API key needed)
    private array $images = [
        'Plomberie'   => [
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        ],
        'Électricité' => [
            'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800',
            'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
            'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800',
        ],
        'Bricolage'   => [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
            'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800',
        ],
        'Design'      => [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        ],
        'Menuiserie'  => [
            'https://images.unsplash.com/photo-1564540574859-0dfb63985953?w=800',
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800',
            'https://images.unsplash.com/photo-1609242783626-bc2a3ce2b1a5?w=800',
        ],
        'Nettoyage'   => [
            'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800',
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
            'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        ],
    ];

    // Avatar URLs (real face photos from Unsplash, gender-neutral safe)
    private array $avatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200',
    ];

    public function run(): void
    {
        // ── Fixed demo accounts ────────────────────────────────
        $admin = User::create([
            'name'        => 'Admin JobMate',
            'email'       => 'admin@jobmate.fr',
            'password'    => Hash::make('admin123'),
            'role'        => 'admin',
            'is_verified' => true,
        ]);

        $marc = User::create([
            'name'        => 'Marc Lavalle',
            'email'       => 'marc@example.com',
            'password'    => Hash::make('password'),
            'phone'       => '06 12 34 56 78',
            'role'        => 'provider',
            'is_verified' => true,
        ]);

        $client = User::create([
            'name'     => 'Sophie Durand',
            'email'    => 'client@example.com',
            'password' => Hash::make('password'),
            'phone'    => '06 98 76 54 32',
            'role'     => 'client',
        ]);

        // ── Demo providers (20) ────────────────────────────────
        $providerData = [
            ['name' => 'Thomas Girard',   'email' => 'thomas.g@example.com',  'phone' => '07 45 89 12 33', 'category' => 'Électricité', 'city' => 'Bordeaux'],
            ['name' => 'Sophie Bernard',  'email' => 'sophie.b@example.com',  'phone' => '06 98 76 54 32', 'category' => 'Design',      'city' => 'Lyon'],
            ['name' => 'Pierre Morel',    'email' => 'pierre.m@example.com',  'phone' => '07 12 34 56 78', 'category' => 'Plomberie',   'city' => 'Paris'],
            ['name' => 'Amélie Dupont',   'email' => 'amelie.d@example.com',  'phone' => '06 23 45 67 89', 'category' => 'Nettoyage',   'city' => 'Marseille'],
            ['name' => 'Jean Martin',     'email' => 'jean.m@example.com',    'phone' => '07 34 56 78 90', 'category' => 'Menuiserie',  'city' => 'Toulouse'],
            ['name' => 'Marie Leclerc',   'email' => 'marie.l@example.com',   'phone' => '06 45 67 89 01', 'category' => 'Bricolage',   'city' => 'Nantes'],
            ['name' => 'Paul Renard',     'email' => 'paul.r@example.com',    'phone' => '07 56 78 90 12', 'category' => 'Plomberie',   'city' => 'Lille'],
            ['name' => 'Claire Simon',    'email' => 'claire.s@example.com',  'phone' => '06 67 89 01 23', 'category' => 'Design',      'city' => 'Strasbourg'],
            ['name' => 'Antoine Leroy',   'email' => 'antoine.l@example.com', 'phone' => '07 78 90 12 34', 'category' => 'Électricité', 'city' => 'Nice'],
            ['name' => 'Nathalie Petit',  'email' => 'nathalie.p@example.com','phone' => '06 89 01 23 45', 'category' => 'Menuiserie',  'city' => 'Montpellier'],
            ['name' => 'Luc Fontaine',    'email' => 'luc.f@example.com',     'phone' => '07 90 12 34 56', 'category' => 'Bricolage',   'city' => 'Paris'],
            ['name' => 'Isabelle Garnier','email' => 'isabelle.g@example.com','phone' => '06 01 23 45 67', 'category' => 'Nettoyage',   'city' => 'Lyon'],
            ['name' => 'François Bonnet', 'email' => 'francois.b@example.com','phone' => '07 12 34 56 79', 'category' => 'Plomberie',   'city' => 'Marseille'],
            ['name' => 'Émilie Marchand', 'email' => 'emilie.m@example.com',  'phone' => '06 23 45 67 80', 'category' => 'Design',      'city' => 'Bordeaux'],
            ['name' => 'Christophe Blanc','email' => 'christophe.b@example.com','phone' => '07 34 56 78 91', 'category' => 'Électricité','city' => 'Toulouse'],
            ['name' => 'Laure Rousseau',  'email' => 'laure.r@example.com',   'phone' => '06 45 67 89 02', 'category' => 'Bricolage',   'city' => 'Nantes'],
            ['name' => 'Maxime Perrin',   'email' => 'maxime.p@example.com',  'phone' => '07 56 78 90 13', 'category' => 'Menuiserie',  'city' => 'Lille'],
            ['name' => 'Julie Moreau',    'email' => 'julie.m@example.com',   'phone' => '06 67 89 01 24', 'category' => 'Nettoyage',   'city' => 'Strasbourg'],
            ['name' => 'Nicolas Richard', 'email' => 'nicolas.r@example.com', 'phone' => '07 78 90 12 35', 'category' => 'Plomberie',   'city' => 'Nice'],
            ['name' => 'Camille David',   'email' => 'camille.d@example.com', 'phone' => '06 89 01 23 46', 'category' => 'Design',      'city' => 'Montpellier'],
        ];

        $providers = collect();
        foreach ($providerData as $i => $pd) {
            $providers->push(User::create([
                'name'        => $pd['name'],
                'email'       => $pd['email'],
                'password'    => Hash::make('password'),
                'phone'       => $pd['phone'],
                'role'        => 'provider',
                'is_verified' => $i % 3 !== 2, // ~66% verified
            ]));
        }

        // Add marc to providers collection
        $providers->prepend($marc);

        // ── Demo clients (30) ──────────────────────────────────
        $clients = collect([$client]);
        $clientNames = [
            'Lucas Bernard', 'Emma Martin', 'Hugo Dupont', 'Chloé Leroy',
            'Mathis Simon', 'Inès Moreau', 'Nathan Girard', 'Léa Petit',
            'Théo Lambert', 'Manon Durand', 'Romain Leclerc', 'Jade Fontaine',
            'Enzo Garnier', 'Alice Rousseau', 'Evan Richard', 'Zoé Bonnet',
            'Clément Perrin', 'Sarah Blanc', 'Tom Marchand', 'Emma Renard',
            'Alexandre Morel', 'Clara Simon', 'Maxime Laurent', 'Laura Thomas',
            'Baptiste Dubois', 'Julie Lefebvre', 'Kevin Roux', 'Pauline Faure',
            'Quentin Morin', 'Anaïs Chevalier',
        ];
        foreach ($clientNames as $i => $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . ($i + 1) . '@example.com';
            $clients->push(User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make('password'),
                'phone'    => '06 ' . str_pad(random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT),
                'role'     => 'client',
            ]));
        }

        // ── Services (35) ─────────────────────────────────────
        $serviceTemplates = [
            // Plomberie
            ['provider_idx' => 2, 'title' => 'Expert fuite & rénovation sanitaire',         'category' => 'Plomberie',   'price' => 55,  'city' => 'Paris',      'country' => 'France', 'desc' => 'Plombier certifié avec 12 ans d\'expérience. Détection de fuites, rénovation salle de bain, installation robinetterie. Devis gratuit sous 24h.'],
            ['provider_idx' => 7, 'title' => 'Plombier certifié – dépannage 24h',            'category' => 'Plomberie',   'price' => 60,  'city' => 'Lille',      'country' => 'France', 'desc' => 'Disponible 7j/7 pour urgences plomberie. Fuite, bouchon, chauffe-eau, installation complète. Tarif transparent.'],
            ['provider_idx' => 13,'title' => 'Plomberie générale & installation chaudière',  'category' => 'Plomberie',   'price' => 65,  'city' => 'Marseille',  'country' => 'France', 'desc' => 'Installation et maintenance chaudières gaz, pompe à chaleur. Certifié RGE. Éligible aux aides gouvernementales.'],
            ['provider_idx' => 19,'title' => 'Plombier sanitaire & salle de bain',           'category' => 'Plomberie',   'price' => 50,  'city' => 'Nice',       'country' => 'France', 'desc' => 'Rénovation complète salles de bain, pose de baignoire, douche italienne, WC. 15 ans d\'expérience.'],

            // Électricité
            ['provider_idx' => 1, 'title' => 'Électricien qualifié IRVE & domotique',       'category' => 'Électricité', 'price' => 55,  'city' => 'Bordeaux',   'country' => 'France', 'desc' => 'Expert en solutions électriques modernes. Installation bornes de recharge, mise en conformité, domotique. Certifié IRVE.'],
            ['provider_idx' => 9, 'title' => 'Installation tableau & mise en conformité',   'category' => 'Électricité', 'price' => 60,  'city' => 'Nice',       'country' => 'France', 'desc' => 'Mise en conformité électrique, remplacement tableau, installation circuits. Rapport Consuel inclus.'],
            ['provider_idx' => 15,'title' => 'Électricien RGE – économies d\'énergie',       'category' => 'Électricité', 'price' => 70,  'city' => 'Toulouse',   'country' => 'France', 'desc' => 'Qualification RGE. Isolation, pompe à chaleur, panneaux solaires. Aide MaPrimeRénov possible.'],

            // Design
            ['provider_idx' => 3, 'title' => 'Design d\'intérieur créatif & sur mesure',    'category' => 'Design',      'price' => 75,  'city' => 'Lyon',       'country' => 'France', 'desc' => 'Architecte d\'intérieur diplômée. Conception d\'espaces sur mesure, plans 3D, suivi de chantier. Alliant esthétique et fonctionnalité.'],
            ['provider_idx' => 8, 'title' => 'Home staging & valorisation immobilière',      'category' => 'Design',      'price' => 80,  'city' => 'Strasbourg', 'country' => 'France', 'desc' => 'Spécialiste du home staging. Transformez votre bien avant vente pour maximiser sa valeur. Résultats prouvés.'],
            ['provider_idx' => 14,'title' => 'Architecte d\'intérieur & plans 3D',          'category' => 'Design',      'price' => 90,  'city' => 'Bordeaux',   'country' => 'France', 'desc' => 'Conception complète avec plans 3D photoréalistes. Cuisine, salon, chambre. Suivi de projet inclus.'],
            ['provider_idx' => 20,'title' => 'Conseil déco & aménagement d\'espace',        'category' => 'Design',      'price' => 65,  'city' => 'Montpellier','country' => 'France', 'desc' => 'Conseil en décoration intérieure et optimisation d\'espace. Sélection mobilier, matériaux, couleurs.'],

            // Bricolage
            ['provider_idx' => 0, 'title' => 'Expert rénovation & bricolage intérieur',     'category' => 'Bricolage',   'price' => 45,  'city' => 'Paris',      'country' => 'France', 'desc' => 'Spécialiste de la rénovation intérieure. Peinture, pose de parquet, carrelage, petits travaux. 15 ans d\'expérience.'],
            ['provider_idx' => 6, 'title' => 'Peinture, carrelage & parquet pro',           'category' => 'Bricolage',   'price' => 40,  'city' => 'Nantes',     'country' => 'France', 'desc' => 'Artisan qualifié pour pose de revêtements sol et mur. Peinture intérieure/extérieure. Résultat soigné garanti.'],
            ['provider_idx' => 11,'title' => 'Multi-services bricolage & réparations',      'category' => 'Bricolage',   'price' => 35,  'city' => 'Paris',      'country' => 'France', 'desc' => 'Montage meubles, fixations, plâtrerie, pose d\'étagères. Tous petits travaux pris en charge rapidement.'],
            ['provider_idx' => 16,'title' => 'Artisan rénovation toutes surfaces',          'category' => 'Bricolage',   'price' => 50,  'city' => 'Lille',      'country' => 'France', 'desc' => 'Rénovation complète : peinture, enduits, sols, plafonds. Devis gratuit, travail soigné, délais respectés.'],

            // Menuiserie
            ['provider_idx' => 5, 'title' => 'Menuisier ébéniste – meubles sur mesure',    'category' => 'Menuiserie',  'price' => 65,  'city' => 'Toulouse',   'country' => 'France', 'desc' => 'Menuisier ébéniste avec 20 ans d\'expérience. Fabrication de mobilier sur mesure en bois massif. Cuisine, dressing, bibliothèque.'],
            ['provider_idx' => 10,'title' => 'Pose fenêtres, portes & parquet',             'category' => 'Menuiserie',  'price' => 55,  'city' => 'Montpellier','country' => 'France', 'desc' => 'Spécialiste de la pose de menuiseries. Fenêtres PVC, aluminium, bois. Porte d\'entrée, portail, parquet.'],
            ['provider_idx' => 17,'title' => 'Fabrication mobilier bois & agencement',     'category' => 'Menuiserie',  'price' => 70,  'city' => 'Lille',      'country' => 'France', 'desc' => 'Création sur mesure : armoires, dressings, meubles TV. Bois massif, contreplaqué, MDF. Finition artisanale.'],

            // Nettoyage
            ['provider_idx' => 4, 'title' => 'Service ménage & nettoyage professionnel',   'category' => 'Nettoyage',   'price' => 25,  'city' => 'Marseille',  'country' => 'France', 'desc' => 'Service de ménage professionnel. Nettoyage complet appartement, maison, bureaux. Produits écologiques.'],
            ['provider_idx' => 12,'title' => 'Nettoyage fin de chantier & locaux',         'category' => 'Nettoyage',   'price' => 30,  'city' => 'Lyon',       'country' => 'France', 'desc' => 'Spécialiste nettoyage après travaux. Résultat impeccable. Locaux commerciaux, appartements, copropriétés.'],
            ['provider_idx' => 18,'title' => 'Entretien ménager régulier à domicile',      'category' => 'Nettoyage',   'price' => 22,  'city' => 'Strasbourg', 'country' => 'France', 'desc' => 'Femme de ménage expérimentée. Ménage régulier ou ponctuel. Références disponibles. Produits fournis.'],
        ];

        $services = collect();
        foreach ($serviceTemplates as $t) {
            $provider = $providers[$t['provider_idx']];
            $category = $t['category'];

            $service = Service::create([
                'provider_id' => $provider->id,
                'title'       => $t['title'],
                'category'    => $category,
                'description' => $t['desc'],
                'price'       => $t['price'],
                'city'        => $t['city'],
                'country'     => $t['country'],
                'status'      => 'active',
            ]);

            // Attach gallery images (use URL as path — frontend will use it directly)
            $imgs = $this->images[$category] ?? $this->images['Bricolage'];
            foreach (array_slice($imgs, 0, 2) as $imgUrl) {
                ServiceMedia::create([
                    'service_id' => $service->id,
                    'path'       => $imgUrl,
                    'type'       => 'gallery',
                ]);
            }

            $services->push($service);
        }

        // ── Bookings (50) ──────────────────────────────────────
        $statuses      = ['pending', 'accepted', 'declined', 'completed', 'completed', 'completed'];
        $clientsArray  = $clients->toArray();
        $bookings      = collect();

        for ($i = 0; $i < 50; $i++) {
            $service = $services->random();
            $client2 = $clients->random();

            // Skip if same person
            if ($client2->id === $service->provider_id) continue;

            $status  = $statuses[array_rand($statuses)];
            $payment = match ($status) {
                'completed' => 'paid',
                'accepted'  => (random_int(0,1) ? 'paid' : 'unpaid'),
                default     => 'unpaid',
            };

            $bookings->push(Booking::create([
                'service_id'     => $service->id,
                'client_id'      => $client2->id,
                'provider_id'    => $service->provider_id,
                'client_message' => random_int(0, 1) ? fake()->sentence(8) : null,
                'amount'         => $service->price * random_int(1, 3),
                'status'         => $status,
                'payment_status' => $payment,
            ]));
        }

        // ── Reviews (80) — only on completed bookings ──────────
        $completedBookings = $bookings->where('status', 'completed');
        $comments = [
            5 => ['Travail exceptionnel, je recommande vivement !', 'Ponctuel, professionnel et soigné. Parfait.', 'Résultat au-delà de mes attentes. 5 étoiles méritées.', 'Excellent service, je referai appel à lui sans hésiter.'],
            4 => ['Très bon travail, quelques petits ajustements.', 'Professionnel et efficace. Bonne communication.', 'Globalement satisfait, bonne qualité de travail.'],
            3 => ['Travail correct, délais respectés.', 'Service dans la moyenne, sans plus.'],
            2 => ['Quelques maladresses mais résultat acceptable.'],
            1 => ['Déçu par la prestation, ne correspond pas aux attentes.'],
        ];
        $weights = [5 => 45, 4 => 30, 3 => 15, 2 => 7, 1 => 3];

        foreach ($completedBookings->take(80) as $booking) {
            // Weighted random rating
            $rand = random_int(1, 100);
            $cumul = 0; $rating = 5;
            foreach ($weights as $r => $w) { $cumul += $w; if ($rand <= $cumul) { $rating = $r; break; } }

            Review::create([
                'booking_id'  => $booking->id,
                'provider_id' => $booking->provider_id,
                'client_id'   => $booking->client_id,
                'rating'      => $rating,
                'comment'     => $comments[$rating][array_rand($comments[$rating])],
            ]);
        }

        $this->command->info('✅ Seeded: 1 admin, 21 providers, 31 clients, ' . $services->count() . ' services, ' . $bookings->count() . ' bookings, 80 reviews');
        $this->command->info('📧 admin@jobmate.fr / admin123');
        $this->command->info('📧 marc@example.com / password');
        $this->command->info('📧 client@example.com / password');
    }
}
