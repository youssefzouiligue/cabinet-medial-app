<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->orderByDesc('id')->get());
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    // Activer / désactiver un compte, ou modifier son rôle
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'actif' => 'sometimes|boolean',
            'role' => 'sometimes|in:patient,medecin,admin',
            'specialite' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['actif', 'role', 'specialite']));

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
