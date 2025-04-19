<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->getCredentials(), $request->boolean('remember'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $device = $request->input('device_name', 'default_device');
        
        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Revoke previous tokens for this device if they exist
        $user->tokens()->where('name', $device)->delete();

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => new UserResource($user->load('profile')),
            'token' => $user->createToken($device)->plainTextToken,
        ]);
    }

    public function logout(): JsonResponse
    {
        $user = Auth::user();
        
        // Revoke the token that was used to authenticate the current request
        if ($user) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function refresh(): JsonResponse
    {
        $user = Auth::user();
        $device = $user->currentAccessToken()->name;

        // Revoke the current token
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Token refreshed successfully',
            'user' => new UserResource($user->load('profile')),
            'token' => $user->createToken($device)->plainTextToken,
        ]);
    }
}
