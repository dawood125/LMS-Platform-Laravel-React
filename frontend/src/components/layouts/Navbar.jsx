import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiBookOpen, FiLogIn, FiLogOut, FiUser, FiPlusCircle, FiGrid } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsOpen(false);
    };

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    
                    <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <FiBookOpen className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Learn<span className="text-indigo-600">Hub</span>
                        </span>
                    </Link>

                   
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/courses"
                            className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all duration-200">
                            Browse Courses
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/instructor/courses"
                                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all duration-200">
                                    <span className="flex items-center gap-1.5">
                                        <FiGrid className="text-base" />
                                        My Courses
                                    </span>
                                </Link>
                                <Link to="/student/enrollments"
                                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all duration-200">
                                    <span className="flex items-center gap-1.5">
                                        <FiBookOpen className="text-base" />
                                        My Learning
                                    </span>
                                </Link>
                                <Link to="/instructor/courses/create"
                                    className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200">
                                    <span className="flex items-center gap-1.5">
                                        <FiPlusCircle className="text-base" />
                                        Create Course
                                    </span>
                                </Link>

                              
                                <div className="relative ml-3 group">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 text-sm font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    </button>

                                   
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={closeMenu}>
                                            <FiUser className="text-gray-400" />
                                            Profile
                                        </Link>
                                        <hr className="my-1 border-gray-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                            <FiLogOut className="text-red-400" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all duration-200">
                                    <span className="flex items-center gap-1.5">
                                        <FiLogIn className="text-base" />
                                        Login
                                    </span>
                                </Link>
                                <Link to="/register"
                                    className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                            <Link to="/courses"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium"
                                onClick={closeMenu}>
                                Browse Courses
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/instructor/courses"
                                        className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium"
                                        onClick={closeMenu}>
                                        My Courses
                                    </Link>
                                    <Link to="/student/enrollments"
                                        className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium"
                                        onClick={closeMenu}>
                                        My Learning
                                    </Link>
                                    <Link to="/instructor/courses/create"
                                        className="px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium"
                                        onClick={closeMenu}>
                                        Create Course
                                    </Link>
                                    <hr className="my-2 border-gray-100" />
                                    <div className="px-4 py-2 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 text-sm font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium text-left">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"
                                        className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium"
                                        onClick={closeMenu}>
                                        Login
                                    </Link>
                                    <Link to="/register"
                                        className="mx-4 mt-2 px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center hover:bg-indigo-700"
                                        onClick={closeMenu}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;