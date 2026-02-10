import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiMove } from "react-icons/fi";
import { apiUrl, authToken } from "../../../common/Config"; // Adjust path if needed
import toast from "react-hot-toast";

const LessonSort = ({ show, onHide, lessondata, onLessonsUpdate }) => {
  const [lessons, setLessons] = useState([]);

  console.log("LessonSort received lessondata:", lessondata); // Debug log
  // Load lessons when the modal opens or lessondata changes
  useEffect(() => {
    if (lessondata && lessondata.lessons) {
      // Create a copy and sort by sort_order
      const sorted = [...lessondata.lessons].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
      setLessons(sorted);
    }
  }, [lessondata]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(lessons);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update sort_order locally
    const updated = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    // 1. Update Local State (Instant UI feedback)
    setLessons(updated);

    // 2. Update Parent Component (So the background list updates too)
    if (onLessonsUpdate && lessondata) {
      onLessonsUpdate(lessondata.id, updated);
    }

    // 3. Send API Requests
    try {
      await Promise.all(
        updated.map((item) =>
          fetch(apiUrl + "/lessons/" + item.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              title: item.title,         
              chapter_id: lessondata.id,
              status: item.status,       
              sort_order: item.sort_order,
            }),
          })
        )
      );
      toast.success("Order saved successfully");
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("Failed to save new order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sort Lessons: {lessondata?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {lessons.length === 0 ? (
          <p className="text-muted text-center">No lessons to sort.</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lesson-sort-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson.id}
                      draggableId={lesson.id.toString()}
                      index={index}
                    >
                      {(dragProvided, snapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={`d-flex align-items-center bg-white border rounded p-3 mb-2 ${
                            snapshot.isDragging ? "shadow border-primary" : ""
                          }`}
                          style={{
                            ...dragProvided.draggableProps.style,
                            userSelect: "none",
                          }}
                        >
                          <span className="me-3 text-muted">
                            <FiMove size={18} />
                          </span>
                          <div className="fw-medium">
                            {lesson.title}
                            {lesson.is_free_preview === "yes" && (
                              <span className="badge bg-success ms-2" style={{fontSize: '10px'}}>
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default LessonSort;