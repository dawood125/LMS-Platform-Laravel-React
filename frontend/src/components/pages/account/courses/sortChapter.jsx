import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiMove } from "react-icons/fi";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";

const SortChapter = ({ show, onHide, chapters, onChaptersUpdate }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(chapters)) {
      const sorted = [...chapters].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      );
      setItems(sorted);
    }
  }, [chapters]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    setItems(updated);
    if (onChaptersUpdate) {
      onChaptersUpdate(updated);
    }

    try {
      await Promise.all(
        updated.map((chapter) =>
          fetch(`${apiUrl}/chapters/${chapter.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              title: chapter.title,
              sort_order: chapter.sort_order,
              status: chapter.status,
            }),
          }),
        ),
      );
    } catch (error) {
      console.error("Chapter reorder error:", error);
      toast.error("Failed to save chapter order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sort Chapters</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {items.length === 0 ? (
          <p className="text-muted text-center">No chapters to sort.</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapter-sort-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((chapter, index) => (
                    <Draggable
                      key={chapter.id}
                      draggableId={chapter.id.toString()}
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
                          <div className="fw-medium">{chapter.title}</div>
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

export default SortChapter;
