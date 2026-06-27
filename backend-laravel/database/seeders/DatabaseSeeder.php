<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nom' => 'Admin',
            'prenom' => 'Cabinet',
            'email' => 'admin@cabinet.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'nom' => 'Zouiligue',
            'prenom' => 'Dr. Youssef',
            'email' => 'medecin@cabinet.test',
            'password' => Hash::make('password'),
            'role' => 'medecin',
            'specialite' => 'Médecine générale',
        ]);

        User::create([
            'nom' => 'Alami',
            'prenom' => 'Sara',
            'email' => 'patient@cabinet.test',
            'password' => Hash::make('password'),
            'role' => 'patient',
            'telephone' => '0600000000',
        ]);
    }
}
