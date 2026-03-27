import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiTrash2 } from 'react-icons/fi';
import StarRating from './StarRating';
import courseService from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ReviewSection = ({ courseId }) => {
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [ratingBreakdown, setRatingBreakdown] = useState({});
    const [loading, setLoading] = useState(true);

    // Review form
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [userReview, setUserReview] = useState(null);

    useEffect(() => {
        fetchReviews();
        if (isAuthenticated) fetchUserReview();
    }, [courseId, isAuthenticated]);

    const fetchReviews = async () => {
        try {
            const response = await courseService.getReviews(courseId);
            const data = response.data.data;
            setReviews(data.reviews || []);
            setAverageRating(data.average_rating || 0);
            setTotalReviews(data.total_reviews || 0);
            setRatingBreakdown(data.rating_breakdown || {});
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReview = async () => {
        try {
            const response = await courseService.getUserReview(courseId);
            if (response.data.data) {
                setUserReview(response.data.data);
                setRating(response.data.data.rating);
                setComment(response.data.data.comment || '');
            }
        } catch (error) {
            // No existing review - that's fine
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            const response = await courseService.submitReview({
                course_id: parseInt(courseId),
                rating,
                comment: comment.trim() || null,
            });

            toast.success(userReview ? 'Review updated!' : 'Review submitted! 🎉');
            setUserReview(response.data.data);
            setShowForm(false);
            fetchReviews();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit review';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview || !window.confirm('Delete your review?')) return;

        try {
            await courseService.deleteReview(userReview.id);
            setUserReview(null);
            setRating(0);
            setComment('');
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 mt-10">Student Reviews</h2>

            {/* Rating Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
                <div className="flex flex-col sm:flex-row gap-8">
                    {/* Average */}
                    <div className="text-center sm:text-left">
                        <div className="text-5xl font-display font-extrabold text-gray-900 mb-2">
                            {averageRating}
                        </div>
                        <StarRating rating={Math.round(averageRating)} readonly size={20} />
                        <p className="text-sm text-gray-500 mt-2">{totalReviews} reviews</p>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                            const data = ratingBreakdown[star] || { count: 0, percentage: 0 };
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 w-6">{star}</span>
                                    <FiStar size={14} className="text-amber-400" fill="currentColor" />
                                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                            style={{ width: `${data.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-400 w-8 text-right">{data.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Write Review Button */}
                {isAuthenticated && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        {userReview && !showForm ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <StarRating rating={userReview.rating} readonly size={16} />
                                    <span className="text-sm text-gray-600">Your review</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDeleteReview}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : !showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                            >
                                Write a Review
                            </button>
                        ) : null}

                        {/* Review Form */}
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleSubmitReview}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                                    <StarRating rating={rating} onRate={setRating} size={28} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Review <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        placeholder="Share your experience with this course..."
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all resize-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0}
                                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </div>
                )}
            </div>

            {/* Review List */}
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-semibold">
                                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {review.user?.name || 'Anonymous'}
                                        </h4>
                                        <span className="text-xs text-gray-400">
                                            {getTimeAgo(review.created_at)}
                                        </span>
                                    </div>
                                    <StarRating rating={review.rating} readonly size={14} />
                                    {review.comment && (
                                        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                </div>
            )}
        </motion.section>
    );
};

export default ReviewSection;