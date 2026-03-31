<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Review;
use App\Models\Lesson;
use App\Models\Chapter;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Dashboard stats
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_students' => User::where('role', 'student')->count(),
            'total_instructors' => User::where('role', 'instructor')->count(),
            'total_courses' => Course::count(),
            'published_courses' => Course::where('status', 1)->count(),
            'draft_courses' => Course::where('status', 0)->count(),
            'total_enrollments' => Enrollment::count(),
            'total_reviews' => Review::count(),
            'total_chapters' => Chapter::count(),
            'total_lessons' => Lesson::count(),
        ];

        // Recent enrollments
        $recentEnrollments = Enrollment::with(['user:id,name,email,role', 'course:id,title'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // Recent users
        $recentUsers = User::orderBy('created_at', 'desc')
            ->take(10)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        // Top courses by enrollments
        $topCourses = Course::withCount('enrollments')
            ->with('level:id,name')
            ->orderBy('enrollments_count', 'desc')
            ->take(5)
            ->get(['id', 'title', 'status', 'price', 'level_id', 'created_at']);

        return response()->json([
            'status' => 200,
            'data' => [
                'stats' => $stats,
                'recent_enrollments' => $recentEnrollments,
                'recent_users' => $recentUsers,
                'top_courses' => $topCourses,
            ]
        ]);
    }

    // All users list
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'status' => 200,
            'data' => $users
        ]);
    }

    // Update user role
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,instructor,student',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'User role updated successfully',
            'data' => $user
        ]);
    }

    // All courses list (admin view)
    public function courses(Request $request)
    {
        $query = Course::with(['level:id,name', 'category:id,name']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $courses = $query->withCount(['chapters', 'enrollments'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 200,
            'data' => $courses
        ]);
    }

    // Admin force status change
    public function updateCourseStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:0,1',
        ]);

        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $course->status = $request->status;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => $course->status == 1 ? 'Course published' : 'Course unpublished',
            'data' => $course
        ]);
    }

    // Delete user
    public function deleteUser($id, Request $request)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found'
            ], 404);
        }

        // Don't allow deleting yourself
        if ($user->id === $request->user()->id) {
            return response()->json([
                'status' => 400,
                'message' => 'You cannot delete your own account'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User deleted successfully'
        ]);
    }
}