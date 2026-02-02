<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'title' => 'required|min:3|max:255',
        ]);

        if ($Validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $Validator->errors()
            ], 422);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();


        return response()->json([
            'status' => 200,
            'message' => 'Course created successfully',
            'data' => $course
        ]);
    }
}
