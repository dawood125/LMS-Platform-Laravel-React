import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layouts/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CourseList from './pages/course/CourseList';
import CourseDetail from './pages/course/CourseDetail';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import Enrollments from './pages/student/Enrollments';
import WatchCourse from './pages/student/WatchCourse';
import NotFound from './pages/NotFound';

// Wrapper to conditionally show layout
const AppContent = () => {
    const location = useLocation();

    // Pages that should NOT have navbar/footer
    const noLayoutRoutes = ['/student/courses'];
    const isNoLayout = noLayoutRoutes.some(route => location.pathname.includes(route) && location.pathname.includes('/watch'));

    return (
        <>
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2937',
                        color: '#f9fafb',
                        borderRadius: '12px',
                        padding: '14px 20px',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#f9fafb' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#f9fafb' },
                    },
                }}
            />

            {isNoLayout ? (
                <Routes>
                    <Route path="/student/courses/:id/watch" element={
                        <ProtectedRoute><WatchCourse /></ProtectedRoute>
                    } />
                </Routes>
            ) : (
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/courses/:id" element={<CourseDetail />} />

                        {/* Protected - Instructor Routes */}
                        <Route path="/instructor/courses" element={
                            <ProtectedRoute><InstructorCourses /></ProtectedRoute>
                        } />
                        <Route path="/instructor/courses/create" element={
                            <ProtectedRoute><CreateCourse /></ProtectedRoute>
                        } />
                        <Route path="/instructor/courses/:id/edit" element={
                            <ProtectedRoute><EditCourse /></ProtectedRoute>
                        } />

                        {/* Protected - Student Routes */}
                        <Route path="/student/enrollments" element={
                            <ProtectedRoute><Enrollments /></ProtectedRoute>
                        } />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            )}
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;