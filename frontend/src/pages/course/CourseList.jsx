import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import courseService from '../../services/courseService';
import CourseCard from '../../components/ui/CourseCard';
import CourseCardSkeleton from '../../components/ui/CourseCardSkeleton';
import EmptyState from '../../components/ui/EmptyState';

const CourseList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states from URL
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('category') ? searchParams.get('category').split(',') : []
    );
    const [selectedLevels, setSelectedLevels] = useState(
        searchParams.get('level') ? searchParams.get('level').split(',') : []
    );
    const [selectedLanguages, setSelectedLanguages] = useState(
        searchParams.get('language') ? searchParams.get('language').split(',') : []
    );
    const [sort, setSort] = useState(searchParams.get('sort') || 'desc');

    // Fetch filter data on mount
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [catRes, levRes, langRes] = await Promise.all([
                    courseService.getCategories(),
                    courseService.getLevels(),
                    courseService.getLanguages(),
                ]);
                setCategories(catRes.data.data || []);
                setLevels(levRes.data.data || []);
                setLanguages(langRes.data.data || []);
            } catch (error) {
                console.error('Failed to fetch filter data:', error);
            }
        };
        fetchFilterData();
    }, []);

    // Fetch courses when filters change
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {};
                if (keyword) params.keyword = keyword;
                if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
                if (selectedLevels.length > 0) params.level = selectedLevels.join(',');
                if (selectedLanguages.length > 0) params.language = selectedLanguages.join(',');
                params.sort = sort;

                // Update URL
                const newParams = new URLSearchParams();
                if (keyword) newParams.set('keyword', keyword);
                if (selectedCategories.length > 0) newParams.set('category', selectedCategories.join(','));
                if (selectedLevels.length > 0) newParams.set('level', selectedLevels.join(','));
                if (selectedLanguages.length > 0) newParams.set('language', selectedLanguages.join(','));
                if (sort !== 'desc') newParams.set('sort', sort);
                setSearchParams(newParams, { replace: true });

                const response = await courseService.getCourses(params);
                console.log("API RESPONSE:", response.data);
                setCourses(response.data.data.data || []);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchCourses, 300);
        return () => clearTimeout(debounce);
    }, [keyword, selectedCategories, selectedLevels, selectedLanguages, sort]);

    // Toggle filter helpers
    const toggleCategory = (id) => {
        const strId = String(id);
        setSelectedCategories(prev =>
            prev.includes(strId) ? prev.filter(c => c !== strId) : [...prev, strId]
        );
    };

    const toggleLevel = (id) => {
        const strId = String(id);
        setSelectedLevels(prev =>
            prev.includes(strId) ? prev.filter(l => l !== strId) : [...prev, strId]
        );
    };

    const toggleLanguage = (id) => {
        const strId = String(id);
        setSelectedLanguages(prev =>
            prev.includes(strId) ? prev.filter(l => l !== strId) : [...prev, strId]
        );
    };

    const clearAllFilters = () => {
        setKeyword('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setSort('desc');
    };

    const activeFilterCount = selectedCategories.length + selectedLevels.length + selectedLanguages.length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Browse Courses
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Discover {courses.length} courses to boost your skills
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ============ SIDEBAR FILTERS (Desktop) ============ */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Search */}
                            <div>
                                <div className="relative">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="Search courses..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-white transition-all duration-300"
                                    />
                                    {keyword && (
                                        <button
                                            onClick={() => setKeyword('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Categories Filter */}
                            <FilterSection title="Category" items={categories} selected={selectedCategories} onToggle={toggleCategory} />

                            {/* Level Filter */}
                            <FilterSection title="Level" items={levels} selected={selectedLevels} onToggle={toggleLevel} />

                            {/* Language Filter */}
                            <FilterSection title="Language" items={languages} selected={selectedLanguages} onToggle={toggleLanguage} />

                            {/* Clear Filters */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Clear all filters ({activeFilterCount})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ============ MAIN CONTENT ============ */}
                    <div className="flex-1">
                        {/* Top Bar — Mobile Search + Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Mobile Search */}
                            <div className="relative flex-1 lg:hidden">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-white transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-3">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:border-primary-200 transition-colors"
                                >
                                    <FiFilter size={16} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="appearance-none bg-white border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 pl-4 pr-10 py-3 focus:outline-none focus:border-primary-500 cursor-pointer hover:border-primary-200 transition-colors"
                                    >
                                        <option value="desc">Newest First</option>
                                        <option value="asc">Oldest First</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters Panel */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden bg-white rounded-2xl border border-gray-100 p-6 mb-8 space-y-6"
                            >
                                <FilterSection title="Category" items={categories} selected={selectedCategories} onToggle={toggleCategory} />
                                <FilterSection title="Level" items={levels} selected={selectedLevels} onToggle={toggleLevel} />
                                <FilterSection title="Language" items={languages} selected={selectedLanguages} onToggle={toggleLanguage} />

                                <div className="flex gap-3">
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="flex-1 py-2.5 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="flex-1 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Active Filters Tags */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedCategories.map(id => {
                                    const cat = categories.find(c => String(c.id) === id);
                                    return cat ? (
                                        <span key={`cat-${id}`}
                                            className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-lg">
                                            {cat.name}
                                            <button onClick={() => toggleCategory(id)} className="hover:text-primary-900">
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                                {selectedLevels.map(id => {
                                    const lev = levels.find(l => String(l.id) === id);
                                    return lev ? (
                                        <span key={`lev-${id}`}
                                            className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-lg">
                                            {lev.name}
                                            <button onClick={() => toggleLevel(id)} className="hover:text-green-900">
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                                {selectedLanguages.map(id => {
                                    const lang = languages.find(l => String(l.id) === id);
                                    return lang ? (
                                        <span key={`lang-${id}`}
                                            className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium pl-3 pr-2 py-1.5 rounded-lg">
                                            {lang.name}
                                            <button onClick={() => toggleLanguage(id)} className="hover:text-purple-900">
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Course Grid */}
                        {loading ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <CourseCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {courses.map((course, index) => (
                                    <CourseCard key={course.id} course={course} index={index} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="🔍"
                                title="No courses found"
                                description="Try adjusting your search or filters to find what you're looking for"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============ FILTER SECTION COMPONENT ============
const FilterSection = ({ title, items, selected, onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <span className="flex items-center gap-2">
                    {title}
                    {selected.length > 0 && (
                        <span className="bg-primary-100 text-primary-700 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {selected.length}
                        </span>
                    )}
                </span>
                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="px-5 pb-4 space-y-1">
                    {items.map(item => (
                        <label
                            key={item.id}
                            className="flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(String(item.id))}
                                onChange={() => onToggle(item.id)}
                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600">{item.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;