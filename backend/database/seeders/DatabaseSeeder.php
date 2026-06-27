<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Payment;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─────────────────────────────────────────────────────────────
        // 1. Create Exactly Three Users (One of each role)
        // ─────────────────────────────────────────────────────────────

        $admin = User::create([
            'nom'      => 'Admin',
            'prenom'   => 'Cabinet',
            'email'    => 'admin@cabinet.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'actif'    => true,
        ]);

        $medecin = User::create([
            'nom'        => 'Zouiligue',
            'prenom'     => 'Dr. Youssef',
            'email'      => 'medecin@cabinet.test',
            'password'   => Hash::make('password'),
            'role'       => 'medecin',
            'specialite' => 'Médecine générale',
            'actif'      => true,
        ]);

        $patient = User::create([
            'nom'       => 'Alami',
            'prenom'    => 'Sara',
            'email'     => 'patient@cabinet.test',
            'password'  => Hash::make('password'),
            'role'      => 'patient',
            'telephone' => '0600000000',
            'actif'     => true,
        ]);

        // ─────────────────────────────────────────────────────────────
        // 2. Create Schedules for the Doctor (Dr. Youssef Zouiligue)
        // ─────────────────────────────────────────────────────────────

        // Past schedules (for history)
        $sch1 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->subDays(2)->format('Y-m-d'),
            'heure_debut' => '09:00',
            'heure_fin'   => '09:30',
            'disponible'  => false,
        ]);

        $sch2 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->subDays(1)->format('Y-m-d'),
            'heure_debut' => '10:00',
            'heure_fin'   => '10:30',
            'disponible'  => false,
        ]);

        // Future schedules (reservable/confirmed)
        $sch3 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->addDays(1)->format('Y-m-d'),
            'heure_debut' => '14:00',
            'heure_fin'   => '14:30',
            'disponible'  => false, // Reserved & confirmed
        ]);

        $sch4 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->addDays(2)->format('Y-m-d'),
            'heure_debut' => '15:30',
            'heure_fin'   => '16:00',
            'disponible'  => false, // Reserved & pending payment
        ]);

        // Available future schedules (free to book)
        $sch5 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->addDays(3)->format('Y-m-d'),
            'heure_debut' => '09:00',
            'heure_fin'   => '09:30',
            'disponible'  => true,
        ]);

        $sch6 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->addDays(3)->format('Y-m-d'),
            'heure_debut' => '10:30',
            'heure_fin'   => '11:00',
            'disponible'  => true,
        ]);

        $sch7 = Schedule::create([
            'medecin_id'  => $medecin->id,
            'date'        => now()->addDays(4)->format('Y-m-d'),
            'heure_debut' => '16:00',
            'heure_fin'   => '16:30',
            'disponible'  => true,
        ]);

        // ─────────────────────────────────────────────────────────────
        // 3. Create Appointments for the Patient (Sara Alami)
        // ─────────────────────────────────────────────────────────────

        // 1. Past completed appointment
        $appCompleted = Appointment::create([
            'patient_id'        => $patient->id,
            'medecin_id'        => $medecin->id,
            'schedule_id'       => $sch1->id,
            'type_consultation' => 'presentiel',
            'statut'            => 'termine',
            'motif'             => 'Consultation annuelle',
            'lien_video'        => null,
        ]);

        Payment::create([
            'appointment_id'        => $appCompleted->id,
            'montant'               => 300.00,
            'statut'                => 'reussi',
            'methode'               => 'carte_test',
            'reference_transaction' => 'TXN-' . strtoupper(Str::random(12)),
        ]);

        // 2. Confirmed future appointment (paid, type video)
        $appConfirmed = Appointment::create([
            'patient_id'        => $patient->id,
            'medecin_id'        => $medecin->id,
            'schedule_id'       => $sch3->id,
            'type_consultation' => 'video',
            'statut'            => 'confirme',
            'motif'             => 'Suivi traitement',
            'lien_video'        => 'salle-' . Str::random(10),
        ]);

        Payment::create([
            'appointment_id'        => $appConfirmed->id,
            'montant'               => 300.00,
            'statut'                => 'reussi',
            'methode'               => 'carte_test',
            'reference_transaction' => 'TXN-' . strtoupper(Str::random(12)),
        ]);

        // 3. Pending payment future appointment
        $appPending = Appointment::create([
            'patient_id'        => $patient->id,
            'medecin_id'        => $medecin->id,
            'schedule_id'       => $sch4->id,
            'type_consultation' => 'presentiel',
            'statut'            => 'en_attente_paiement',
            'motif'             => 'Renouvellement ordonnance',
            'lien_video'        => null,
        ]);

        // 4. Canceled past appointment (payment failed)
        $appCanceled = Appointment::create([
            'patient_id'        => $patient->id,
            'medecin_id'        => $medecin->id,
            'schedule_id'       => $sch2->id,
            'type_consultation' => 'video',
            'statut'            => 'annule',
            'motif'             => 'Maux de gorge',
            'lien_video'        => null,
        ]);

        Payment::create([
            'appointment_id'        => $appCanceled->id,
            'montant'               => 300.00,
            'statut'                => 'echoue',
            'methode'               => 'carte_test',
            'reference_transaction' => 'TXN-FAIL-' . strtoupper(Str::random(8)),
        ]);

        // Free schedule slot from canceled appointment
        $sch2->update(['disponible' => true]);

        $this->command->info('✅ Base de données initialisée avec succès :');
        $this->command->table(
            ['Entité', 'Nombre'],
            [
                ['Administrateurs', 1],
                ['Médecins',        1],
                ['Patients',        1],
                ['Créneaux totaux', 7],
                ['Rendez-vous',    4],
                ['Paiements',       3],
            ]
        );
    }
}
