<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Outcome;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    public function index(Request $request)
    {
        // Verify the course belongs to this user
        $course = Course::where('id', $request->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $outcomes = Outcome::where('course_id', $request->course_id)->get();
        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ]); 
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'outcome' => 'required|string|max:255'
        ]);

        // Verify the course belongs to this user
        $course = Course::where('id', $request->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome added successfully',
            'data' => $outcome
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'outcome' => 'required|string|max:255',
            'sort_order' => 'nullable|integer'
        ]);

        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        // Verify ownership: outcome → course → user
        $course = Course::where('id', $outcome->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $outcome->text = $request->outcome;

        if ($request->has('sort_order')) {
            $outcome->sort_order = $request->sort_order;
        }

        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome updated successfully',
            'data' => $outcome
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        // Verify ownership: outcome → course → user
        $course = Course::where('id', $outcome->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome deleted successfully'
        ]);
    }
}
