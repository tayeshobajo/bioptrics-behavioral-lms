<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle role-based access control.
     * Usage: 
     * - Single role: role:admin
     * - Multiple roles: role:admin,group-leader
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $allowedRoles = explode(',', $roles);
        $userRole = $request->user()->role->slug;

        // Always allow admin access
        if ($userRole === Role::ADMIN) {
            return $next($request);
        }

        if (!in_array($userRole, $allowedRoles)) {
            return response()->json([
                'message' => 'Access denied. Insufficient permissions.'
            ], 403);
        }

        return $next($request);
    }
}
