<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'user_id', 'category_id', 'language_id', 'level_id',
        'description', 'price', 'cross_price', 'status', 'is_featured', 'image'
    ];

    protected $appends = ['course_small_image'];
    public function getCourseSmallImageAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // Seeded/demo data may store full external URLs; use them as-is.
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        $path = parse_url($this->image, PHP_URL_PATH) ?: $this->image;
        $filename = basename($path);
        $thumbnailPath = 'uploads/courses/thumbnails/' . $filename;

        if (file_exists(public_path($thumbnailPath))) {
            return asset($thumbnailPath);
        }

        // Fallback to original image path if thumbnail is missing.
        return asset($this->image);
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
        return $this->belongsTo(Category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
