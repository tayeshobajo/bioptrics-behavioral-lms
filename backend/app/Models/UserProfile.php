<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_title',
        'department',
        'bio',
        'skills',
        'learning_preferences',
        'behavioral_metrics',
        'achievements'
    ];

    protected $casts = [
        'skills' => 'array',
        'learning_preferences' => 'array',
        'behavioral_metrics' => 'array',
        'achievements' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
