<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'role',
        'specialite',
        'actif',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'actif' => 'boolean',
        ];
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function isMedecin(): bool
    {
        return $this->role === 'medecin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Créneaux créés par ce médecin
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'medecin_id');
    }

    // Rendez-vous en tant que patient
    public function rendezVousPatient()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    // Rendez-vous en tant que médecin
    public function rendezVousMedecin()
    {
        return $this->hasMany(Appointment::class, 'medecin_id');
    }
}
