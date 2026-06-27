<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Vérifie que l'utilisateur connecté possède l'un des rôles autorisés.
     * Utilisation dans les routes : ->middleware('role:medecin,admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Accès refusé : rôle insuffisant.',
            ], 403);
        }

        if (! $user->actif) {
            return response()->json([
                'message' => 'Votre compte a été désactivé par l\'administrateur.',
            ], 403);
        }

        return $next($request);
    }
}
