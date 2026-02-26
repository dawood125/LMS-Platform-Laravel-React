<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function getCategories()
    {
        $categories = Category::where('status', 1)->orderBy('name')->get();
        return response()->json([
            'status' => 200,
            'data' => $categories
        ]);
    }

    public function getLevels()
    {
        $levels = Level::where('status', 1)->orderBy('name')->get();
        return response()->json([
            'status' => 200,
            'data' => $levels
        ]);
    }

    public function getLanguages()
    {
        $languages = Language::where('status', 1)->orderBy('name')->get();
        return response()->json([
            'status' => 200,
            'data' => $languages
        ]);
    }

    public function featuredCourses()
    {
        $courses = Course::with("level")->where('is_featured', "yes")->where('status', 1)->orderBy('created_at', 'desc')->take(10)->get();
        return response()->json([
            'status' => 200,
            'data' => $courses
        ]);
    }

    public function courses(Request $request)
    {
        $courses = Course::with("level")->where('status', 1);

        //filter search by keyword
        if (request()->has('keyword')) {
            $keyword = request()->input('keyword');
            $courses = $courses->where('title', 'like', '%' . $keyword . '%');
        }

        //filter search by category
        if (request()->has('category')) {
            $categoryArr = explode(",", request()->input('category'));
            if (!empty($categoryArr)) {
                $courses = $courses->whereIn('category_id', $categoryArr);
            }
        }
        // filter search by level
        if (request()->has('level')) {
            $levelArr = explode(",", request()->input('level'));
            if (!empty($levelArr)) {
                $courses = $courses->whereIn('level_id', $levelArr);
            }
        }
        // filter search by language
        if (request()->has('language')) {
            $languageArr = explode(",", request()->input('language'));
            if (!empty($languageArr)) {
                $courses = $courses->whereIn('language_id', $languageArr);
            }
        }

        $sort = strtolower((string) $request->query('sort', 'desc'));
        $courses = $courses->orderBy('created_at', in_array($sort, ['asc', 'desc'], true) ? $sort : 'desc');

        $courses = $courses->paginate(12);
        return response()->json([
            'status' => 200,
            'data' => $courses
        ]);
    }

    public function courseDetails($id)
    {
        $course = Course::withCount('chapters')->with([
            'level',
            'category',
            'language',
            'outcomes',
            'requirements',
            'chapters' => function ($query) {
                $query->withCount(['lessons' => function ($query) {
                    $query->where('status', 1);
                    $query->whereNotNull('video');
                }]);
                $query->withSum(['lessons' => function ($query) {
                    $query->where('status', 1);
                    $query->whereNotNull('video');
                }], 'duration');
            },
            'chapters.lessons' => function ($query) {
                $query->where('status', 1);
                $query->whereNotNull('video');
            }
        ])->where('id', $id)->first();

        $totalDuration = $course->chapters->sum(function ($chapter) {
            return $chapter->lessons_sum_duration ?? 0;
        });

        $totalLessons = $course->chapters->sum('lessons_count');

        $course->total_duration = $totalDuration;
        $course->total_lessons = $totalLessons;

        if ($course) {
            return response()->json([
                'status' => 200,
                'data' => $course
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }
    }


    public function enrollCourse(Request $request)
    {
        $course = Course::find($request->course_id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $count = Enrollment::where('course_id', $request->course_id)->where('user_id', $request->user()->id)->count();
        if ($count > 0) {
            return response()->json([
                'status' => 409,
                'message' => 'You are already enrolled in this course'
            ], 409);
        }

        $enrollment = new Enrollment();
        $enrollment->course_id = $request->course_id;
        $enrollment->user_id = $request->user()->id;
        $enrollment->save();

        return response()->json([
            'status' => 200,
            'message' => 'Enrolled successfully'
        ]);
    }
}
