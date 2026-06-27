<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schedule;
use App\Models\Appointment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->orderByDesc('id')->get());
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    // Activer / désactiver un compte, ou modifier son rôle
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'actif' => 'sometimes|boolean',
            'role' => 'sometimes|in:patient,medecin,admin',
            'specialite' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['actif', 'role', 'specialite']));

        return response()->json($user);
    }

    // Créer un utilisateur (Médecin ou autre) par l'administrateur
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'telephone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'role' => 'required|in:patient,medecin,admin',
            'specialite' => 'required_if:role,medecin|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'specialite' => $request->role === 'medecin' ? $request->specialite : null,
            'actif' => true,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user,
        ], 201);
    }

    public function destroy(User $user)
    {
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    // Générer des données de test via les usines (factories)
    public function seedFactories(Request $request)
    {
        // 5 médecins, 10 patients
        $newMedecins = User::factory()->medecin()->count(5)->create();
        $newPatients = User::factory()->patient()->count(10)->create();

        // Générer des créneaux horaires futurs pour les nouveaux médecins
        $heures = [
            ['08:00', '08:30'], ['09:00', '09:30'], ['10:00', '10:30'],
            ['11:00', '11:30'], ['14:00', '14:30'], ['15:00', '15:30'],
            ['16:00', '16:30'], ['17:00', '17:30']
        ];

        foreach ($newMedecins as $medecin) {
            for ($day = 1; $day <= 5; $day++) {
                $slot = $heures[array_rand($heures)];
                Schedule::create([
                    'medecin_id' => $medecin->id,
                    'date' => now()->addDays($day)->format('Y-m-d'),
                    'heure_debut' => $slot[0],
                    'heure_fin' => $slot[1],
                    'disponible' => true,
                ]);
            }
        }

        return response()->json([
            'message' => 'Données factices générées avec succès (5 médecins, 10 patients et des créneaux).',
        ]);
    }

    // Effacer toutes les données démo/utilisateurs
    public function clearDatabase(Request $request)
    {
        $currentAdminId = $request->user()->id;

        // Supprimer toutes les données associées
        Payment::truncate();
        Appointment::truncate();
        Schedule::truncate();

        // Supprimer tous les utilisateurs sauf l'admin connecté
        User::where('id', '!=', $currentAdminId)->delete();

        return response()->json([
            'message' => 'Toutes les données de démonstration et les utilisateurs ont été supprimés (sauf votre compte administrateur).',
        ]);
    }
}
