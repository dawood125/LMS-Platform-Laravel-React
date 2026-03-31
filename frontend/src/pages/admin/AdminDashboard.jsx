import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiUsers, FiBookOpen, FiShoppingCart, FiStar,
    FiLayers, FiPlay, FiTrendingUp, FiArrowRight,
    FiUser, FiTrash2, FiSearch, FiFilter
} from 'react-icons/fi';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Users tab
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');

    // Courses tab
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [courseSearch, setCourseSearch] = useState('');
    const [courseStatusFilter, setCourseStatusFilter] = useState('all');

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'courses') fetchCourses();
    }, [activeTab, userSearch, userRoleFilter, courseSearch, courseStatusFilter]);

    const fetchDashboard = async () => {
        try {
            const response = await adminService.getDashboard();
            setData(response.data.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await adminService.getUsers({
                search: userSearch || undefined,
                role: userRoleFilter !== 'all' ? userRoleFilter : undefined,
            });
            setUsers(response.data.data.data || []);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchCourses = async () => {
        setCoursesLoading(true);
        try {
            const response = await adminService.getCourses({
                search: courseSearch || undefined,
                status: courseStatusFilter !== 'all' ? courseStatusFilter : undefined,
            });
            setCourses(response.data.data.data || []);
        } catch (error) {
            toast.error('Failed to load courses');
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('Role updated');
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await adminService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success('User deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleCourseStatus = async (courseId, newStatus) => {
        try {
            await adminService.updateCourseStatus(courseId, { status: newStatus });
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: parseInt(newStatus) } : c));
            toast.success(newStatus == 1 ? 'Course published' : 'Course unpublished');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: 'bg-red-100 text-red-700',
            instructor: 'bg-blue-100 text-blue-700',
            student: 'bg-green-100 text-green-700',
        };
        return badges[role] || badges.student;
    };

    if (loading) return <AdminSkeleton />;

    const stats = data?.stats || {};

    const statCards = [
        { label: 'Total Users', value: stats.total_users, icon: FiUsers, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Courses', value: stats.total_courses, icon: FiBookOpen, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
        { label: 'Enrollments', value: stats.total_enrollments, icon: FiShoppingCart, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
        { label: 'Reviews', value: stats.total_reviews, icon: FiStar, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
        { label: 'Chapters', value: stats.total_chapters, icon: FiLayers, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
        { label: 'Lessons', value: stats.total_lessons, icon: FiPlay, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="font-display text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Monitor and manage your platform</p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-6 -mb-px">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'users', label: 'Users' },
                            { id: 'courses', label: 'Courses' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                                    activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ===== OVERVIEW TAB ===== */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {statCards.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                        <stat.icon className={`text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                                    </div>
                                    <div className="text-2xl font-display font-bold text-gray-900">{stat.value || 0}</div>
                                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Recent Enrollments */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Recent Enrollments</h3>
                                <div className="space-y-3">
                                    {data?.recent_enrollments?.map((enrollment) => (
                                        <div key={enrollment.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <span className="text-primary-600 text-xs font-bold">
                                                        {enrollment.user?.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{enrollment.user?.name}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{enrollment.course?.title}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(enrollment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                    {(!data?.recent_enrollments || data.recent_enrollments.length === 0) && (
                                        <p className="text-gray-400 text-sm text-center py-4">No enrollments yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Courses */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Top Courses</h3>
                                <div className="space-y-3">
                                    {data?.top_courses?.map((course, i) => (
                                        <div key={course.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{course.title}</p>
                                                    <p className="text-xs text-gray-500">{course.enrollments_count} enrollments</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                course.status === 1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {course.status === 1 ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    ))}
                                    {(!data?.top_courses || data.top_courses.length === 0) && (
                                        <p className="text-gray-400 text-sm text-center py-4">No courses yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                                <FiUsers className="text-2xl mb-3 opacity-80" />
                                <div className="text-3xl font-display font-bold">{stats.total_students || 0}</div>
                                <div className="text-blue-100 text-sm mt-1">Students</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                                <FiBookOpen className="text-2xl mb-3 opacity-80" />
                                <div className="text-3xl font-display font-bold">{stats.total_instructors || 0}</div>
                                <div className="text-purple-100 text-sm mt-1">Instructors</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                                <FiTrendingUp className="text-2xl mb-3 opacity-80" />
                                <div className="text-3xl font-display font-bold">{stats.published_courses || 0}</div>
                                <div className="text-green-100 text-sm mt-1">Published Courses</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== USERS TAB ===== */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white transition-all"
                                />
                            </div>
                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-100 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="instructor">Instructor</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {usersLoading ? (
                                            [...Array(5)].map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : users.length > 0 ? (
                                            users.map(u => (
                                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-semibold">{u.name?.charAt(0)?.toUpperCase()}</span>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${getRoleBadge(u.role)}`}
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="instructor">Instructor</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id, u.name)}
                                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== COURSES TAB ===== */}
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={courseSearch}
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white transition-all"
                                />
                            </div>
                            <select
                                value={courseStatusFilter}
                                onChange={(e) => setCourseStatusFilter(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-100 rounded-xl text-sm bg-white focus:outline-none focus:border-primary-500"
                            >
                                <option value="all">All Status</option>
                                <option value="1">Published</option>
                                <option value="0">Draft</option>
                            </select>
                        </div>

                        {/* Courses Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Course</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Enrollments</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {coursesLoading ? (
                                            [...Array(5)].map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : courses.length > 0 ? (
                                            courses.map(course => (
                                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Link to={`/courses/${course.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1">
                                                            {course.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {course.category?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {course.enrollments_count || 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {course.price > 0 ? `$${course.price}` : 'Free'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                            course.status === 1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {course.status === 1 ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleCourseStatus(course.id, course.status === 1 ? '0' : '1')}
                                                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                                                course.status === 1
                                                                    ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                                                    : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                            }`}
                                                        >
                                                            {course.status === 1 ? 'Unpublish' : 'Publish'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                    No courses found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Skeleton
const AdminSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
                <div className="h-5 bg-gray-200 rounded-lg w-72" />
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
                        <div className="h-7 bg-gray-200 rounded w-16 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default AdminDashboard;