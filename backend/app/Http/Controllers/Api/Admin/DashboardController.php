<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Total counts
        $totalPatients   = User::where('role', 'patient')->count();
        $totalMedecins   = User::where('role', 'medecin')->count();
        $totalUsers      = User::count();

        // Appointment stats
        $totalAppointments  = Appointment::count();
        $confirmedCount     = Appointment::where('statut', 'confirme')->count();
        $pendingCount       = Appointment::where('statut', 'en_attente')->count();
        $cancelledCount     = Appointment::where('statut', 'annule')->count();

        // Revenue
        $totalRevenue   = Payment::where('statut', 'paye')->sum('montant');
        $pendingRevenue = Payment::where('statut', 'en_attente')->sum('montant');

        // Monthly appointments (last 6 months)
        $monthlyAppointments = Appointment::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('YEAR(created_at) as year'),
            DB::raw('COUNT(*) as total')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('year', 'month')
        ->orderBy('year')
        ->orderBy('month')
        ->get();

        // Recent appointments (last 10)
        $recentAppointments = Appointment::with(['patient', 'medecin', 'schedule'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($appt) {
                return [
                    'id'              => $appt->id,
                    'patient'         => $appt->patient ? $appt->patient->prenom . ' ' . $appt->patient->nom : '—',
                    'medecin'         => $appt->medecin ? 'Dr. ' . $appt->medecin->prenom . ' ' . $appt->medecin->nom : '—',
                    'specialite'      => $appt->medecin?->specialite,
                    'date'            => $appt->schedule?->date,
                    'heure'           => $appt->schedule?->heure_debut,
                    'statut'          => $appt->statut,
                    'type'            => $appt->type_consultation,
                    'created_at'      => $appt->created_at->toDateTimeString(),
                ];
            });

        // Top doctors by appointment count
        $topMedecins = User::where('role', 'medecin')
            ->withCount('rendezVousMedecin')
            ->orderByDesc('rendez_vous_medecin_count')
            ->limit(5)
            ->get()
            ->map(fn($m) => [
                'nom'        => 'Dr. ' . $m->prenom . ' ' . $m->nom,
                'specialite' => $m->specialite,
                'count'      => $m->rendez_vous_medecin_count,
            ]);

        return response()->json([
            'total_users'            => $totalUsers,
            'total_patients'         => $totalPatients,
            'total_medecins'         => $totalMedecins,
            'total_appointments'     => $totalAppointments,
            'confirmed_appointments' => $confirmedCount,
            'pending_appointments'   => $pendingCount,
            'cancelled_appointments' => $cancelledCount,
            'total_revenue'          => $totalRevenue,
            'pending_revenue'        => $pendingRevenue,
            'monthly_appointments'   => $monthlyAppointments,
            'recent_appointments'    => $recentAppointments,
            'top_medecins'           => $topMedecins,
        ]);
    }
}
