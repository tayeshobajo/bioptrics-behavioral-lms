<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Get admin role ID
        $adminRole = DB::table('roles')->where('slug', Role::ADMIN)->first();

        if (!$adminRole) {
            throw new \Exception('Admin role not found. Please run migrations first.');
        }

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@bioptrics.com',
            'password' => bcrypt('admin123!@#'), // Change this in production
            'role_id' => $adminRole->id,
            'is_active' => true,
        ]);

        // Create admin profile
        $admin->profile()->create([
            'job_title' => 'System Administrator',
            'department' => 'IT',
            'bio' => 'System Administrator for Bioptrics Platform',
        ]);
    }
}
