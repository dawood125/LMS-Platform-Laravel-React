import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiMoreVertical,
  FiImage,
  FiLayers,
  FiClock,
} from "react-icons/fi";
import courseService from "../../services/courseService";
import toast from "react-hot-toast";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getMyCourses();
      setCourses(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    )
      return;

    setDeletingId(id);
    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await courseService.changeCourseStatus(id, {
        status: newStatus,
      });
      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: response.data.data.status } : c,
        ),
      );
      toast.success(
        newStatus === 1 ? "Course published!" : "Course unpublished",
      );
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const getImageUrl = (course) => {
    if (!course.image) return null;
    if (course.image.startsWith("http")) return course.image;
    return `http://localhost:8000/${course.image}`;
  };

  if (loading) return <InstructorCoursesSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-3xl font-bold text-gray-900">
                My Courses
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and track your created courses
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/instructor/courses/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-200"
              >
                <FiPlus size={18} />
                Create New Course
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiBookOpen className="text-primary-600 text-3xl" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start creating your first course and share your knowledge with the
              world.
            </p>
            <Link
              to="/instructor/courses/create"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all"
            >
              <FiPlus />
              Create Your First Course
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-56 md:w-64 flex-shrink-0">
                    {getImageUrl(course) ? (
                      <img
                        src={getImageUrl(course)}
                        alt={course.title}
                        className="w-full h-40 sm:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                        <FiImage className="text-primary-300 text-3xl" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col">
                    <div className="flex-1">
                      {/* Status + Level */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            course.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {course.status === 1 ? "Published" : "Draft"}
                        </span>
                        {course.level && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {course.level.name}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {course.price > 0 && (
                          <span className="font-semibold text-gray-900">
                            ${course.price}
                          </span>
                        )}
                        {course.price === 0 ||
                          (!course.price && (
                            <span className="font-semibold text-green-600">
                              Free
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleToggleStatus(course.id, course.status)
                        }
                        disabled={togglingId === course.id}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          course.status === 1
                            ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {togglingId === course.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : course.status === 1 ? (
                          <FiEyeOff size={14} />
                        ) : (
                          <FiEye size={14} />
                        )}
                        {course.status === 1 ? "Unpublish" : "Publish"}
                      </button>

                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <FiEye size={14} />
                        Preview
                      </Link>

                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={deletingId === course.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors ml-auto"
                      >
                        {deletingId === course.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton
const InstructorCoursesSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2" />
        <div className="h-5 bg-gray-200 rounded-lg w-72" />
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
        >
          <div className="flex gap-6">
            <div className="w-56 h-36 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default InstructorCourses;
