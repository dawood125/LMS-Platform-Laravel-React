<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
{
    public function index(Request $request)
    {
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

    public function destroy($id)
    {
        $requirement = Requirement::find($id);

        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found'
            ], 404);
        }

        $requirement->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement deleted successfully'
        ]);
    }
}
