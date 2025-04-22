<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'System administrator with full access',
            ],
            [
                'name' => 'Group Leader',
                'slug' => 'group-leader',
                'description' => 'Group leader with team management capabilities',
            ],
            [
                'name' => 'Customer',
                'slug' => 'customer',
                'description' => 'Regular customer account',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
