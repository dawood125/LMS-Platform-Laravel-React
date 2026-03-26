import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft, FiPlay, FiCheck, FiChevronDown, FiChevronUp,
    FiBookOpen, FiClock, FiCheckCircle, FiLock, FiMenu, FiX
} from 'react-icons/fi';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';

const WatchCourse = () => {
    const { id } = useParams();
    const videoRef = useRef(null);

    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState(0);
    const [expandedChapters, setExpandedChapters] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch course data
    useEffect(() => {
        const fetchCourseAccess = async () => {
            try {
                const response = await courseService.getCourseAccess(id);
                const courseData = response.data.data;
                const activeLessonData = response.data.active_lesson;

                setCourse(courseData);
                setActiveLesson(activeLessonData);

                // Expand the chapter that contains active lesson
                if (activeLessonData && courseData.chapters) {
                    const activeChapter = courseData.chapters.find(ch =>
                        ch.lessons?.some(l => l.id === activeLessonData.id)
                    );
                    if (activeChapter) {
                        setExpandedChapters({ [activeChapter.id]: true });
                    }
                }

                // Fetch completed lessons
                await fetchCompletedLessons(courseData);

            } catch (error) {
                if (error.response?.status === 404) {
                    toast.error('You are not enrolled in this course');
                } else {
                    toast.error('Failed to load course');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAccess();
    }, [id]);

    const fetchCompletedLessons = async (courseData) => {
        // We'll track completed lessons from activity data
        // For now, initialize empty - will update when user marks complete
        const allLessons = courseData.chapters?.flatMap(ch => ch.lessons || []) || [];
        const totalLessons = allLessons.length;
        setProgress(totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0);
    };

    const handleLessonClick = async (lesson, chapter) => {
        if (!lesson) return;

        setActiveLesson(lesson);
        setSidebarOpen(false);

        // Expand the chapter
        setExpandedChapters(prev => ({ ...prev, [chapter.id]: true }));

        // Update activity on backend
        try {
            const response = await courseService.updateActivity({
                course_id: parseInt(id),
                lesson_id: lesson.id,
                chapter_id: chapter.id,
            });

            if (response.data.data) {
                setProgress(response.data.data.progress || 0);
                setCompletedLessons(prev => {
                    // Don't add duplicates
                    if (!prev.includes(lesson.id)) return prev;
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to update activity:', error);
        }
    };

    const handleMarkComplete = async () => {
        if (!activeLesson) return;

        const chapter = course.chapters?.find(ch =>
            ch.lessons?.some(l => l.id === activeLesson.id)
        );

        if (!chapter) return;

        try {
            const isAlreadyCompleted = completedLessons.includes(activeLesson.id);
            const newStatus = isAlreadyCompleted ? 'no' : 'yes';

            const response = await courseService.updateActivity({
                course_id: parseInt(id),
                lesson_id: activeLesson.id,
                chapter_id: chapter.id,
                is_completed: newStatus,
            });

            if (response.data.data) {
                setProgress(response.data.data.progress || 0);

                if (newStatus === 'yes') {
                    setCompletedLessons(prev => [...prev, activeLesson.id]);
                    toast.success('Lesson marked as complete! 🎉');
                } else {
                    setCompletedLessons(prev => prev.filter(id => id !== activeLesson.id));
                    toast.success('Lesson marked as incomplete');
                }
            }
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    const getVideoUrl = () => {
        if (!activeLesson?.video) return null;
        if (activeLesson.video.startsWith('http')) return activeLesson.video;
        return `http://localhost:8000/${activeLesson.video}`;
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        if (minutes < 60) return `${minutes}m`;
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    };

    if (loading) return <WatchCourseSkeleton />;
    if (!course) return null;

    const allLessons = course.chapters?.flatMap(ch => ch.lessons || []) || [];
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
    const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1
        ? { lesson: allLessons[currentIndex + 1], chapter: course.chapters.find(ch => ch.lessons?.some(l => l.id === allLessons[currentIndex + 1]?.id)) }
        : null;
    const prevLesson = currentIndex > 0
        ? { lesson: allLessons[currentIndex - 1], chapter: course.chapters.find(ch => ch.lessons?.some(l => l.id === allLessons[currentIndex - 1]?.id)) }
        : null;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            {/* Top Bar */}
            <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/student/enrollments"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div className="hidden sm:block">
                        <h1 className="text-white font-semibold text-sm line-clamp-1">{course.title}</h1>
                        <p className="text-gray-500 text-xs mt-0.5">
                            {progress}% complete • {allLessons.length} lessons
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Progress Bar */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-gray-400 text-xs font-medium">{progress}%</span>
                    </div>

                    {/* Mobile Sidebar Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* ===== VIDEO AREA ===== */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Video Player */}
                    <div className="bg-black aspect-video w-full flex items-center justify-center relative">
                        {getVideoUrl() ? (
                            <video
                                ref={videoRef}
                                key={activeLesson?.id}
                                src={getVideoUrl()}
                                controls
                                autoPlay
                                className="w-full h-full"
                            >
                                Your browser does not support video playback.
                            </video>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiPlay className="text-gray-500 text-3xl ml-1" />
                                </div>
                                <p className="text-gray-400 text-lg font-medium">
                                    {activeLesson ? 'No video available for this lesson' : 'Select a lesson to start'}
                                </p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Video content will appear here
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Info Area */}
                    <div className="bg-gray-900 p-6">
                        <div className="max-w-4xl">
                            {/* Lesson Title + Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h2 className="text-white font-display text-xl sm:text-2xl font-bold mb-2">
                                        {activeLesson?.title || 'No lesson selected'}
                                    </h2>
                                    {activeLesson?.duration > 0 && (
                                        <span className="text-gray-500 text-sm flex items-center gap-1.5">
                                            <FiClock size={14} />
                                            {activeLesson.duration} minutes
                                        </span>
                                    )}
                                </div>

                                {activeLesson && (
                                    <button
                                        onClick={handleMarkComplete}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                                            completedLessons.includes(activeLesson.id)
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        {completedLessons.includes(activeLesson.id) ? (
                                            <>
                                                <FiCheckCircle size={16} />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck size={16} />
                                                Mark Complete
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-3">
                                {prevLesson && (
                                    <button
                                        onClick={() => handleLessonClick(prevLesson.lesson, prevLesson.chapter)}
                                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                {nextLesson && (
                                    <button
                                        onClick={() => handleLessonClick(nextLesson.lesson, nextLesson.chapter)}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                                    >
                                        Next Lesson →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== SIDEBAR ===== */}
                <div className={`
                    fixed lg:relative inset-y-0 right-0 z-40 w-80 xl:w-96
                    bg-gray-900 border-l border-gray-800
                    transform transition-transform duration-300 lg:transform-none
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    overflow-y-auto
                `}>
                    {/* Sidebar Header */}
                    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4 z-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold text-sm">Course Content</h3>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1 text-gray-400 hover:text-white"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        {/* Mini Progress */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-gray-500 text-xs">{progress}%</span>
                        </div>
                    </div>

                    {/* Chapter List */}
                    <div className="divide-y divide-gray-800">
                        {course.chapters?.map((chapter, chapterIndex) => (
                            <div key={chapter.id}>
                                {/* Chapter Header */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <span className="w-7 h-7 bg-gray-800 text-gray-400 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {chapterIndex + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-gray-200 text-sm font-medium line-clamp-1">
                                                {chapter.title}
                                            </h4>
                                            <p className="text-gray-600 text-xs mt-0.5">
                                                {chapter.lessons?.length || 0} lessons
                                                {chapter.lessons_sum_duration > 0 && ` • ${formatDuration(chapter.lessons_sum_duration)}`}
                                            </p>
                                        </div>
                                    </div>
                                    {expandedChapters[chapter.id]
                                        ? <FiChevronUp className="text-gray-600" size={16} />
                                        : <FiChevronDown className="text-gray-600" size={16} />
                                    }
                                </button>

                                {/* Lessons */}
                                {expandedChapters[chapter.id] && (
                                    <div className="bg-gray-900/50">
                                        {chapter.lessons?.map((lesson) => {
                                            const isActive = activeLesson?.id === lesson.id;
                                            const isCompleted = completedLessons.includes(lesson.id);

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => handleLessonClick(lesson, chapter)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                        isActive
                                                            ? 'bg-primary-600/10 border-l-2 border-primary-500'
                                                            : 'hover:bg-gray-800/50 border-l-2 border-transparent'
                                                    }`}
                                                >
                                                    {/* Icon */}
                                                    <div className="flex-shrink-0">
                                                        {isCompleted ? (
                                                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                                                <FiCheck className="text-green-400" size={12} />
                                                            </div>
                                                        ) : isActive ? (
                                                            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                                                                <FiPlay className="text-primary-400 ml-0.5" size={10} />
                                                            </div>
                                                        ) : (
                                                            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                                                                <FiPlay className="text-gray-500 ml-0.5" size={10} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Lesson Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm line-clamp-1 ${
                                                            isActive ? 'text-primary-400 font-medium' : 'text-gray-400'
                                                        }`}>
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            {lesson.duration > 0 ? `${lesson.duration}m` : 'No duration'}
                                                            {!lesson.video && ' • No video'}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

// Skeleton
const WatchCourseSkeleton = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
            <div className="h-5 bg-gray-800 rounded w-48 animate-pulse" />
        </div>
        <div className="flex-1 flex">
            <div className="flex-1">
                <div className="aspect-video bg-gray-800 animate-pulse" />
                <div className="p-6 space-y-4 animate-pulse">
                    <div className="h-7 bg-gray-800 rounded-lg w-2/3" />
                    <div className="h-4 bg-gray-800 rounded w-24" />
                </div>
            </div>
            <div className="hidden lg:block w-80 border-l border-gray-800">
                <div className="p-4 space-y-4 animate-pulse">
                    <div className="h-5 bg-gray-800 rounded w-32" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-800 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default WatchCourse;