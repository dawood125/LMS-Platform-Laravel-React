<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    public function index(Request $request)
    {
        $outcomes=Outcome::where('course_id',$request->course_id)->get();
        return response()->json([
            'status'=>200,
            'data'=>$outcomes
        ]); 
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id'=>'required|exists:courses,id',
            'outcome'=>'required|string|max:255'
        ]);

        $outcome=new Outcome();
        $outcome->course_id=$request->course_id;
        $outcome->text=$request->outcome;
        $outcome->sort_order=1000;
        $outcome->save();

        return response()->json([
            'status'=>200,
            'message'=>'Outcome added successfully',
            'data'=>$outcome
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'outcome'=>'required|string|max:255',
            'sort_order' => 'nullable|integer'
        ]);

        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
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

    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome deleted successfully'
        ]);
    }
}
