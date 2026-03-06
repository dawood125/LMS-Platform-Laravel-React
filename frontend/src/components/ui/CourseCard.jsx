import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiBookOpen, FiStar, FiUser } from 'react-icons/fi';

const CourseCard = ({ course, index = 0 }) => {

    const imageUrl = course.image
        ? (course.image.startsWith('http')
            ? course.image
            : `http://localhost:8000/uploads/courses/thumbnail/${course.image}`)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=750&h=450&fit=crop';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link to={`/courses/${course.id}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 h-full flex flex-col">

                    {/* Image */}
                    <div className="relative overflow-hidden aspect-video">
                        <img
                            src={imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Level Badge */}
                        {course.level && (
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                    {course.level.name}
                                </span>
                            </div>
                        )}

                        {/* Price Badge */}
                        <div className="absolute top-3 right-3">
                            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                {course.price > 0 ? `$${course.price}` : 'Free'}
                            </span>
                        </div>

                        {/* Play Button on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                        {/* Title */}
                        <h3 className="font-display font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                            {course.title}
                        </h3>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {course.total_lessons !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <FiBookOpen className="text-primary-500" size={14} />
                                    {course.total_lessons || 0} lessons
                                </span>
                            )}
                            {course.total_duration !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <FiClock className="text-primary-500" size={14} />
                                    {course.total_duration || 0}m
                                </span>
                            )}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Bottom: Price & Rating */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                {course.cross_price > 0 && course.cross_price > course.price && (
                                    <span className="text-sm text-gray-400 line-through">
                                        ${course.cross_price}
                                    </span>
                                )}
                                <span className="text-lg font-bold text-gray-900">
                                    {course.price > 0 ? `$${course.price}` : 'Free'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-accent-500">
                                <FiStar fill="currentColor" size={14} />
                                <span className="text-sm font-semibold text-gray-700">4.8</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CourseCard;