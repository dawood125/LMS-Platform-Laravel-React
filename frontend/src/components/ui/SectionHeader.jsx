import { motion } from 'framer-motion';

const SectionHeader = ({ subtitle, title, description, align = 'center' }) => {
    const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`max-w-2xl mb-12 ${alignClass}`}
        >
            {subtitle && (
                <span className="inline-block bg-primary-50 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                    {subtitle}
                </span>
            )}
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {title}
            </h2>
            {description && (
                <p className="text-gray-500 text-lg leading-relaxed">
                    {description}
                </p>
            )}
        </motion.div>
    );
};

export default SectionHeader;