<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $appends = ['course_small_image'];
    public function getCourseSmallImageAttribute()
    {
        if (!$this->image) {
            return null;
        }

        $filename = basename($this->image);

        return asset('uploads/courses/thumbnails/' . $filename);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }
}
