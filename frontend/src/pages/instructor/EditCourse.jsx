import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft, FiSave, FiImage, FiBookOpen, FiList,
    FiCheckCircle, FiTarget, FiLayers, FiPlay, FiPlus,
    FiEdit3, FiTrash2, FiUpload, FiX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('details');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Course data
    const [course, setCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '', category_id: '', level_id: '', language_id: '',
        description: '', price: '', cross_price: '',
    });

    // Metadata
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

    // Sub-sections
    const [outcomes, setOutcomes] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [chapters, setChapters] = useState([]);

    // New item inputs
    const [newOutcome, setNewOutcome] = useState('');
    const [newRequirement, setNewRequirement] = useState('');
    const [newChapterTitle, setNewChapterTitle] = useState('');

    // Expanded chapters
    const [expandedChapters, setExpandedChapters] = useState({});

    useEffect(() => {
    const fetchData = async () => {
        try {
            const [courseRes, metaRes] = await Promise.all([
                courseService.getCourse(id),
                courseService.getMetaData(),
            ]);

            const courseData = courseRes.data.data;
            setCourse(courseData);
            setFormData({
                title: courseData.title || '',
                category_id: courseData.category_id || '',
                level_id: courseData.level_id || '',
                language_id: courseData.language_id || '',
                description: courseData.description || '',
                price: courseData.price || '',
                cross_price: courseData.cross_price || '',
            });

            setCategories(metaRes.data.categories || []);
            setLevels(metaRes.data.levels || []);
            setLanguages(metaRes.data.languages || []);

            // Set chapters from course data (already includes lessons)
            setChapters(courseData.chapters || []);

            // Fetch outcomes and requirements separately
            const [outRes, reqRes] = await Promise.all([
                courseService.getOutcomes(id),
                courseService.getRequirements(id),
            ]);

            setOutcomes(outRes.data.data || []);
            setRequirements(reqRes.data.data || []);

            // Expand first chapter
            if (courseData.chapters?.length > 0) {
                setExpandedChapters({ [courseData.chapters[0].id]: true });
            }

        } catch (error) {
            toast.error('Failed to load course');
            navigate('/instructor/courses');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [id]);

    // ===== HANDLERS =====

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await courseService.updateCourse(id, formData);
            setCourse(response.data.data);
            toast.success('Course details saved!');
        } catch (error) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error('Failed to save');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('image', file);

        try {
            const response = await courseService.saveCourseImage(id, data);
            setCourse(response.data.data);
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    // Outcomes
    const handleAddOutcome = async () => {
        if (!newOutcome.trim()) return;
        try {
            const response = await courseService.createOutcome({ course_id: parseInt(id), outcome: newOutcome.trim() });
            setOutcomes(prev => [...prev, response.data.data]);
            setNewOutcome('');
            toast.success('Outcome added');
        } catch (error) {
            toast.error('Failed to add outcome');
        }
    };

    const handleDeleteOutcome = async (outcomeId) => {
        try {
            await courseService.deleteOutcome(outcomeId);
            setOutcomes(prev => prev.filter(o => o.id !== outcomeId));
            toast.success('Outcome removed');
        } catch (error) {
            toast.error('Failed to remove outcome');
        }
    };

    // Requirements
    const handleAddRequirement = async () => {
        if (!newRequirement.trim()) return;
        try {
            const response = await courseService.createRequirement({ course_id: parseInt(id), requirement: newRequirement.trim() });
            setRequirements(prev => [...prev, response.data.data]);
            setNewRequirement('');
            toast.success('Requirement added');
        } catch (error) {
            toast.error('Failed to add requirement');
        }
    };

    const handleDeleteRequirement = async (reqId) => {
        try {
            await courseService.deleteRequirement(reqId);
            setRequirements(prev => prev.filter(r => r.id !== reqId));
            toast.success('Requirement removed');
        } catch (error) {
            toast.error('Failed to remove requirement');
        }
    };

    // Chapters
    const handleAddChapter = async () => {
        if (!newChapterTitle.trim()) return;
        try {
            const response = await courseService.createChapter({ course_id: parseInt(id), title: newChapterTitle.trim() });
            setChapters(prev => [...prev, { ...response.data.data, lessons: [] }]);
            setNewChapterTitle('');
            toast.success('Chapter added');
        } catch (error) {
            toast.error('Failed to add chapter');
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm('Delete this chapter and all its lessons?')) return;
        try {
            await courseService.deleteChapter(chapterId);
            setChapters(prev => prev.filter(c => c.id !== chapterId));
            toast.success('Chapter deleted');
        } catch (error) {
            toast.error('Failed to delete chapter');
        }
    };

    // Lessons
    const handleAddLesson = async (chapterId) => {
        const title = prompt('Enter lesson title:');
        if (!title?.trim()) return;

        try {
            const response = await courseService.createLesson({ chapter_id: chapterId, title: title.trim() });
            setChapters(prev => prev.map(ch =>
                ch.id === chapterId
                    ? { ...ch, lessons: [...(ch.lessons || []), response.data.data] }
                    : ch
            ));
            toast.success('Lesson added');
        } catch (error) {
            toast.error('Failed to add lesson');
        }
    };

    const handleDeleteLesson = async (chapterId, lessonId) => {
        try {
            await courseService.deleteLesson(lessonId);
            setChapters(prev => prev.map(ch =>
                ch.id === chapterId
                    ? { ...ch, lessons: (ch.lessons || []).filter(l => l.id !== lessonId) }
                    : ch
            ));
            toast.success('Lesson deleted');
        } catch (error) {
            toast.error('Failed to delete lesson');
        }
    };

    const handleVideoUpload = async (lessonId, chapterId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('video', file);

        const uploadToast = toast.loading('Uploading video...');
        try {
            const response = await courseService.saveLessonVideo(lessonId, data);
            setChapters(prev => prev.map(ch =>
                ch.id === chapterId
                    ? {
                        ...ch,
                        lessons: (ch.lessons || []).map(l =>
                            l.id === lessonId ? { ...l, video: response.data.data.video } : l
                        )
                    }
                    : ch
            ));
            toast.success('Video uploaded!', { id: uploadToast });
        } catch (error) {
            toast.error('Failed to upload video', { id: uploadToast });
        }
    };

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    const getImageUrl = () => {
        if (!course?.image) return null;
        if (course.image.startsWith('http')) return course.image;
        return `http://localhost:8000/${course.image}`;
    };

    const tabs = [
        { id: 'details', label: 'Details', icon: FiBookOpen },
        { id: 'image', label: 'Image', icon: FiImage },
        { id: 'outcomes', label: 'Outcomes', icon: FiTarget },
        { id: 'requirements', label: 'Requirements', icon: FiCheckCircle },
        { id: 'curriculum', label: 'Curriculum', icon: FiLayers },
    ];

    if (loading) return <EditCourseSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Link to="/instructor/courses"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="font-display text-lg font-bold text-gray-900 line-clamp-1">
                                    {course?.title}
                                </h1>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    course?.status === 1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {course?.status === 1 ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>

                        <Link to={`/courses/${id}`}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Preview Course
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-px -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ===== DETAILS TAB ===== */}
                {activeTab === 'details' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Course Details</h2>
                            <form onSubmit={handleSaveDetails} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input type="text" value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all"
                                        required />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 focus:bg-white transition-all"
                                            required>
                                            <option value="">Select</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                                        <select value={formData.level_id}
                                            onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 focus:bg-white transition-all"
                                            required>
                                            <option value="">Select</option>
                                            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                                        <select value={formData.language_id}
                                            onChange={(e) => setFormData({ ...formData, language_id: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 focus:bg-white transition-all"
                                            required>
                                            <option value="">Select</option>
                                            {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all resize-none"
                                        required />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                        <input type="number" step="0.01" value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 focus:bg-white transition-all"
                                            required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price ($) <span className="text-gray-400 font-normal">optional</span></label>
                                        <input type="number" step="0.01" value={formData.cross_price}
                                            onChange={(e) => setFormData({ ...formData, cross_price: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <button type="submit" disabled={saving}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200 disabled:opacity-50">
                                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={16} />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ===== IMAGE TAB ===== */}
                {activeTab === 'image' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Course Thumbnail</h2>

                            {getImageUrl() && (
                                <div className="mb-6">
                                    <img src={getImageUrl()} alt="Course thumbnail"
                                        className="w-full max-w-lg rounded-xl object-cover aspect-video" />
                                </div>
                            )}

                            <label className="group cursor-pointer">
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                                        <FiUpload className="text-primary-600 text-2xl" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                        Click to upload thumbnail
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG or GIF • Max 2MB • Recommended 750×450</p>
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* ===== OUTCOMES TAB ===== */}
                {activeTab === 'outcomes' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-2">What Students Will Learn</h2>
                            <p className="text-gray-500 text-sm mb-6">Add learning outcomes to help students understand what they'll gain from this course.</p>

                            {/* Add New */}
                            <div className="flex gap-3 mb-6">
                                <input type="text" value={newOutcome}
                                    onChange={(e) => setNewOutcome(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                                    placeholder="e.g. Build modern React applications"
                                    className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all" />
                                <button onClick={handleAddOutcome}
                                    className="px-5 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex-shrink-0">
                                    <FiPlus size={18} />
                                </button>
                            </div>

                            {/* List */}
                            <div className="space-y-2">
                                {outcomes.map((outcome) => (
                                    <div key={outcome.id}
                                        className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3 group hover:bg-primary-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FiCheckCircle className="text-primary-500 flex-shrink-0" size={16} />
                                            <span className="text-sm text-gray-700">{outcome.text}</span>
                                        </div>
                                        <button onClick={() => handleDeleteOutcome(outcome.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {outcomes.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-8">No outcomes added yet</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ===== REQUIREMENTS TAB ===== */}
                {activeTab === 'requirements' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                            <h2 className="font-display text-xl font-bold text-gray-900 mb-2">Course Requirements</h2>
                            <p className="text-gray-500 text-sm mb-6">List any prerequisites students need before taking this course.</p>

                            <div className="flex gap-3 mb-6">
                                <input type="text" value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                                    placeholder="e.g. Basic HTML & CSS knowledge"
                                    className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all" />
                                <button onClick={handleAddRequirement}
                                    className="px-5 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex-shrink-0">
                                    <FiPlus size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {requirements.map((req) => (
                                    <div key={req.id}
                                        className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3 group hover:bg-primary-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{req.text}</span>
                                        </div>
                                        <button onClick={() => handleDeleteRequirement(req.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {requirements.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-8">No requirements added yet</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ===== CURRICULUM TAB ===== */}
                {activeTab === 'curriculum' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="space-y-6">
                            {/* Add Chapter */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
                                <div className="flex gap-3">
                                    <input type="text" value={newChapterTitle}
                                        onChange={(e) => setNewChapterTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChapter())}
                                        placeholder="Enter chapter title..."
                                        className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 bg-gray-50 focus:bg-white transition-all" />
                                    <button onClick={handleAddChapter}
                                        className="px-5 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex-shrink-0 flex items-center gap-2">
                                        <FiPlus size={16} />
                                        Add Chapter
                                    </button>
                                </div>
                            </div>

                            {/* Chapters List */}
                            {chapters.map((chapter, chapterIndex) => (
                                <div key={chapter.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    {/* Chapter Header */}
                                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                                        <button onClick={() => toggleChapter(chapter.id)}
                                            className="flex items-center gap-3 flex-1">
                                            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">
                                                {chapterIndex + 1}
                                            </span>
                                            <h3 className="font-semibold text-gray-900 text-left">{chapter.title}</h3>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {chapter.lessons?.length || 0} lessons
                                            </span>
                                            {expandedChapters[chapter.id]
                                                ? <FiChevronUp className="text-gray-400" />
                                                : <FiChevronDown className="text-gray-400" />
                                            }
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleAddLesson(chapter.id)}
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="Add Lesson">
                                                <FiPlus size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteChapter(chapter.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Chapter">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lessons */}
                                    {expandedChapters[chapter.id] && (
                                        <div className="border-t border-gray-100">
                                            {chapter.lessons?.length > 0 ? (
                                                chapter.lessons.map((lesson) => (
                                                    <div key={lesson.id}
                                                        className="flex items-center justify-between px-6 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3 flex-1">
                                                            {lesson.video ? (
                                                                <FiPlay className="text-green-500 flex-shrink-0" size={14} />
                                                            ) : (
                                                                <FiPlay className="text-gray-300 flex-shrink-0" size={14} />
                                                            )}
                                                            <span className="text-sm text-gray-700">{lesson.title}</span>
                                                            {lesson.video && (
                                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                                    Video ✓
                                                                </span>
                                                            )}
                                                            {!lesson.video && (
                                                                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                                                                    No video
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <label className="cursor-pointer p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                                title="Upload Video">
                                                                <FiUpload size={14} />
                                                                <input type="file" accept="video/*"
                                                                    onChange={(e) => handleVideoUpload(lesson.id, chapter.id, e)}
                                                                    className="hidden" />
                                                            </label>
                                                            <button onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Lesson">
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-6 py-8 text-center">
                                                    <p className="text-gray-400 text-sm mb-3">No lessons yet</p>
                                                    <button onClick={() => handleAddLesson(chapter.id)}
                                                        className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium hover:text-primary-700">
                                                        <FiPlus size={14} />
                                                        Add first lesson
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {chapters.length === 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <FiLayers className="text-primary-600 text-2xl" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-gray-900 mb-2">No chapters yet</h3>
                                    <p className="text-gray-500 text-sm">Add your first chapter above to start building your curriculum</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Skeleton
const EditCourseSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-64 mb-2" />
                <div className="flex gap-4 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-20" />
                    ))}
                </div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse space-y-6">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-12 bg-gray-200 rounded-xl" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-12 bg-gray-200 rounded-xl" />
                    <div className="h-12 bg-gray-200 rounded-xl" />
                    <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
                <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
        </div>
    </div>
);

export default EditCourse;