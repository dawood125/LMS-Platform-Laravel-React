import { useEffect, useMemo, useState } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import courseService from '../../services/courseService';
import CourseCard from '../../components/ui/CourseCard';

const parseCsv = (value) => {
    if (!value) {
        return [];
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const CourseList = () => {
    const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const [keyword, setKeyword] = useState(initialParams.get('keyword') || '');
    const [debouncedKeyword, setDebouncedKeyword] = useState(initialParams.get('keyword') || '');
    const [selectedCategories, setSelectedCategories] = useState(parseCsv(initialParams.get('category')));
    const [selectedLevels, setSelectedLevels] = useState(parseCsv(initialParams.get('level')));
    const [selectedLanguages, setSelectedLanguages] = useState(parseCsv(initialParams.get('language')));
    const [sort, setSort] = useState((initialParams.get('sort') || 'desc').toLowerCase());
    const [currentPage, setCurrentPage] = useState(Number(initialParams.get('page') || 1));

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        from: 0,
        to: 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword.trim());
            setCurrentPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        const query = new URLSearchParams();

        if (debouncedKeyword) {
            query.set('keyword', debouncedKeyword);
        }
        if (selectedCategories.length > 0) {
            query.set('category', selectedCategories.join(','));
        }
        if (selectedLevels.length > 0) {
            query.set('level', selectedLevels.join(','));
        }
        if (selectedLanguages.length > 0) {
            query.set('language', selectedLanguages.join(','));
        }
        if (sort && sort !== 'desc') {
            query.set('sort', sort);
        }
        if (currentPage > 1) {
            query.set('page', String(currentPage));
        }

        const queryString = query.toString();
        const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        window.history.replaceState(null, '', nextUrl);
    }, [debouncedKeyword, selectedCategories, selectedLevels, selectedLanguages, sort, currentPage]);

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [categoriesRes, levelsRes, languagesRes] = await Promise.all([
                    courseService.getCategories(),
                    courseService.getLevels(),
                    courseService.getLanguages(),
                ]);

                setCategories(categoriesRes?.data?.data || []);
                setLevels(levelsRes?.data?.data || []);
                setLanguages(languagesRes?.data?.data || []);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load filters.');
            } finally {
                setFilterLoading(false);
            }
        };

        loadFilters();
    }, []);

    useEffect(() => {
        const loadCourses = async () => {
            setLoading(true);
            setError('');

            try {
                const params = {
                    page: currentPage,
                    sort,
                };

                if (debouncedKeyword) {
                    params.keyword = debouncedKeyword;
                }
                if (selectedCategories.length > 0) {
                    params.category = selectedCategories.join(',');
                }
                if (selectedLevels.length > 0) {
                    params.level = selectedLevels.join(',');
                }
                if (selectedLanguages.length > 0) {
                    params.language = selectedLanguages.join(',');
                }

                const response = await courseService.getCourses(params);
                const pageData = response?.data?.data || {};

                setCourses(pageData.data || []);
                setPagination({
                    current_page: pageData.current_page || 1,
                    last_page: pageData.last_page || 1,
                    total: pageData.total || 0,
                    from: pageData.from || 0,
                    to: pageData.to || 0,
                });
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load courses.');
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, [debouncedKeyword, selectedCategories, selectedLevels, selectedLanguages, sort, currentPage]);

    const toggleItem = (value, selected, setter) => {
        setCurrentPage(1);
        setter(
            selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value]
        );
    };

    const clearFilters = () => {
        setKeyword('');
        setDebouncedKeyword('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setSort('desc');
        setCurrentPage(1);
    };

    const activeFilterCount =
        (debouncedKeyword ? 1 : 0) +
        selectedCategories.length +
        selectedLevels.length +
        selectedLanguages.length +
        (sort !== 'desc' ? 1 : 0);

    const pageNumbers = useMemo(() => {
        const last = pagination.last_page;
        const current = pagination.current_page;

        if (last <= 7) {
            return Array.from({ length: last }, (_, i) => i + 1);
        }

        const pages = new Set([1, last, current - 1, current, current + 1]);
        return Array.from(pages)
            .filter((page) => page >= 1 && page <= last)
            .sort((a, b) => a - b);
    }, [pagination.current_page, pagination.last_page]);

    const FilterSection = ({ title, items, selected, onToggle }) => (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => {
                    const value = String(item.id);
                    const checked = selected.includes(value);

                    return (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={checked}
                                onChange={() => onToggle(value)}
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">{item.name}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary-50 via-white to-amber-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="mb-8 sm:mb-10">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                        <FiFilter size={14} />
                        Smart Discovery
                    </p>
                    <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-gray-900">
                        Explore Courses That Fit Your Goals
                    </h1>
                    <p className="mt-3 text-gray-600 max-w-2xl">
                        Search by keyword, then narrow by category, level, and language. Results are powered by live backend filters.
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-5">
                    <button
                        type="button"
                        className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                    >
                        <FiFilter size={16} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="rounded-full bg-primary-600 text-white text-xs px-2 py-0.5">{activeFilterCount}</span>
                        )}
                    </button>

                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search course titles..."
                            className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        />
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                            onClick={clearFilters}
                        >
                            <FiX size={16} />
                            Reset
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-1 space-y-4`}>
                        {filterLoading ? (
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500">Loading filters...</div>
                        ) : (
                            <>
                                <FilterSection
                                    title="Categories"
                                    items={categories}
                                    selected={selectedCategories}
                                    onToggle={(value) => toggleItem(value, selectedCategories, setSelectedCategories)}
                                />
                                <FilterSection
                                    title="Levels"
                                    items={levels}
                                    selected={selectedLevels}
                                    onToggle={(value) => toggleItem(value, selectedLevels, setSelectedLevels)}
                                />
                                <FilterSection
                                    title="Languages"
                                    items={languages}
                                    selected={selectedLanguages}
                                    onToggle={(value) => toggleItem(value, selectedLanguages, setSelectedLanguages)}
                                />
                            </>
                        )}
                    </aside>

                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Showing {pagination.from || 0}-{pagination.to || 0} of {pagination.total || 0} courses
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                                <h3 className="text-xl font-semibold text-gray-900">No courses found</h3>
                                <p className="mt-2 text-gray-500">Try removing some filters or searching with a different keyword.</p>
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {courses.map((course, index) => (
                                        <CourseCard key={course.id} course={course} index={index % 6} />
                                    ))}
                                </div>

                                {pagination.last_page > 1 && (
                                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            disabled={pagination.current_page <= 1}
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-50"
                                        >
                                            Prev
                                        </button>

                                        {pageNumbers.map((page, idx) => {
                                            const previous = pageNumbers[idx - 1];
                                            const showGap = previous && page - previous > 1;

                                            return (
                                                <span key={page} className="inline-flex items-center gap-2">
                                                    {showGap && <span className="px-2 text-gray-400">...</span>}
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`rounded-lg px-3 py-2 text-sm border ${
                                                            page === pagination.current_page
                                                                ? 'bg-primary-600 border-primary-600 text-white'
                                                                : 'bg-white border-gray-200 text-gray-700'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </span>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            disabled={pagination.current_page >= pagination.last_page}
                                            onClick={() => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1))}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseList;