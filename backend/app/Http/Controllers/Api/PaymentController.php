<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Simule un paiement par carte bancaire en mode test.
     * Aucune vraie transaction n'est effectuée : c'est une simulation pédagogique,
     * conforme au cahier des charges ("paiement en ligne en mode test").
     */
    public function payer(Request $request, Appointment $appointment)
    {
        if ($appointment->patient_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($appointment->statut !== 'en_attente_paiement') {
            return response()->json(['message' => 'Ce rendez-vous n\'attend pas de paiement.'], 409);
        }

        $validator = Validator::make($request->all(), [
            'numero_carte' => 'required|string|min:12|max:19',
            'nom_titulaire' => 'required|string|max:255',
            'date_expiration' => 'required|string|max:7',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mode test : toute carte correctement formée est acceptée,
        // sauf si elle se termine par "0000" (sert à démontrer un échec).
        $paiementReussi = ! str_ends_with($request->numero_carte, '0000');

        $payment = Payment::create([
            'appointment_id' => $appointment->id,
            'montant' => 300.00,
            'statut' => $paiementReussi ? 'reussi' : 'echoue',
            'methode' => 'carte_test',
            'reference_transaction' => 'TX-'.Str::upper(Str::random(10)),
        ]);

        if ($paiementReussi) {
            $appointment->update(['statut' => 'confirme']);
        }

        return response()->json([
            'message' => $paiementReussi
                ? 'Paiement accepté. Rendez-vous confirmé.'
                : 'Paiement refusé. Veuillez réessayer avec une autre carte.',
            'payment' => $payment,
            'rendez_vous' => $appointment->refresh(),
        ], $paiementReussi ? 200 : 402);
    }
}
