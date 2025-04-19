<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [LoginController::class, 'login']);

// Registration (only admin and group leader can register new users)
Route::middleware(['auth:sanctum', 'role:admin,group-leader'])->post('/register', RegisterController::class);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/refresh', [LoginController::class, 'refresh']);
    
    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::patch('/', [ProfileController::class, 'update']);
        Route::patch('/password', [ProfileController::class, 'updatePassword']);
    });

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        Route::prefix('admin')->group(function () {
            // Future admin endpoints will go here
            // Examples:
            // - User management
            // - Role management
            // - System settings
        });
    });

    // Group Leader routes
    Route::middleware('role:group-leader')->group(function () {
        Route::prefix('leader')->group(function () {
            // Future group leader endpoints will go here
            // Examples:
            // - Team management
            // - Progress tracking
            // - Performance analytics
        });
    });

    // Customer routes
    Route::middleware('role:customer')->group(function () {
        Route::prefix('learning')->group(function () {
            // Future customer endpoints will go here
            // Examples:
            // - Course access
            // - Progress tracking
            // - Assessments
        });
    });
});
