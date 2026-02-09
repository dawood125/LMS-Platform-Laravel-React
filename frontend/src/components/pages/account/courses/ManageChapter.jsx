import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import CreateLesson from "./CreateLesson";
import { FiEdit2, FiTrash2 } from "react-icons/fi";


const ManageChapter = ({ course, param }) => {
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editTitles, setEditTitles] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);

  const [chapters, setChapters] = useReducer(chapterReducer, []);

  function chapterReducer(state, action) {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTER":
        return [...state, action.payload];
      case "UPDATE_CHAPTER":
        return state.map((chapter) =>
          chapter.id === action.payload.id ? action.payload : chapter,
        );
      case "REMOVE_CHAPTER":
        return state.filter((chapter) => chapter.id !== action.payload.id);
      default:
        return state;
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({});

  const onSubmit = (data) => {
    setLoading(true);
    const formData = { ...data, course_id: param };
    // Handle create course logic here
    fetch(apiUrl + "/chapters/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          setChapters({ type: "ADD_CHAPTER", payload: result.data });
          toast.success("Chapter created successfully");
        } else {
          toast.error("Failed to create chapter");
        }
      })
      .catch((error) => {
        console.error("Create chapter error:", error);
        setError("general", {
          message: "Failed to create chapter. Please try again.",
        });
      });
  };

  useEffect(() => {
    if (course && course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
  }, [course]);

  const openEditModal = (chapter) => {
    setEditId(chapter.id);
    setEditTitle(chapter.title || "");
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const title = (editTitle || "").trim();
    if (!title) {
      toast.error("Chapter title is required");
      return;
    }

    setSavingId(editId);
    fetch(`${apiUrl}/chapters/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
          toast.success("Chapter updated successfully");
          setShowEditModal(false);
        } else {
          toast.error("Failed to update chapter");
        }
      })
      .catch((error) => {
        console.error("Update chapter error:", error);
        toast.error("Failed to update chapter");
      })
      .finally(() => {
        setSavingId(null);
      });
  };

  const handleDelete = (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) {
      return;
    }

    setDeletingId(chapterId);
    fetch(`${apiUrl}/chapters/${chapterId}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setChapters({ type: "REMOVE_CHAPTER", payload: { id: chapterId } });
          toast.success("Chapter deleted successfully");
        } else {
          toast.error("Failed to delete chapter");
        }
      })
      .catch((error) => {
        console.error("Delete chapter error:", error);
        toast.error("Failed to delete chapter");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <h4 className="h5 mb-0">Chapter</h4>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setShowCreateLessonModal(true)}
            disabled={chapters.length === 0}
          >
            Create Lesson
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Chapter Title
            </label>
            <textarea
              id="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              rows={3}
              placeholder="Chapter Title"
              {...register("title", { required: "Chapter title is required" })}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
        <Accordion className="pt-3">
          {chapters.map((chapter) => (
            <Accordion.Item eventKey={`${chapter.id}`} key={chapter.id}>
              <Accordion.Header>{chapter.title}</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">Lessons</div>
                  <button type="button" className="btn btn-link p-0 text-decoration-none" style={{ color: "#000" }} >
                    Reorder Lessons
                  </button>
                </div>
                <div className="mb-3">
                  {chapter.lessons && chapter.lessons.length > 0 ? (
                    chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div className="fw-medium">{lesson.title}</div>
                          {lesson.is_free_preview === "yes" && (
                            <span className="badge bg-success pe-2">Preview</span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {lesson.duration && (
                            <span className="text-muted small">
                              {lesson.duration} mins
                            </span>
                          )}
                          <button
                            type="button"
                            className="btn btn-light btn-sm"
                            aria-label="Edit lesson"
                            onClick={() => {
                              window.location.href = `/account/courses/edit-lesson/${lesson.id}/${course.id}`;
                            }}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="btn btn-light btn-sm text-danger"
                            aria-label="Delete lesson"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">No lessons available.</div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => openEditModal(chapter)}
                    disabled={savingId === chapter.id || deletingId === chapter.id}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(chapter.id)}
                    disabled={deletingId === chapter.id}
                  >
                    {deletingId === chapter.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
          <br />
        </Accordion>
      </div>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="edit-chapter-title" className="form-label">
              Chapter Title
            </label>
            <textarea
              id="edit-chapter-title"
              className="form-control"
              rows={2}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowEditModal(false)}
            disabled={savingId === editId}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={savingId === editId}
          >
            {savingId === editId ? "Updating..." : "Update"}
          </button>
        </Modal.Footer>
      </Modal>
      <CreateLesson
        show={showCreateLessonModal}
        onHide={() => setShowCreateLessonModal(false)}
        chapters={chapters}
      />
    </div>
  );
};

export default ManageChapter;
