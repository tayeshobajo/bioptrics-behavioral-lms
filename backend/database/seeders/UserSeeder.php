<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\UserProfile;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $adminRole = Role::where('slug', 'admin')->first();
        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@teamsynerg.com',
            'password' => bcrypt('password123'),
            'role_id' => $adminRole->id,
        ]);
        UserProfile::create([
            'user_id' => $admin->id,
            'phone' => '+1234567890',
            'company' => 'TeamSynerG',
            'position' => 'System Administrator',
        ]);

        // Create group leader user
        $groupLeaderRole = Role::where('slug', 'group-leader')->first();
        $groupLeader = User::create([
            'name' => 'Group Leader',
            'username' => 'leader',
            'email' => 'leader@teamsynerg.com',
            'password' => bcrypt('password123'),
            'role_id' => $groupLeaderRole->id,
        ]);
        UserProfile::create([
            'user_id' => $groupLeader->id,
            'phone' => '+1234567891',
            'company' => 'TeamSynerG',
            'position' => 'Team Leader',
        ]);

        // Create customer user
        $customerRole = Role::where('slug', 'customer')->first();
        $customer = User::create([
            'name' => 'Customer User',
            'username' => 'customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('password123'),
            'role_id' => $customerRole->id,
        ]);
        UserProfile::create([
            'user_id' => $customer->id,
            'phone' => '+1234567892',
            'company' => 'Example Corp',
            'position' => 'Employee',
        ]);
    }
}
