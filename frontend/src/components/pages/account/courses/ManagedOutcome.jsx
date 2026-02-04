import React, { useEffect, useState } from "react";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit2, FiTrash2, FiMove } from "react-icons/fi";

const ManagedOutcome = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeText, setOutcomeText] = useState("");
  const [savingOutcome, setSavingOutcome] = useState(false);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [editingOutcomeId, setEditingOutcomeId] = useState(null);

  const courseId = window.location.pathname.split("/").pop();

  const fetchOutcomes = async () => {
    setLoadingOutcomes(true);
    try {
      const response = await fetch(apiUrl + "/outcomes?course_id=" + courseId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        const sorted = result.data
          .slice()
          .sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
          );
        setOutcomes(sorted);
      } else {
        console.error("Error fetching outcomes", result);
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
    } finally {
      setLoadingOutcomes(false);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  const onOutcomeSubmit = async (event) => {
    event.preventDefault();
    const trimmed = outcomeText.trim();
    if (!trimmed) {
      return;
    }

    setSavingOutcome(true);
    try {
      if (editingOutcomeId) {
        const current = outcomes.find((o) => o.id === editingOutcomeId);
        const response = await fetch(apiUrl + "/outcomes/" + editingOutcomeId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            outcome: trimmed,
            sort_order: current?.sort_order ?? 0,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setOutcomes((prev) =>
            prev.map((o) => (o.id === editingOutcomeId ? result.data : o)),
          );
          setOutcomeText("");
          setEditingOutcomeId(null);
          toast.success("Outcome updated");
        } else {
          console.error("Update outcome error:", result);
          toast.error("Failed to update outcome");
        }
      } else {
        const response = await fetch(apiUrl + "/outcomes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            course_id: courseId,
            outcome: trimmed,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setOutcomes((prev) => [...prev, result.data]);
          setOutcomeText("");
          toast.success("Outcome added");
        } else {
          console.error("Create outcome error:", result);
          toast.error("Failed to add outcome");
        }
      }
    } catch (error) {
      console.error("Outcome submit error:", error);
      toast.error("Outcome request failed");
    } finally {
      setSavingOutcome(false);
    }
  };

  const onOutcomeDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(outcomes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    setOutcomes(updated);

    try {
      await Promise.all(
        updated.map((item) =>
          fetch(apiUrl + "/outcomes/" + item.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              outcome: item.text,
              sort_order: item.sort_order,
            }),
          }),
        ),
      );
    } catch (error) {
      console.error("Outcome reorder error:", error);
      toast.error("Failed to save new order");
    }
  };

  const onOutcomeEdit = (outcome) => {
    setOutcomeText(outcome.text || "");
    setEditingOutcomeId(outcome.id);
  };

  const onOutcomeDelete = async (id) => {
    try {
      const response = await fetch(apiUrl + "/outcomes/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        setOutcomes((prev) => prev.filter((o) => o.id !== id));
        if (editingOutcomeId === id) {
          setEditingOutcomeId(null);
          setOutcomeText("");
        }
        toast.success("Outcome deleted");
      } else {
        console.error("Delete outcome error:", result);
        toast.error("Failed to delete outcome");
      }
    } catch (error) {
      console.error("Delete outcome error:", error);
      toast.error("Delete request failed");
    }
  };

  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-body p-4">
        <h4 className="mb-3 h5 border-bottom pb-3">Outcome</h4>
        <form onSubmit={onOutcomeSubmit}>
          <div className="mb-3">
            <label htmlFor="outcome" className="form-label">
              Outcome
            </label>
            <textarea
              id="outcome"
              className="form-control"
              rows={3}
              placeholder="Outcome"
              value={outcomeText}
              onChange={(event) => setOutcomeText(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={savingOutcome}
          >
            {editingOutcomeId ? "Update" : "Save"}
          </button>
        </form>

        <div className="mt-4">
          {loadingOutcomes ? (
            <div className="text-muted">Loading outcomes...</div>
          ) : outcomes.length === 0 ? (
            <div className="text-muted">No outcomes added yet.</div>
          ) : (
            <DragDropContext onDragEnd={onOutcomeDragEnd}>
              <Droppable droppableId="outcome-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {outcomes.map((outcome, index) => (
                      <Draggable
                        key={outcome.id}
                        draggableId={outcome.id.toString()}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`d-flex align-items-center justify-content-between bg-white border rounded p-2 mb-2 ${
                              snapshot.isDragging ? "shadow" : ""
                            }`}
                          >
                            <div className="d-flex align-items-center">
                              <span
                                className="me-2 text-muted"
                                {...dragProvided.dragHandleProps}
                              >
                                <FiMove />
                              </span>
                              <span>{outcome.text}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => onOutcomeEdit(outcome)}
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light btn-sm text-danger"
                                onClick={() => onOutcomeDelete(outcome.id)}
                              >
                                <FiTrash2 />
                              </button>
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
        </div>
      </div>
    </div>
  );
};

export default ManagedOutcome;
