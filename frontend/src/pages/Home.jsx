import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiUsers, FiAward, FiPlay } from 'react-icons/fi';

const Home = () => {
    return (
        <div>
            <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-white/90 text-sm font-medium">Platform is Live — Start Learning Today</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Learn Without
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                                Limits
                            </span>
                        </h1>

                        <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Access high-quality courses from expert instructors. Build real-world skills
                            and advance your career at your own pace.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/courses"
                                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg shadow-indigo-900/20">
                                Browse Courses
                                <FiArrowRight />
                            </Link>
                            <Link to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200">
                                <FiPlay />
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: FiBookOpen, value: '100+', label: 'Courses' },
                            { icon: FiUsers, value: '5,000+', label: 'Students' },
                            { icon: FiAward, value: '50+', label: 'Instructors' },
                            { icon: FiPlay, value: '1,000+', label: 'Video Lessons' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="text-indigo-600 text-xl" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose LearnHub?
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Everything you need to learn new skills and advance your career
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Expert Instructors',
                                description: 'Learn from industry professionals with real-world experience and proven teaching methods.',
                                icon: '👨‍🏫',
                                color: 'bg-blue-50 border-blue-100',
                            },
                            {
                                title: 'Learn at Your Pace',
                                description: 'Access courses anytime, anywhere. Pause, rewind, and revisit lessons whenever you need.',
                                icon: '⏰',
                                color: 'bg-green-50 border-green-100',
                            },
                            {
                                title: 'Hands-on Projects',
                                description: 'Build real projects as you learn. Apply your knowledge with practical exercises.',
                                icon: '🛠️',
                                color: 'bg-purple-50 border-purple-100',
                            },
                        ].map((feature, index) => (
                            <div key={index}
                                className={`${feature.color} border rounded-2xl p-8 hover:shadow-lg transition-all duration-300`}>
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Join thousands of learners already building their future on LearnHub.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register"
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200">
                            Create Free Account
                            <FiArrowRight />
                        </Link>
                        <Link to="/courses"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200">
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;