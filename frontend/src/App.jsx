import { useState } from 'react'
import Home from './components/pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Courses from './components/pages/Courses'
import Login from './components/pages/Login'
import Detail from './components/pages/Detail'
import Register from './components/pages/Register'
import WatchCourses from './components/pages/account/WatchCourses'
import ChangePassword from './components/pages/account/ChangePassword'
import MyCourses from './components/pages/account/MyCourses'
import MyLearning from './components/pages/account/MyLearning'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/watch-courses" element={<WatchCourses />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
          <Route path="/account/my-courses" element={<MyCourses />} />
          <Route path="/account/my-learning" element={<MyLearning />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
