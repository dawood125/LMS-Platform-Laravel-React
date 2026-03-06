<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Web Development',
            'Mobile Development',
            'Data Science',
            'Machine Learning',
            'UI/UX Design',
            'Cloud Computing',
            'Cyber Security',
            'DevOps',
            'Blockchain',
            'Digital Marketing',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'status' => 1,
            ]);
        }
    }
}