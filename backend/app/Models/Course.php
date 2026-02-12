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
        return $this->hasMany(Chapter::class)->orderBy('sort_order');
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class);
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
