<?php

namespace Database\Factories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'appointment_id'        => Appointment::factory()->confirme(),
            'montant'               => $this->faker->randomElement([150.00, 200.00, 250.00, 300.00, 350.00, 400.00]),
            'statut'                => 'reussi',
            'methode'               => 'carte_test',
            'reference_transaction' => 'TXN-' . strtoupper(Str::random(12)),
        ];
    }

    /** Paiement réussi */
    public function reussi(): static
    {
        return $this->state(fn () => ['statut' => 'reussi']);
    }

    /** Paiement échoué */
    public function echoue(): static
    {
        return $this->state(fn () => [
            'statut'  => 'echoue',
            'reference_transaction' => 'TXN-FAIL-' . strtoupper(Str::random(8)),
        ]);
    }
}
