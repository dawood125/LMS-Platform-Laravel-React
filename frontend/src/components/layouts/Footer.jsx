import { Link } from 'react-router-dom';
import { FiBookOpen, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             
                <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <FiBookOpen className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Learn<span className="text-indigo-400">Hub</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            A modern learning platform built with Laravel & React.
                            Learn, teach, and grow together.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/courses" className="text-sm hover:text-indigo-400 transition-colors">
                                    Browse Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/instructor/courses/create" className="text-sm hover:text-indigo-400 transition-colors">
                                    Teach on LearnHub
                                </Link>
                            </li>
                            <li>
                                <Link to="/student/enrollments" className="text-sm hover:text-indigo-400 transition-colors">
                                    My Learning
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
                        <div className="flex gap-3">
                            <a href="https://github.com/dawood125" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FiGithub className="text-lg" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FiLinkedin className="text-lg" />
                            </a>
                            <a href="mailto:contact@learnhub.com"
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <FiMail className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs">
                        © {new Date().getFullYear()} LearnHub. Built by Dawood.
                    </p>
                    <p className="text-xs">
                        Made with <span className="text-red-400">♥</span> using Laravel & React
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;