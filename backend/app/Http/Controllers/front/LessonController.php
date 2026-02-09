<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;

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
            'is_free_preview' => 'nullable|in:yes,no',
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
            $lesson->is_free_preview = $request->is_free_preview;
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

        $lesson->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson deleted successfully'
        ]);
    }
}
