<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('schedule_id')->constrained('schedules')->onDelete('cascade');
            $table->enum('type_consultation', ['presentiel', 'video'])->default('presentiel');
            $table->enum('statut', ['en_attente_paiement', 'confirme', 'annule', 'termine'])->default('en_attente_paiement');
            $table->text('motif')->nullable();
            $table->string('lien_video')->nullable(); // généré pour la simulation d'appel vidéo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
