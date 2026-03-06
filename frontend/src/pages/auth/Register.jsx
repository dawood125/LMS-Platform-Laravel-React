import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await register(formData);
        setIsLoading(false);
        if (success) navigate('/login');
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { width: '0%', color: 'bg-gray-200', text: '' };
        if (password.length < 4) return { width: '25%', color: 'bg-red-500', text: 'Weak' };
        if (password.length < 6) return { width: '50%', color: 'bg-orange-500', text: 'Fair' };
        if (password.length < 8) return { width: '75%', color: 'bg-yellow-500', text: 'Good' };
        return { width: '100%', color: 'bg-green-500', text: 'Strong' };
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-[calc(100vh-64px)] flex">

            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px',
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative text-center text-white max-w-md"
                >
                    <h2 className="font-display text-4xl font-bold mb-6 leading-tight">
                        Start Your
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-accent-400">
                            Learning Journey
                        </span>
                    </h2>
                    <p className="text-primary-100 text-lg leading-relaxed mb-10">
                        Create a free account and get instant access to hundreds of courses from expert instructors.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[
                            { value: '100+', label: 'Courses' },
                            { value: '50+', label: 'Instructors' },
                            { value: '5K+', label: 'Students' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                            >
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-primary-200 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {[
                            'Free access to starter courses',
                            'Create and sell your own courses',
                            'Track progress with dashboard',
                            'Join community discussions',
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                                className="flex items-center gap-3 text-left"
                            >
                                <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-400 text-xs">✓</span>
                                </div>
                                <span className="text-sm text-primary-100">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
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
                        <h1 className="font-display text-3xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-gray-500 mt-2">Start learning for free today</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>

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
                                        placeholder="Min 6 characters"
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

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-3">
                                                <div
                                                    className={`h-full ${strength.color} rounded-full transition-all duration-500`}
                                                    style={{ width: strength.width }}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium ${strength.color === 'bg-green-500' ? 'text-green-600' : strength.color === 'bg-yellow-500' ? 'text-yellow-600' : strength.color === 'bg-orange-500' ? 'text-orange-600' : 'text-red-600'}`}>
                                                {strength.text}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Repeat your password"
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all duration-300"
                                    />
                                </div>
                                {formData.password_confirmation && formData.password !== formData.password_confirmation && (
                                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                        <span>⚠</span> Passwords don't match
                                    </p>
                                )}
                                {formData.password_confirmation && formData.password === formData.password_confirmation && (
                                    <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                                        <span>✓</span> Passwords match
                                    </p>
                                )}
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
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create Account
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-8 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;