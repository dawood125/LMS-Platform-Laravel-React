import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import { apiUrl, authToken } from "../../../common/Config";

const CreateLesson = ({ show, onHide, chapters, onCreated, setChapters }) => {
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!chapterId && chapters && chapters.length > 0) {
      setChapterId(String(chapters[0].id));
    }
  }, [chapters, chapterId]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const statusValue = status.trim();
    if (!chapterId) {
      toast.error("Please select a chapter");
      return;
    }
    if (!trimmedTitle) {
      toast.error("Lesson title is required");
      return;
    }
    if (!statusValue) {
      toast.error("Please select a status");
      return;
    }
    console.log(statusValue);


    setLoading(true);
    fetch(`${apiUrl}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        chapter_id: Number(chapterId),
        title: trimmedTitle,
        status: status,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setChapters({
            type: "ADD_LESSON",
            payload: {
              chapterId: Number(chapterId),
              lesson: result.data,
            },
          });
          toast.success("Lesson created successfully");
          setTitle("");
          if (onCreated) {
            onCreated(result.data);
          }
          onHide();
        } else {
          toast.error("Failed to create lesson");
        }
      })
      .catch((error) => {
        console.error("Create lesson error:", error);
        toast.error("Failed to create lesson");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="lesson-chapter" className="form-label">
            Chapter
          </label>
          <select
            id="lesson-chapter"
            className="form-select"
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            disabled={!chapters || chapters.length === 0}
          >
            {(!chapters || chapters.length === 0) && (
              <option value="">No chapters available</option>
            )}
            {chapters &&
              chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="lesson-title" className="form-label">
            Lesson Title
          </label>
          <input
            id="lesson-title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lesson Title"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lesson-status" className="form-label">Status</label>
          <select id="lesson-status" className="form-select"  value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}>
            <option value="">Select Status</option>
            <option value="1">Active</option>
            <option value="0">Block</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onHide}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading || !chapters || chapters.length === 0}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateLesson;
