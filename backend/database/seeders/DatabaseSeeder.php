<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            LevelSeeder::class,
            LanguageSeeder::class,
            UserSeeder::class,
            CourseSeeder::class,
            ChapterLessonSeeder::class,
        ]);
    }
}