<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'login']);

//Home apis
Route::get('/categories', [HomeController::class, 'getCategories']);
Route::get('/fetch-levels', [HomeController::class, 'getLevels']);
Route::get('/fetch-languages', [HomeController::class, 'getLanguages']);

Route::get('/featured-courses', [HomeController::class, 'featuredCourses']);
Route::get('/fetch-courses', [HomeController::class, 'courses']);
Route::get('/course-details/{id}', [HomeController::class, 'courseDetails']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/metadata', [CourseController::class, 'metaData']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage']);
    Route::post('/change-course-status/{id}', [CourseController::class, 'changeStatus']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [OutcomeController::class, 'destroy']);

    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::put('/requirements/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);

    Route::get('/chapters', [ChapterController::class, 'index']);
    Route::post('/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);

    Route::get('/lessons', [LessonController::class, 'index']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveVideo']);

    Route::get('/my-courses', [AccountController::class, 'mycourses']);
    Route::get('/enrollments', [AccountController::class, 'enrollements']);
    Route::get('/course-access/{id}', [AccountController::class, 'courses']);
    Route::post('/enroll-course', [HomeController::class, 'enrollCourse']);

    
});
