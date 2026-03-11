<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'chapter_id', 'title', 'is_free_preview', 'duration',
        'video', 'description', 'sort_order', 'status'
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
