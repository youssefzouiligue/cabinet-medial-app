<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    // Liste des créneaux du médecin connecté
    public function index(Request $request)
    {
        $creneaux = $request->user()->schedules()
            ->orderBy('date')
            ->orderBy('heure_debut')
            ->get();

        return response()->json($creneaux);
    }

    // Création d'un ou plusieurs créneaux (ex : 09:00 -> 12:00 par tranches de 30 min)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'duree_minutes' => 'nullable|integer|min:10|max:120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $duree = $request->duree_minutes ?? 30;
        $debut = \Carbon\Carbon::createFromFormat('H:i', $request->heure_debut);
        $fin = \Carbon\Carbon::createFromFormat('H:i', $request->heure_fin);

        $creneauxCrees = [];

        while ($debut->lt($fin)) {
            $finCreneau = $debut->copy()->addMinutes($duree);
            if ($finCreneau->gt($fin)) {
                break;
            }

            $creneauxCrees[] = $request->user()->schedules()->firstOrCreate([
                'date' => $request->date,
                'heure_debut' => $debut->format('H:i'),
            ], [
                'heure_fin' => $finCreneau->format('H:i'),
                'disponible' => true,
            ]);

            $debut->addMinutes($duree);
        }

        return response()->json([
            'message' => count($creneauxCrees).' créneau(x) créé(s).',
            'creneaux' => $creneauxCrees,
        ], 201);
    }

    public function update(Request $request, Schedule $schedule)
    {
        if ($schedule->medecin_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'heure_debut' => 'sometimes|date_format:H:i',
            'heure_fin' => 'sometimes|date_format:H:i',
            'disponible' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $schedule->update($request->only(['heure_debut', 'heure_fin', 'disponible']));

        return response()->json($schedule);
    }

    public function destroy(Request $request, Schedule $schedule)
    {
        if ($schedule->medecin_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if (! $schedule->disponible) {
            return response()->json(['message' => 'Impossible de supprimer un créneau déjà réservé.'], 409);
        }

        $schedule->delete();

        return response()->json(['message' => 'Créneau supprimé.']);
    }
}
