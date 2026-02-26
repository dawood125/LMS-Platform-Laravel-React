<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Language;
use App\Models\Lesson;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File as FacadesFile;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
    public function show($id, Request $request)
    {
        $course = Course::with('chapters.lessons')->find($id);

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found'
            ], 404);
        }

        if ($course->user_id !== $request->user()->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => true,
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

        $categories = Category::where('status', 1)->get();
        $levels = Level::where('status', 1)->get();
        $languages = Language::where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ]);
    }

    public function saveCourseImage(Request $request, $id)
    {
        $Validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        if ($course && $course->image) {
            FacadesFile::delete(public_path($course->image));
            //Delete old thumbnail
            $oldThumbnailPath = public_path('uploads/courses/thumbnails/' . basename($course->image));
            if (FacadesFile::exists($oldThumbnailPath)) {
                FacadesFile::delete($oldThumbnailPath);
            }
        }

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $image = $request->file('image');
        $imageName = time() . '_' . $id . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads/courses'), $imageName);

        //Create small Thumbnail
        $thumbnailPath = public_path('uploads/courses/thumbnails');
        if (!FacadesFile::exists($thumbnailPath)) {
            FacadesFile::makeDirectory($thumbnailPath, 0755, true);
        }

        $manager = new ImageManager(new Driver());
        $thumbnail = $manager->read(public_path('uploads/courses/' . $imageName));
        $thumbnail->resize(750, 450);
        $thumbnail->save($thumbnailPath . '/' . $imageName);

        $course->image = 'uploads/courses/' . $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course image uploaded successfully',
            'data' => $course
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $course->status = $request->input('status', $course->status);
        $course->save();

        $message = ($course->status == 1) ? 'Course published successfully' : 'Course unpublished successfully';

        return response()->json([
            'status' => 200,
            'message' => $message,
            'data' => $course
        ]);
    }

    public function destroy($id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', request()->user()->id)
            ->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        // Delete course image and thumbnail
        if ($course->image) {
            FacadesFile::delete(public_path($course->image));
            $thumbnailPath = public_path('uploads/courses/thumbnails/' . basename($course->image));
            if (FacadesFile::exists($thumbnailPath)) {
                FacadesFile::delete($thumbnailPath);
            }
        }

        $chapters = Chapter::where('course_id', $course->id)->get();
        foreach ($chapters as $chapter) {
            $lessons = Lesson::where('chapter_id', $chapter->id)->get();
            foreach ($lessons as $lesson) {
                if ($lesson->video) {
                    FacadesFile::delete(public_path($lesson->video));
                }
                $lesson->delete();
            }
            $chapter->delete();
        }

        $course->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Course deleted successfully'
        ]);
    }
}
