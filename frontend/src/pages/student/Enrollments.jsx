import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiBookOpen, FiClock, FiArrowRight } from 'react-icons/fi';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await courseService.getEnrollments();
                setEnrollments(response.data.data || []);
            } catch (error) {
                toast.error('Failed to load enrollments');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const getImageUrl = (course) => {
        if (!course?.image) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=750&h=450&fit=crop';
        if (course.image.startsWith('http')) return course.image;
        return `http://localhost:8000/${course.image}`;
    };

    if (loading) return <EnrollmentsSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="font-display text-3xl font-bold text-gray-900">My Learning</h1>
                        <p className="text-gray-500 mt-1">
                            {enrollments.length > 0
                                ? `You are enrolled in ${enrollments.length} course${enrollments.length > 1 ? 's' : ''}`
                                : 'Start your learning journey today'
                            }
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {enrollments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FiBookOpen className="text-primary-600 text-3xl" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Browse our catalog and enroll in courses to start learning new skills.
                        </p>
                        <Link to="/courses"
                            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
                        >
                            Browse Courses
                            <FiArrowRight />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment, index) => {
                            const course = enrollment.course;
                            if (!course) return null;

                            return (
                                <motion.div
                                    key={enrollment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/student/courses/${course.id}/watch`}
                                        className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-500"
                                    >
                                        {/* Image */}
                                        <div className="relative overflow-hidden aspect-video">
                                            <img
                                                src={getImageUrl(course)}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="lazy"
                                            />

                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                                    <FiPlay className="text-primary-600 text-xl ml-1" />
                                                </div>
                                            </div>

                                            {/* Level Badge */}
                                            {course.level && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                                        {course.level.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="font-display font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                                {course.title}
                                            </h3>

                                            {/* Continue Button */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="text-sm text-gray-500">
                                                    Enrolled {new Date(enrollment.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                                                    Continue
                                                    <FiArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Skeleton
const EnrollmentsSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
                <div className="h-5 bg-gray-200 rounded-lg w-72" />
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                        <div className="aspect-video bg-gray-200" />
                        <div className="p-5 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Enrollments;