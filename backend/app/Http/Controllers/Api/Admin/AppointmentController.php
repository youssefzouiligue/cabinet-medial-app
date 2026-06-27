<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient:id,nom,prenom', 'medecin:id,nom,prenom', 'schedule', 'payment']);

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderByDesc('id')->get());
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->schedule()->update(['disponible' => true]);
        $appointment->delete();

        return response()->json(['message' => 'Rendez-vous supprimé.']);
    }
}
