<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    private static array $heures = [
        ['08:00', '08:30'],
        ['08:30', '09:00'],
        ['09:00', '09:30'],
        ['09:30', '10:00'],
        ['10:00', '10:30'],
        ['10:30', '11:00'],
        ['11:00', '11:30'],
        ['11:30', '12:00'],
        ['14:00', '14:30'],
        ['14:30', '15:00'],
        ['15:00', '15:30'],
        ['15:30', '16:00'],
        ['16:00', '16:30'],
        ['16:30', '17:00'],
        ['17:00', '17:30'],
        ['17:30', '18:00'],
    ];

    public function definition(): array
    {
        $slot = $this->faker->randomElement(self::$heures);

        return [
            'medecin_id'  => User::factory()->medecin(),
            'date'        => $this->faker->dateTimeBetween('now', '+60 days')->format('Y-m-d'),
            'heure_debut' => $slot[0],
            'heure_fin'   => $slot[1],
            'disponible'  => true,
        ];
    }

    /** Créneau déjà réservé (indisponible) */
    public function indisponible(): static
    {
        return $this->state(fn () => ['disponible' => false]);
    }

    /** Créneau passé */
    public function passe(): static
    {
        $slot = $this->faker->randomElement(self::$heures);
        return $this->state(fn () => [
            'date'        => $this->faker->dateTimeBetween('-60 days', '-1 day')->format('Y-m-d'),
            'heure_debut' => $slot[0],
            'heure_fin'   => $slot[1],
        ]);
    }
}
