import { useState } from "react";
import Home from "./components/pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Courses from "./components/pages/Courses";
import Login from "./components/pages/Login";
import Detail from "./components/pages/Detail";
import Register from "./components/pages/Register";
import WatchCourses from "./components/pages/account/WatchCourses";
import ChangePassword from "./components/pages/account/ChangePassword";
import MyCourses from "./components/pages/account/MyCourses";
import MyLearning from "./components/pages/account/MyLearning";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/pages/account/Dashboard";
import RequireAuth from "./components/common/RequireAuth";
import CreateCourse from "./components/pages/account/courses/CreateCourse";
import EditCourse from "./components/pages/account/courses/EditCourse";
import EditLesson from "./components/pages/account/courses/EditLesson";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
          <Route path="/account/my-courses" element={<MyCourses />} />
          <Route
            path="/account/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
                <CreateCourse></CreateCourse>
              </RequireAuth>
            }
          />

          <Route
            path="/account/my-learning"
            element={
              <RequireAuth>
                <MyLearning></MyLearning>
              </RequireAuth>
            }
          />

          <Route
            path="/account/watch-courses/:id"
            element={
              <RequireAuth>
                <WatchCourses></WatchCourses>
              </RequireAuth>
            }
          />

          <Route
            path="/account/my-courses/create"
            element={
              <RequireAuth>
                <CreateCourse></CreateCourse>
              </RequireAuth>
            }
          />

          <Route
            path="/account/my-courses/edit/:id"
            element={
              <RequireAuth>
                <EditCourse></EditCourse>
              </RequireAuth>
            }
          />

          <Route
            path="/account/courses/edit-lesson/:id/:courseId"
            element={
              <RequireAuth>
                <EditLesson></EditLesson>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
