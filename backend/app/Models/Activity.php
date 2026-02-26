<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'chapter_id',
        'is_last_watched',
        'watch_time'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
