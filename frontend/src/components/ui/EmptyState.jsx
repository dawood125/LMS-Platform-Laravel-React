import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const EmptyState = ({
    icon = '📚',
    title = 'Nothing found',
    description = 'Try adjusting your search or filters',
    actionText,
    actionLink,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-4"
        >
            <div className="text-6xl mb-6">{icon}</div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{description}</p>
            {actionText && actionLink && (
                <Link
                    to={actionLink}
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
                >
                    {actionText}
                    <FiArrowRight />
                </Link>
            )}
        </motion.div>
    );
};

export default EmptyState;