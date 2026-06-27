<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['appointment.patient:id,nom,prenom', 'appointment.medecin:id,nom,prenom']);

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderByDesc('id')->get());
    }
}
