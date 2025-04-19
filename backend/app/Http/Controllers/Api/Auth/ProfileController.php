<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $user = Auth::user();
        return response()->json([
            'user' => new UserResource($user->load('profile'))
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'employee_id' => ['nullable', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            // Profile fields
            'job_title' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'array'],
            'learning_preferences' => ['nullable', 'array'],
        ]);

        // Update user
        $user->update(array_filter($validated, function ($key) {
            return in_array($key, ['name', 'username', 'email', 'employee_id']);
        }, ARRAY_FILTER_USE_KEY));

        // Update profile
        if ($user->profile) {
            $user->profile->update(array_filter($validated, function ($key) {
                return in_array($key, ['job_title', 'department', 'bio', 'skills', 'learning_preferences']);
            }, ARRAY_FILTER_USE_KEY));
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user->load('profile'))
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8']
        ]);

        $user = Auth::user();
        $user->update([
            'password' => bcrypt($validated['password'])
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
}
