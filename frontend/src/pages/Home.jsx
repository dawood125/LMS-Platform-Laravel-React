import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiUsers, FiAward, FiPlay, FiMonitor, FiTrendingUp, FiShield } from 'react-icons/fi';
import courseService from '../services/courseService';
import CourseCard from '../components/ui/CourseCard';
import SectionHeader from '../components/ui/SectionHeader';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, categoriesRes] = await Promise.all([
                    courseService.getFeaturedCourses(),
                    courseService.getCategories(),
                ]);
                setFeaturedCourses(coursesRes.data.data || coursesRes.data);
                setCategories(categoriesRes.data.data || categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categoryIcons = {
        'Web Development': FiMonitor,
        'Mobile Development': FiMonitor,
        'Data Science': FiTrendingUp,
        'Machine Learning': FiTrendingUp,
        'UI/UX Design': FiAward,
        'Cloud Computing': FiShield,
        'Cyber Security': FiShield,
        'DevOps': FiMonitor,
        'Blockchain': FiShield,
        'Digital Marketing': FiTrendingUp,
    };

    return (
        <div className="overflow-hidden">

            {/* ============ HERO SECTION ============ */}
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 mb-8">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                                </span>
                                <span className="text-white/80 text-sm font-medium">
                                    Join 5,000+ learners today
                                </span>
                            </div>

                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
                                Learn Without
                                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-accent-400">
                                    Limits
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                                Access world-class courses from expert instructors.
                                Build real-world skills and transform your career.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/courses"
                                    className="group inline-flex items-center justify-center gap-2.5 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-2xl shadow-white/10">
                                    Explore Courses
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/register"
                                    className="group inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                                    <FiPlay className="text-primary-400" />
                                    Get Started Free
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
                                <div>
                                    <div className="text-2xl font-bold text-white">100+</div>
                                    <div className="text-sm text-gray-400">Courses</div>
                                </div>
                                <div className="w-px h-10 bg-white/20" />
                                <div>
                                    <div className="text-2xl font-bold text-white">50+</div>
                                    <div className="text-sm text-gray-400">Instructors</div>
                                </div>
                                <div className="w-px h-10 bg-white/20" />
                                <div>
                                    <div className="text-2xl font-bold text-white">5K+</div>
                                    <div className="text-sm text-gray-400">Students</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - Floating Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:block relative"
                        >
                            <div className="relative w-full h-[500px]">
                                {/* Main Card */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="absolute top-8 left-8 right-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
                                            <FiPlay className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">React Masterclass</h3>
                                            <p className="text-gray-400 text-sm">12 chapters • 48 lessons</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                                        <div className="bg-gradient-to-r from-primary-400 to-purple-400 h-2 rounded-full" style={{ width: '65%' }} />
                                    </div>
                                    <p className="text-gray-400 text-sm">65% completed</p>
                                </motion.div>

                                {/* Stats Card */}
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                    className="absolute bottom-12 left-0 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <FiTrendingUp className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold text-lg">+28%</p>
                                            <p className="text-gray-500 text-xs">Skills Growth</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Certificate Card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute bottom-24 right-0 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                                            <FiAward className="text-accent-500" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">Certificate</p>
                                            <p className="text-gray-500 text-xs">Earned today!</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ CATEGORIES SECTION ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        subtitle="Categories"
                        title="Explore Top Categories"
                        description="Browse courses by category and find exactly what you want to learn"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category, index) => {
                            const Icon = categoryIcons[category.name] || FiBookOpen;
                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/courses?category=${category.id}`}
                                        className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-14 h-14 bg-primary-50 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center transition-colors duration-300">
                                            <Icon className="text-primary-600 text-xl" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-700 text-center transition-colors">
                                            {category.name}
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ FEATURED COURSES SECTION ============ */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="inline-block bg-primary-50 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
                            >
                                Featured Courses
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-display text-3xl sm:text-4xl font-bold text-gray-900"
                            >
                                Learn from the Best
                            </motion.h2>
                        </div>
                        <Link to="/courses"
                            className="group inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            View all courses
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                                    <div className="aspect-video bg-gray-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                                        <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCourses.slice(0, 6).map((course, index) => (
                                <CourseCard key={course.id} course={course} index={index} />
                            ))}
                        </div>
                    )}

                    {/* View More Button */}
                    {featuredCourses.length > 6 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <Link to="/courses"
                                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-semibold hover:border-primary-300 hover:text-primary-600 hover:shadow-lg transition-all duration-300">
                                View All Courses
                                <FiArrowRight />
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ============ WHY CHOOSE US SECTION ============ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        subtitle="Why LearnHub?"
                        title="Everything You Need to Succeed"
                        description="We provide the tools, content, and community to help you achieve your learning goals"
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '👨‍🏫',
                                title: 'Expert Instructors',
                                description: 'Learn from industry professionals with years of real-world experience and proven teaching methods.',
                                gradient: 'from-blue-50 to-indigo-50',
                                border: 'border-blue-100',
                            },
                            {
                                icon: '⚡',
                                title: 'Learn at Your Pace',
                                description: 'Access courses anytime, anywhere. Pause, rewind, and revisit lessons whenever you need to.',
                                gradient: 'from-amber-50 to-orange-50',
                                border: 'border-amber-100',
                            },
                            {
                                icon: '🛠️',
                                title: 'Hands-on Projects',
                                description: 'Build real projects as you learn. Apply your knowledge with practical, portfolio-worthy exercises.',
                                gradient: 'from-green-50 to-emerald-50',
                                border: 'border-green-100',
                            },
                            {
                                icon: '🎓',
                                title: 'Certificates',
                                description: 'Earn recognized certificates upon course completion to showcase your skills to employers.',
                                gradient: 'from-purple-50 to-violet-50',
                                border: 'border-purple-100',
                            },
                            {
                                icon: '💬',
                                title: 'Community Support',
                                description: 'Join a thriving community of learners. Get help, share knowledge, and grow together.',
                                gradient: 'from-pink-50 to-rose-50',
                                border: 'border-pink-100',
                            },
                            {
                                icon: '♾️',
                                title: 'Lifetime Access',
                                description: 'Once enrolled, access your courses forever. Including all future updates and new content.',
                                gradient: 'from-cyan-50 to-teal-50',
                                border: 'border-cyan-100',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group bg-gradient-to-br ${feature.gradient} border ${feature.border} rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}
                            >
                                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ STATS SECTION ============ */}
            <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '100+', label: 'Expert Courses', icon: FiBookOpen },
                            { value: '5,000+', label: 'Active Students', icon: FiUsers },
                            { value: '50+', label: 'Expert Instructors', icon: FiAward },
                            { value: '1,000+', label: 'Video Lessons', icon: FiPlay },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="text-white text-2xl" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-primary-200 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA SECTION ============ */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 rounded-3xl p-12 sm:p-16 text-center overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

                        <div className="relative">
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                Ready to Start Your
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                                    Learning Journey?
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                                Join thousands of learners already building their future on LearnHub.
                                Start with a free account today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register"
                                    className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl">
                                    Create Free Account
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/courses"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;