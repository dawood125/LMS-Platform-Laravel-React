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
                'name' => 'Admin User',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Dawood Ahmed',
                'email' => 'dawood@test.com',
                'password' => Hash::make('password'),
                'role' => 'instructor',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@test.com',
                'password' => Hash::make('password'),
                'role' => 'instructor',
            ],
            [
                'name' => 'Alex Chen',
                'email' => 'alex@test.com',
                'password' => Hash::make('password'),
                'role' => 'instructor',
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria@test.com',
                'password' => Hash::make('password'),
                'role' => 'student',
            ],
            [
                'name' => 'James Wilson',
                'email' => 'james@test.com',
                'password' => Hash::make('password'),
                'role' => 'student',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}