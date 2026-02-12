<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{

    public function register(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        //If validation fails
        if ($validatedData->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validatedData->errors()
            ], 422);
        }

        //Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return response()->json([
            'status' => 201,
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validation
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255', // ⚠️ I REMOVED 'unique:users' here. IMPORTANT!
            'password' => 'required|string|min:8',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validatedData->errors()
            ], 422);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::user()->id);

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id
            ]);
        }


        return response()->json([
            'status' => 401,
            'message' => 'Either email or password is incorrect'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Logged out successfully'
        ]);
    }

    public function mycourses(Request $request)
    {
        $courses = Course::where('user_id', $request->user()->id)->with('level')->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ]);
    }

    public function enrollements(Request $request)
    {

        $enrollments = Enrollment::where('user_id', $request->user()->id)->with('course', 'course.level')->get();

        return response()->json([
            'status' => 200,
            'data' => $enrollments
        ]);
    }

    public function courses(Request $request, $id)
    {
        $count = Enrollment::where(['user_id' => $request->user()->id, 'course_id' => $id])->count();

        if ($count == 0) {
            return response()->json([
                'status' => 404,
                'message' => 'You cannot access this course'
            ], 404);
        }

        $course = Course::withCount('chapters')->with([
            'level',
            'category',
            'language',
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

        $activeLesson=collect();

        $activityCount = Activity::where(['user_id' => $request->user()->id, 'course_id' => $id])->count();
        if ($activityCount == 0) {
            $lesson = Lesson::whereHas('chapter', function ($query) use ($id) {
                $query->where('course_id', $id);
            })
                ->where('status', 1)
                ->whereNotNull('video')
                ->orderBy('id', 'asc')
                ->first();

            if ($lesson) {
                Activity::create([
                    'user_id' => $request->user()->id,
                    'course_id' => $id,
                    'chapter_id' => $lesson->chapter_id,
                    'lesson_id' => $lesson->id,
                    'is_last_watched' => 'yes'
                ]);
            }

            $activeLesson = $lesson;
        }else{
            $activity = Activity::where(['user_id' => $request->user()->id, 'course_id' => $id])->with('lesson')->first();

            $activeLesson = $activity->lesson;
        }


        return response()->json([
            'status' => 200,
            'data' => $course,
            'active_lesson' => $activeLesson
        ]);
    }
}
