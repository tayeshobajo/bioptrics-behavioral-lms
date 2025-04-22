<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateUserInfo extends Command
{
    protected $signature = 'user:update-info';
    protected $description = 'Update specific user information';

    public function handle()
    {
        $this->info('Updating user information...');

        $user = User::where('email', 'customer@example.com')->first();

        if (!$user) {
            $this->error('User not found!');
            return 1;
        }

        $user->update([
            'first_name' => 'Tai',
            'last_name' => 'Shobajo',
            'email' => 'taye@teamsynergprograms.com',
            'username' => 'taye'
        ]);

        $this->info('User information updated successfully!');
        $this->table(
            ['Field', 'New Value'],
            [
                ['First Name', 'Tai'],
                ['Last Name', 'Shobajo'],
                ['Email', 'taye@teamsynergprograms.com'],
                ['Username', 'taye']
            ]
        );

        return 0;
    }
}
