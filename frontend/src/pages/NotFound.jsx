import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all">
                    <FiHome />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;