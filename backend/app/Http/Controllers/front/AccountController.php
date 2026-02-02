<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{

    public function register(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        //If validation fails
        if ($validatedData->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validatedData->errors()
            ], 422);
        }

        //Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
        return response()->json([
            'status' => 201,
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Validation
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255', // ⚠️ I REMOVED 'unique:users' here. IMPORTANT!
            'password' => 'required|string|min:8',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Validation failed',
                'errors' => $validatedData->errors()
            ], 422);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            
            $user = User::find(Auth::user()->id); 
            
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id
            ]);
        } 
        
        
        return response()->json([
            'status' => 401,
            'message' => 'Either email or password is incorrect'
        ], 401);
    }
}