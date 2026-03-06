import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(formData);
        setIsLoading(false);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex">

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200"
                        >
                            <FiBookOpen className="text-white text-2xl" />
                        </motion.div>
                        <h1 className="font-display text-3xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-gray-500 mt-2">Sign in to continue your learning journey</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative group">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 focus:ring-4 focus:ring-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Quick Login for Testing */}
                        <button
                            type="button"
                            onClick={() => setFormData({ email: 'dawood@test.com', password: 'password' })}
                            className="w-full py-3 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300"
                        >
                            Use Demo Account
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-8 text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px',
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative text-center text-white max-w-md"
                >
                    <h2 className="font-display text-4xl font-bold mb-6 leading-tight">
                        Continue Building
                        <span className="block text-primary-200">Your Skills</span>
                    </h2>
                    <p className="text-primary-100 text-lg leading-relaxed mb-10">
                        Access your enrolled courses, track your progress, and pick up right where you left off.
                    </p>

                    <div className="space-y-4">
                        {[
                            { text: 'Resume your courses instantly', icon: '▶️' },
                            { text: 'Track your learning progress', icon: '📊' },
                            { text: 'Earn certificates of completion', icon: '🎓' },
                            { text: 'Access on any device', icon: '📱' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-sm font-medium text-left">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;