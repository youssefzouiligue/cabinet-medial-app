<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    // French first names
    private static array $prenomsMasculins = [
        'Mohamed', 'Youssef', 'Karim', 'Amine', 'Omar', 'Hassan', 'Rachid',
        'Nabil', 'Samir', 'Tariq', 'Adil', 'Bilal', 'Fouad', 'Jamal', 'Khalid',
    ];

    private static array $prenomsFeminins = [
        'Sara', 'Fatima', 'Nadia', 'Leila', 'Amina', 'Hanane', 'Zineb',
        'Souad', 'Khadija', 'Meryem', 'Houda', 'Sanaa', 'Imane', 'Najat', 'Rania',
    ];

    private static array $noms = [
        'Alami', 'Benali', 'Zouiligue', 'Cherkaoui', 'Idrissi', 'Mansouri',
        'Tazi', 'Berrada', 'Chraibi', 'Fassi', 'Hajji', 'Kettani', 'Lahlou',
        'Moussa', 'Naciri', 'Ouazzani', 'Qasimi', 'Rachidi', 'Squali', 'Tahiri',
    ];

    private static array $specialites = [
        'Médecine générale',
        'Cardiologie',
        'Dermatologie',
        'Pédiatrie',
        'Gynécologie-obstétrique',
        'Ophtalmologie',
        'ORL',
        'Orthopédie',
        'Neurologie',
        'Endocrinologie',
        'Rhumatologie',
        'Gastro-entérologie',
        'Pneumologie',
        'Urologie',
        'Psychiatrie',
    ];

    public function definition(): array
    {
        $isFemale = $this->faker->boolean(50);
        $prenom   = $isFemale
            ? $this->faker->randomElement(self::$prenomsFeminins)
            : $this->faker->randomElement(self::$prenomsMasculins);
        $nom = $this->faker->randomElement(self::$noms);

        return [
            'nom'               => $nom,
            'prenom'            => $prenom,
            'email'             => strtolower($prenom . '.' . $nom . $this->faker->unique()->randomNumber(4)) . '@example.ma',
            'telephone'         => '06' . $this->faker->numerify('########'),
            'email_verified_at' => now(),
            'password'          => static::$password ??= Hash::make('password'),
            'role'              => 'patient',
            'specialite'        => null,
            'actif'             => true,
            'remember_token'    => Str::random(10),
        ];
    }

    /** Crée un patient */
    public function patient(): static
    {
        return $this->state(fn () => ['role' => 'patient', 'specialite' => null]);
    }

    /** Crée un médecin avec spécialité */
    public function medecin(): static
    {
        return $this->state(fn () => [
            'role'       => 'medecin',
            'prenom'     => 'Dr. ' . $this->faker->randomElement(self::$prenomsMasculins),
            'specialite' => $this->faker->randomElement(self::$specialites),
        ]);
    }

    /** Crée un administrateur */
    public function admin(): static
    {
        return $this->state(fn () => ['role' => 'admin', 'specialite' => null]);
    }

    /** Désactive le compte */
    public function inactif(): static
    {
        return $this->state(fn () => ['actif' => false]);
    }
}
