<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // Get reviews for a course (public)
    public function index($courseId)
    {
        $reviews = Review::where('course_id', $courseId)
            ->where('status', 1)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

        // Rating breakdown (5 star, 4 star, etc.)
        $ratingBreakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $reviews->where('rating', $i)->count();
            $ratingBreakdown[$i] = [
                'count' => $count,
                'percentage' => $totalReviews > 0 ? round(($count / $totalReviews) * 100) : 0,
            ];
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'reviews' => $reviews,
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'rating_breakdown' => $ratingBreakdown,
            ]
        ]);
    }

    // Submit a review (must be enrolled)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user()->id;
        $courseId = $request->course_id;

        // Check if user is enrolled
        $enrolled = Enrollment::where([
            'user_id' => $userId,
            'course_id' => $courseId
        ])->exists();

        if (!$enrolled) {
            return response()->json([
                'status' => 403,
                'message' => 'You must be enrolled in this course to leave a review'
            ], 403);
        }

        // Check if user already reviewed
        $existingReview = Review::where([
            'user_id' => $userId,
            'course_id' => $courseId
        ])->first();

        if ($existingReview) {
            // Update existing review
            $existingReview->rating = $request->rating;
            $existingReview->comment = $request->comment;
            $existingReview->status = 1;
            $existingReview->save();

            return response()->json([
                'status' => 200,
                'message' => 'Review updated successfully',
                'data' => $existingReview->load('user:id,name')
            ]);
        }

        // Create new review
        $review = Review::create([
            'user_id' => $userId,
            'course_id' => $courseId,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 1,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Review submitted successfully',
            'data' => $review->load('user:id,name')
        ], 201);
    }

    // Delete own review
    public function destroy($id, Request $request)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 404,
                'message' => 'Review not found'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Review deleted successfully'
        ]);
    }

    // Get user's review for a specific course
    public function userReview($courseId, Request $request)
    {
        $review = Review::where([
            'user_id' => $request->user()->id,
            'course_id' => $courseId
        ])->first();

        return response()->json([
            'status' => 200,
            'data' => $review
        ]);
    }
}