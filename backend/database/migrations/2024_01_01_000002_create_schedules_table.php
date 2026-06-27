<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medecin_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->boolean('disponible')->default(true); // false dès qu'un patient réserve le créneau
            $table->timestamps();

            $table->unique(['medecin_id', 'date', 'heure_debut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
