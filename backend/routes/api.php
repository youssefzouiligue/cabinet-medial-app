<?php

use App\Http\Controllers\Api\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedecinController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ScheduleController;
use Illuminate\Support\Facades\Route;

// --- Authentification (public) ---
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// --- Consultation publique des médecins et de leurs créneaux ---
Route::get('/medecins', [MedecinController::class, 'index']);
Route::get('/medecins/{medecin}/creneaux', [MedecinController::class, 'creneauxDisponibles']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // --- Espace Patient ---
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        Route::post('/rendez-vous', [AppointmentController::class, 'reserver']);
        Route::get('/rendez-vous', [AppointmentController::class, 'mesRendezVousPatient']);
        Route::put('/rendez-vous/{appointment}/annuler', [AppointmentController::class, 'annulerParPatient']);
        Route::post('/rendez-vous/{appointment}/paiement', [PaymentController::class, 'payer']);
    });

    // --- Espace Médecin ---
    Route::middleware('role:medecin')->prefix('medecin')->group(function () {
        Route::get('/creneaux', [ScheduleController::class, 'index']);
        Route::post('/creneaux', [ScheduleController::class, 'store']);
        Route::put('/creneaux/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/creneaux/{schedule}', [ScheduleController::class, 'destroy']);

        Route::get('/rendez-vous', [AppointmentController::class, 'mesRendezVousMedecin']);
        Route::put('/rendez-vous/{appointment}/statut', [AppointmentController::class, 'changerStatutParMedecin']);
        Route::put('/rendez-vous/{appointment}/lien-video', [AppointmentController::class, 'setLienVideo']);
    });

    // --- Espace Administrateur ---
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'getStats']);
        Route::get('/utilisateurs', [AdminUserController::class, 'index']);
        Route::post('/utilisateurs', [AdminUserController::class, 'store']);
        Route::get('/utilisateurs/{user}', [AdminUserController::class, 'show']);
        Route::put('/utilisateurs/{user}', [AdminUserController::class, 'update']);
        Route::delete('/utilisateurs/{user}', [AdminUserController::class, 'destroy']);

        Route::post('/seed-factories', [AdminUserController::class, 'seedFactories']);
        Route::post('/clear-database', [AdminUserController::class, 'clearDatabase']);

        Route::get('/rendez-vous', [AdminAppointmentController::class, 'index']);
        Route::delete('/rendez-vous/{appointment}', [AdminAppointmentController::class, 'destroy']);

        Route::get('/paiements', [AdminPaymentController::class, 'index']);
    });
});
