<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MedecinController extends Controller
{
    // Liste publique des médecins (pour que le patient choisisse)
    public function index()
    {
        $medecins = User::where('role', 'medecin')
            ->where('actif', true)
            ->select('id', 'nom', 'prenom', 'specialite')
            ->get();

        return response()->json($medecins);
    }

    // Créneaux disponibles d'un médecin donné (calendrier patient)
    public function creneauxDisponibles(Request $request, User $medecin)
    {
        if ($medecin->role !== 'medecin') {
            return response()->json(['message' => 'Utilisateur non médecin.'], 404);
        }

        $creneaux = $medecin->schedules()
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('heure_debut')
            ->get();

        return response()->json($creneaux);
    }
}
