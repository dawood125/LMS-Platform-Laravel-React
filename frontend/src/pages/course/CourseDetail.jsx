import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiBookOpen,
  FiBarChart2,
  FiGlobe,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiLock,
  FiShoppingCart,
  FiArrowLeft,
  FiAward,
  FiUsers,
} from "react-icons/fi";
import courseService from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import ReviewSection from "../../components/ui/ReviewSection";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseDetails(id);
        const courseData = response.data.data;
        setCourse(courseData);

        // Expand first chapter by default
        if (courseData?.chapters?.length > 0) {
          setExpandedChapters({ [courseData.chapters[0].id]: true });
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast.error("Course not found");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await courseService.enrollCourse({ course_id: parseInt(id) });
      toast.success("Enrolled successfully! 🎉");
      navigate(`/student/courses/${id}/watch`);
    } catch (error) {
      const message = error.response?.data?.message || "Enrollment failed";
      if (error.response?.status === 409) {
        toast.success("Already enrolled! Redirecting...");
        navigate(`/student/courses/${id}/watch`);
      } else {
        toast.error(message);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  if (loading) return <CourseDetailSkeleton />;
  if (!course) return null;

  const imageUrl = course.image
    ? course.image.startsWith("http")
      ? course.image
      : `http://localhost:8000/${course.image}`
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=750&h=450&fit=crop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ HERO SECTION ============ */}
      <section className="bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-primary-300 hover:text-white text-sm font-medium transition-colors"
            >
              <FiArrowLeft size={16} />
              Back to courses
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {course.category && (
                  <span className="bg-primary-500/20 text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-500/30">
                    {course.category.name}
                  </span>
                )}
                {course.level && (
                  <span className="bg-white/10 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                    {course.level.name}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {course.title}
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                {course.description?.substring(0, 200)}...
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 text-sm">
                {course.total_lessons > 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiBookOpen className="text-primary-400" />
                    <span>{course.total_lessons} lessons</span>
                  </div>
                )}
                {course.total_duration > 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock className="text-primary-400" />
                    <span>{formatDuration(course.total_duration)} total</span>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiBarChart2 className="text-primary-400" />
                    <span>{course.level.name}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiGlobe className="text-primary-400" />
                    <span>{course.language.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <FiUsers className="text-primary-400" />
                  <span>{course.chapters_count || 0} chapters</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Course Card (Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden sticky top-24 border border-gray-100">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={course.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                      <FiPlay className="text-primary-600 text-xl ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-display font-extrabold text-gray-900">
                      {course.price > 0 ? `$${course.price}` : "Free"}
                    </span>
                    {course.cross_price > 0 &&
                      course.cross_price > course.price && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ${course.cross_price}
                          </span>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            {Math.round(
                              ((course.cross_price - course.price) /
                                course.cross_price) *
                                100,
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                  </div>

                  {/* Enroll Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary-200 flex items-center justify-center gap-2 mb-4"
                  >
                    {enrolling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart />
                        Enroll Now
                      </>
                    )}
                  </button>

                  {/* Course includes */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      This course includes:
                    </p>
                    {[
                      {
                        icon: FiPlay,
                        text: `${course.total_lessons || 0} video lessons`,
                      },
                      {
                        icon: FiClock,
                        text: `${formatDuration(course.total_duration)} of content`,
                      },
                      { icon: FiAward, text: "Certificate of completion" },
                      { icon: FiGlobe, text: "Lifetime access" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <item.icon
                          className="text-primary-500 flex-shrink-0"
                          size={16}
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Enroll Bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {course.price > 0 ? `$${course.price}` : "Free"}
            </span>
            {course.cross_price > 0 && course.cross_price > course.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${course.cross_price}
              </span>
            )}
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-50"
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* ============ COURSE CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                About this course
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </motion.section>

            {/* What you'll learn */}
            {course.outcomes?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                  What you'll learn
                </h2>
                <div className="bg-primary-50/50 rounded-2xl border border-primary-100 p-6 sm:p-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.outcomes.map((outcome, index) => (
                      <div key={outcome.id || index} className="flex gap-3">
                        <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheck className="text-primary-600" size={12} />
                        </div>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {outcome.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {course.requirements.map((req, index) => (
                    <li
                      key={req.id || index}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{req.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Curriculum */}
            {course.chapters?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    Course Curriculum
                  </h2>
                  <span className="text-sm text-gray-500">
                    {course.chapters_count || course.chapters?.length || 0}{" "}
                    chapters • {course.total_lessons || 0} lessons
                  </span>
                </div>

                <div className="space-y-3">
                  {course.chapters.map((chapter, chapterIndex) => {
                    const chapterLessons = chapter.lessons || [];
                    const lessonCount =
                      chapter.lessons_count || chapterLessons.length || 0;
                    const durationSum = chapter.lessons_sum_duration || 0;

                    return (
                      <div
                        key={chapter.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                      >
                        {/* Chapter Header */}
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">
                              {chapterIndex + 1}
                            </span>
                            <div className="text-left">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {chapter.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {lessonCount} lessons
                                {durationSum > 0 &&
                                  ` • ${formatDuration(durationSum)}`}
                              </p>
                            </div>
                          </div>
                          {expandedChapters[chapter.id] ? (
                            <FiChevronUp className="text-gray-400" />
                          ) : (
                            <FiChevronDown className="text-gray-400" />
                          )}
                        </button>

                        {/* Lessons List */}
                        {expandedChapters[chapter.id] &&
                          chapterLessons.length > 0 && (
                            <div className="border-t border-gray-50">
                              {chapterLessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.is_free_preview === "yes" ? (
                                      <FiPlay
                                        className="text-primary-500 flex-shrink-0"
                                        size={14}
                                      />
                                    ) : (
                                      <FiLock
                                        className="text-gray-300 flex-shrink-0"
                                        size={14}
                                      />
                                    )}
                                    <span className="text-sm text-gray-700">
                                      {lesson.title}
                                    </span>
                                    {lesson.is_free_preview === "yes" && (
                                      <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                        Free
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {lesson.duration > 0 && (
                                      <span className="text-xs text-gray-400 flex-shrink-0">
                                        {lesson.duration}m
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Empty state when expanded but no lessons */}
                        {expandedChapters[chapter.id] &&
                          chapterLessons.length === 0 && (
                            <div className="border-t border-gray-50 px-6 py-4">
                              <p className="text-sm text-gray-400 text-center">
                                No lessons in this chapter yet
                              </p>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </div>
        </div>
        {/* ============ REVIEWS SECTION ============ */}
        <ReviewSection courseId={id} />
      </div>
    </div>
  );
};

// ============ SKELETON ============
const CourseDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-32 mb-8" />
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-gray-700 rounded-full w-24" />
            <div className="h-10 bg-gray-700 rounded-lg w-3/4" />
            <div className="h-10 bg-gray-700 rounded-lg w-1/2" />
            <div className="h-20 bg-gray-700 rounded-lg w-full" />
          </div>
          <div className="hidden lg:block">
            <div className="bg-gray-800 rounded-3xl h-96" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CourseDetail;
