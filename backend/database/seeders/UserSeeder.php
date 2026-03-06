<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Dawood Ahmed',
                'email' => 'dawood@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Alex Chen',
                'email' => 'alex@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'James Wilson',
                'email' => 'james@test.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}