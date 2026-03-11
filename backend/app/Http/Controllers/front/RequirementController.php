<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
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

        $requirements = Requirement::where('course_id', $request->course_id)->get();

        return response()->json([
            'status' => 200,
            'data' => $requirements
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'requirement' => 'required|string|max:255'
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

        $requirement = new Requirement();
        $requirement->course_id = $request->course_id;
        $requirement->text = $request->requirement;
        $requirement->sort_order = 1000;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement added successfully',
            'data' => $requirement
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'requirement' => 'required|string|max:255',
            'sort_order' => 'nullable|integer'
        ]);

        $requirement = Requirement::find($id);

        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        // Verify ownership: requirement → course → user
        $course = Course::where('id', $requirement->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $requirement->text = $request->requirement;

        if ($request->has('sort_order')) {
            $requirement->sort_order = $request->sort_order;
        }

        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement updated successfully',
            'data' => $requirement
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $requirement = Requirement::find($id);

        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        // Verify ownership: requirement → course → user
        $course = Course::where('id', $requirement->course_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $requirement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement deleted successfully'
        ]);
    }
}
