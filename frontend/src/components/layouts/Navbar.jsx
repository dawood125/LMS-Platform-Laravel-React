import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiBookOpen, FiLogIn, FiLogOut, FiUser, FiPlusCircle, FiGrid } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsOpen(false);
    };

    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive(path)
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
        }`;

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
                            <FiBookOpen className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-display font-bold text-gray-900">
                            Learn<span className="text-primary-600">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/courses" className={navLinkClass('/courses')}>
                            Browse Courses
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/instructor/courses" className={navLinkClass('/instructor/courses')}>
                                    <span className="flex items-center gap-1.5">
                                        <FiGrid className="text-base" />
                                        My Courses
                                    </span>
                                </Link>
                                <Link to="/student/enrollments" className={navLinkClass('/student/enrollments')}>
                                    <span className="flex items-center gap-1.5">
                                        <FiBookOpen className="text-base" />
                                        My Learning
                                    </span>
                                </Link>
                                <Link to="/instructor/courses/create"
                                    className="ml-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-200 hover:shadow-lg">
                                    <span className="flex items-center gap-1.5">
                                        <FiPlusCircle className="text-base" />
                                        Create Course
                                    </span>
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative ml-3 group">
                                    <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white text-sm font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    </button>

                                    <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                                        <div className="px-4 py-2.5 border-b border-gray-50">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Learner</p>
                                        </div>
                                        <Link to="/profile"
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={closeMenu}>
                                            <FiUser className="text-gray-400" size={16} />
                                            Profile Settings
                                        </Link>
                                        <hr className="my-1 border-gray-50" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                                            <FiLogOut className="text-red-400" size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={navLinkClass('/login')}>
                                    <span className="flex items-center gap-1.5">
                                        <FiLogIn className="text-base" />
                                        Sign In
                                    </span>
                                </Link>
                                <Link to="/register"
                                    className="ml-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-200 hover:shadow-lg">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top">
                        <div className="flex flex-col gap-1">
                            <Link to="/courses"
                                className="px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-sm font-medium"
                                onClick={closeMenu}>
                                Browse Courses
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/instructor/courses"
                                        className="px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-sm font-medium"
                                        onClick={closeMenu}>
                                        My Courses
                                    </Link>
                                    <Link to="/student/enrollments"
                                        className="px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-sm font-medium"
                                        onClick={closeMenu}>
                                        My Learning
                                    </Link>
                                    <Link to="/instructor/courses/create"
                                        className="px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-xl text-sm font-medium"
                                        onClick={closeMenu}>
                                        Create Course
                                    </Link>
                                    <hr className="my-2 border-gray-100" />
                                    <div className="px-4 py-2 flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 block">{user?.name}</span>
                                            <span className="text-xs text-gray-400">Learner</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium text-left">
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"
                                        className="px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl text-sm font-medium"
                                        onClick={closeMenu}>
                                        Sign In
                                    </Link>
                                    <Link to="/register"
                                        className="mx-4 mt-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-medium text-center hover:from-primary-700 hover:to-primary-800 shadow-md"
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