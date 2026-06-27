<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'medecin_id',
        'date',
        'heure_debut',
        'heure_fin',
        'disponible',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'disponible' => 'boolean',
        ];
    }

    public function medecin()
    {
        return $this->belongsTo(User::class, 'medecin_id');
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class, 'schedule_id');
    }
}
