import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim().length < 3) {
            toast.error('Title must be at least 3 characters');
            return;
        }

        setIsLoading(true);
        try {
            const response = await courseService.createCourse({ title: title.trim() });
            const courseId = response.data.data.id;
            toast.success('Course created! Now add details.');
            navigate(`/instructor/courses/${courseId}/edit`);
        } catch (error) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error('Failed to create course');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg"
            >
                {/* Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200">
                        <FiBookOpen className="text-white text-3xl" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Start with a title. You can add all the details, chapters, lessons, and content in the next step.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Complete React Masterclass 2025"
                                required
                                autoFocus
                                className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl text-base focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all duration-300"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Choose a clear, descriptive title that tells students what they'll learn
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || title.trim().length < 3}
                            className="group w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 focus:ring-4 focus:ring-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating course...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create & Continue
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Steps Preview */}
                <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
                    <p className="text-sm font-semibold text-gray-900 mb-4">What's next after creating?</p>
                    <div className="space-y-3">
                        {[
                            { step: '1', text: 'Add course details (category, price, description)', active: true },
                            { step: '2', text: 'Upload course thumbnail image' },
                            { step: '3', text: 'Add what students will learn (outcomes)' },
                            { step: '4', text: 'Add requirements' },
                            { step: '5', text: 'Create chapters and lessons' },
                            { step: '6', text: 'Upload lesson videos' },
                            { step: '7', text: 'Publish your course!' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    item.active
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {item.step}
                                </span>
                                <span className={`text-sm ${item.active ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateCourse;