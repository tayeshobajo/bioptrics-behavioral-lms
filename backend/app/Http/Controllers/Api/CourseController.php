<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CourseEnrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function enrolled(Request $request): JsonResponse
    {
        $enrollments = CourseEnrollment::with('course')
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'course' => [
                        'title' => $enrollment->course->title,
                        'description' => $enrollment->course->description,
                        'thumbnail_url' => $enrollment->course->thumbnail_url,
                        'slug' => $enrollment->course->slug,
                    ],
                    'progress' => $enrollment->progress,
                    'started_at' => $enrollment->started_at,
                    'completed_at' => $enrollment->completed_at,
                ];
            });

        return response()->json([
            'enrollments' => $enrollments,
        ]);
    }
}
