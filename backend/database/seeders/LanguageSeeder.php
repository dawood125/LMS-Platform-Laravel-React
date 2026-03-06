<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = ['English', 'Spanish', 'French', 'German', 'Arabic'];

        foreach ($languages as $language) {
            Language::create([
                'name' => $language,
                'status' => 1,
            ]);
        }
    }
}