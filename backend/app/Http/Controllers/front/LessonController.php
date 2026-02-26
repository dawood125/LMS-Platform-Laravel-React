<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File as FacadesFile;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function index()
    {
        $lessons = Lesson::where('chapter_id', request()->chapter_id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $lessons
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|integer'
        ]);

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->title;
        $lesson->status = $request->status ?? 0;
        $lesson->sort_order = $request->sort_order ?? 1000;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson added successfully',
            'data' => $lesson
        ]);
    }

    public function show($id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'is_free_preview' => 'nullable|boolean',
            'duration' => 'nullable|integer|min:0',
            'video' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|integer'
        ]);

        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        $lesson->title = $request->title;

        if ($request->has('is_free_preview')) {
            $lesson->is_free_preview = ($request->is_free_preview === false) ? "no" : "yes";
        }

        if ($request->has('duration')) {
            $lesson->duration = $request->duration;
        }

        if ($request->has('video')) {
            $lesson->video = $request->video;
        }

        if ($request->has('description')) {
            $lesson->description = $request->description;
        }

        if ($request->has('sort_order')) {
            $lesson->sort_order = $request->sort_order;
        }

        if ($request->has('status')) {
            $lesson->status = $request->status;
        }

        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson updated successfully',
            'data' => $lesson
        ]);
    }

    public function destroy($id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found'
            ], 404);
        }

        $chapterId = $lesson->chapter_id;

        $lesson->delete();

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson deleted successfully',
            'data' => $chapter
        ]);
    }

    public function saveVideo(Request $request, $id)
    {
        $Validator = Validator::make($request->all(), [
            'video' => 'required|file|mimes:mp4,avi,mov|max:512000'
        ]);

        if ($Validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $Validator->errors()
            ], 422);
        }


        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => false,
                'message' => 'Lesson not found'
            ], 404);
        }


        $course = Course::whereHas('chapters', function ($query) use ($lesson) {
            $query->where('id', $lesson->chapter_id);
        })->where('user_id', $request->user()->id)->first();

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }


        if ($lesson && $lesson->video) {
            if (FacadesFile::exists(public_path($lesson->video))) {
                FacadesFile::delete(public_path($lesson->video));
            }
        }


        $video = $request->file('video');
        $videoName = time() . '_' . $id . '.' . $video->getClientOriginalExtension();
        $video->move(public_path('uploads/courses/video'), $videoName);

        $lesson->video = 'uploads/courses/video/' . $videoName;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson video updated successfully',
            'data' => $lesson
        ]);
    }
}
