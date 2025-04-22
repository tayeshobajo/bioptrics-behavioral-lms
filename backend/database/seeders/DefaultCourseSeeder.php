<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DefaultCourseSeeder extends Seeder
{
    public function run(): void
    {
        Course::create([
            'title' => 'Accountability in Action',
            'description' => 'Learn the fundamentals of accountability and how to apply them in your daily life and work.',
            'slug' => 'accountability-in-action',
            'thumbnail_url' => 'https://teamsynergprograms.com/wp-content/uploads/2024/06/accountability.jpg',
            'is_default' => true,
        ]);
    }
}
