<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $chapters
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|integer'
        ]);

        $chapter = new Chapter();
        $chapter->course_id = $request->course_id;
        $chapter->title = $request->title;
        $chapter->sort_order = $request->sort_order ?? 1000;
        $chapter->status = $request->status ?? 1;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter added successfully',
            'data' => $chapter
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|integer'
        ]);

        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter not found'
            ], 404);
        }

        $chapter->title = $request->title;

        if ($request->has('sort_order')) {
            $chapter->sort_order = $request->sort_order;
        }

        if ($request->has('status')) {
            $chapter->status = $request->status;
        }

        $chapter->save();
        $chapter->load('lessons');

        return response()->json([
            'status' => 200,
            'message' => 'Chapter updated successfully',
            'data' => $chapter
        ]);
    }

    public function destroy($id)
    {
        $chapter = Chapter::with('lessons')->find($id);

        if (!$chapter) {
            return response()->json([
                'status' => false,
                'message' => 'Chapter not found'
            ], 404);
        }

        foreach ($chapter->lessons as $lesson) {
            if ($lesson->video && file_exists(public_path('uploads/courses/video/' . $lesson->video))) {
                unlink(public_path('uploads/courses/video/' . $lesson->video));
            }
            $lesson->delete();
        }

        $chapter->delete();

        return response()->json([
            'status' => true,
            'message' => 'Chapter and its lessons deleted successfully'
        ]);
    }
}
