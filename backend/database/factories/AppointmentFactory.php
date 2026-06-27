<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    private static array $motifs = [
        'Consultation de routine',
        'Renouvellement d\'ordonnance',
        'Douleurs abdominales',
        'Maux de tête persistants',
        'Fatigue chronique',
        'Suivi traitement',
        'Bilan annuel de santé',
        'Toux persistante',
        'Douleurs articulaires',
        'Hypertension artérielle',
        'Contrôle post-opératoire',
        'Allergie saisonnière',
        'Insomnie et anxiété',
        'Douleurs lombaires',
        'Problèmes digestifs',
    ];

    public function definition(): array
    {
        $type = $this->faker->randomElement(['presentiel', 'video']);

        return [
            'patient_id'       => User::factory()->patient(),
            'medecin_id'       => User::factory()->medecin(),
            'schedule_id'      => Schedule::factory()->indisponible(),
            'type_consultation' => $type,
            'statut'           => 'en_attente_paiement',
            'motif'            => $this->faker->randomElement(self::$motifs),
            'lien_video'       => $type === 'video' ? 'salle-' . Str::random(10) : null,
        ];
    }

    /** Rendez-vous confirmé (paiement réussi) */
    public function confirme(): static
    {
        return $this->state(fn () => ['statut' => 'confirme']);
    }

    /** Rendez-vous terminé */
    public function termine(): static
    {
        return $this->state(fn () => ['statut' => 'termine']);
    }

    /** Rendez-vous annulé */
    public function annule(): static
    {
        return $this->state(fn () => ['statut' => 'annule']);
    }

    /** En attente de paiement */
    public function enAttentePaiement(): static
    {
        return $this->state(fn () => ['statut' => 'en_attente_paiement']);
    }
}
