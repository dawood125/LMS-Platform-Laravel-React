<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
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

    public function show($id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();

        $data['category_id'] = $request->input('category_id', $request->input('category'));
        $data['level_id'] = $request->input('level_id', $request->input('level'));
        $data['language_id'] = $request->input('language_id', $request->input('language'));

        $data['price'] = $request->input(
            'price',
            $request->input('sell_price', $request->input('sell-price'))
        );
        $data['cross_price'] = $request->input('cross_price', $request->input('cross-price'));

        if ($data['cross_price'] === '') {
            $data['cross_price'] = null;
        }

        $Validator = Validator::make($data, [
            'title' => 'required|min:3|max:255',
            'category_id' => 'required|exists:categories,id',
            'level_id' => 'required|exists:levels,id',
            'language_id' => 'required|exists:languages,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cross_price' => 'nullable|numeric|min:0',
        ]);

        if ($Validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $Validator->errors()
            ], 422);
        }

        $course = Course::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $course->title = $data['title'];
        $course->category_id = $data['category_id'];
        $course->level_id = $data['level_id'];
        $course->language_id = $data['language_id'];
        $course->description = $data['description'];
        $course->price = $data['price'];
        $course->cross_price = $data['cross_price'];
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    //This method will return categories/levels/languages for course creation/editing
    public function metaData()
    {

        $categories = category::where('status', 1)->get();
        $levels = Level::where('status', 1)->get();
        $languages = Language::where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }
}
