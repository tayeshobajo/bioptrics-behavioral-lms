<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\User;
use App\Models\CourseEnrollment;
use Illuminate\Console\Command;

class EnrollExistingUsers extends Command
{
    protected $signature = 'users:enroll-existing';
    protected $description = 'Enroll all existing users in default courses';

    public function handle()
    {
        $defaultCourses = Course::where('is_default', true)->get();
        $users = User::all();
        $enrollmentCount = 0;

        $this->info('Starting enrollment process...');
        $bar = $this->output->createProgressBar(count($users));

        foreach ($users as $user) {
            foreach ($defaultCourses as $course) {
                $exists = CourseEnrollment::where('user_id', $user->id)
                    ->where('course_id', $course->id)
                    ->exists();

                if (!$exists) {
                    CourseEnrollment::create([
                        'user_id' => $user->id,
                        'course_id' => $course->id,
                    ]);
                    $enrollmentCount++;
                }
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Enrollment complete! Created {$enrollmentCount} new enrollments.");
    }
}
