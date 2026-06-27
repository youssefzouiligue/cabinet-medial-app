<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{
    // --- Côté patient ---

    // Le patient réserve un créneau (statut initial : en attente de paiement)
    public function reserver(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'schedule_id' => 'required|exists:schedules,id',
            'type_consultation' => 'required|in:presentiel,video',
            'motif' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $schedule = Schedule::lockForUpdate()->findOrFail($request->schedule_id);

            if (! $schedule->disponible) {
                return response()->json(['message' => 'Ce créneau n\'est plus disponible.'], 409);
            }

            $schedule->update(['disponible' => false]);

            $rendezVous = Appointment::create([
                'patient_id' => $request->user()->id,
                'medecin_id' => $schedule->medecin_id,
                'schedule_id' => $schedule->id,
                'type_consultation' => $request->type_consultation,
                'statut' => 'en_attente_paiement',
                'motif' => $request->motif,
                'lien_video' => $request->type_consultation === 'video'
                    ? 'salle-'.Str::random(10)
                    : null,
            ]);

            return response()->json([
                'message' => 'Créneau réservé. Confirmez le rendez-vous par paiement.',
                'rendez_vous' => $rendezVous->load(['schedule', 'medecin']),
            ], 201);
        });
    }

    // Liste des rendez-vous du patient connecté
    public function mesRendezVousPatient(Request $request)
    {
        $rendezVous = $request->user()->rendezVousPatient()
            ->with(['schedule', 'medecin:id,nom,prenom,specialite', 'payment'])
            ->orderByDesc('id')
            ->get();

        return response()->json($rendezVous);
    }

    // Annulation par le patient
    public function annulerParPatient(Request $request, Appointment $appointment)
    {
        if ($appointment->patient_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($appointment->statut === 'annule') {
            return response()->json(['message' => 'Ce rendez-vous est déjà annulé.'], 409);
        }

        $appointment->update(['statut' => 'annule']);
        $appointment->schedule()->update(['disponible' => true]);

        return response()->json(['message' => 'Rendez-vous annulé.']);
    }

    // --- Côté médecin ---

    // Liste des rendez-vous du médecin connecté
    public function mesRendezVousMedecin(Request $request)
    {
        $rendezVous = $request->user()->rendezVousMedecin()
            ->with(['schedule', 'patient:id,nom,prenom,telephone', 'payment'])
            ->orderByDesc('id')
            ->get();

        return response()->json($rendezVous);
    }

    // Le médecin modifie le statut (confirme manuellement / annule / termine)
    public function changerStatutParMedecin(Request $request, Appointment $appointment)
    {
        if ($appointment->medecin_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:confirme,annule,termine',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update(['statut' => $request->statut]);

        if ($request->statut === 'annule') {
            $appointment->schedule()->update(['disponible' => true]);
        }

        return response()->json($appointment);
    }
}
