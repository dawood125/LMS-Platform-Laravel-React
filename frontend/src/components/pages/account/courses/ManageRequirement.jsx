import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config"; 
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit2, FiTrash2, FiMove } from "react-icons/fi";

const ManageRequirement = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue, // Needed to set value when editing
    reset,
  } = useForm();

  const [requirements, setRequirements] = useState([]);
  const [savingRequirement, setSavingRequirement] = useState(false);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [editingRequirementId, setEditingRequirementId] = useState(null);

  const courseId = window.location.pathname.split("/").pop();

  // 1. Fetch Requirements
  const fetchRequirements = async () => {
    setLoadingRequirements(true);
    try {
      const response = await fetch(apiUrl + "/requirements?course_id=" + courseId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        const sorted = result.data.sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id
        );
        setRequirements(sorted);
      }
    } catch (error) {
      console.error("Error fetching requirements:", error);
    } finally {
      setLoadingRequirements(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // 2. Submit (Create/Update)
  const onRequirementSubmit = async (data) => {
    const trimmed = data.requirement.trim();
    if (!trimmed) return;

    setSavingRequirement(true);
    try {
      if (editingRequirementId) {
        // Update Logic
        const current = requirements.find((r) => r.id === editingRequirementId);
        const response = await fetch(apiUrl + "/requirements/" + editingRequirementId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            requirement: trimmed,
            sort_order: current?.sort_order ?? 0,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setRequirements((prev) =>
            prev.map((r) => (r.id === editingRequirementId ? result.data : r))
          );
          reset();
          setEditingRequirementId(null);
          toast.success("Requirement updated");
        }
      } else {
        // Create Logic
        const response = await fetch(apiUrl + "/requirements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            course_id: courseId,
            requirement: trimmed,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setRequirements((prev) => [...prev, result.data]);
          reset();
          toast.success("Requirement added");
        }
      }
    } catch (error) {
      console.error("Requirement submit error:", error);
      toast.error("Request failed");
    } finally {
      setSavingRequirement(false);
    }
  };

  // 3. Edit Helper
  const onRequirementEdit = (item) => {
    setValue("requirement", item.text ?? item.requirement ?? ""); // Populates the form
    setEditingRequirementId(item.id);
  };

  // 4. Delete Helper
  const onRequirementDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this requirement?")) return;
    try {
      const response = await fetch(apiUrl + "/requirements/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        setRequirements((prev) => prev.filter((r) => r.id !== id));
        if (editingRequirementId === id) {
          setEditingRequirementId(null);
          reset();
        }
        toast.success("Requirement deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // 5. Drag & Drop Reorder
  const onRequirementDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(requirements);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    setRequirements(updated);

    try {
      await Promise.all(
        updated.map((item) =>
          fetch(apiUrl + "/requirements/" + item.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              requirement: item.text ?? item.requirement ?? "",
              sort_order: item.sort_order,
            }),
          })
        )
      );
    } catch (error) {
      toast.error("Failed to save new order");
    }
  };

  return (
    <div className="card border-0 shadow-lg mb-4">
      <div className="card-body p-4">
        <h4 className="mb-3 h5 border-bottom pb-3">Requirements</h4>
        
        {/* Pass handleSubmit here */}
        <form onSubmit={handleSubmit(onRequirementSubmit)}>
          <div className="mb-3">
            <label htmlFor="requirement" className="form-label">
              Requirement
            </label>
            <textarea
              id="requirement"
              className={`form-control ${errors.requirement ? "is-invalid" : ""}`}
              rows={3}
              placeholder="Enter requirement details..."
              {...register("requirement", {
                required: "Requirement text is required",
              })}
            />
            {errors.requirement && (
              <div className="invalid-feedback">
                {errors.requirement.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={savingRequirement}
          >
            {editingRequirementId ? "Update" : "Save"}
          </button>
        </form>

        <div className="mt-4">
          {loadingRequirements ? (
            <div className="text-muted">Loading requirements...</div>
          ) : requirements.length === 0 ? (
            <div className="text-muted">No requirements added yet.</div>
          ) : (
            <DragDropContext onDragEnd={onRequirementDragEnd}>
              <Droppable droppableId="requirement-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {requirements.map((req, index) => (
                      <Draggable
                        key={req.id}
                        draggableId={req.id.toString()}
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
                              <span>{req.text ?? req.requirement}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => onRequirementEdit(req)}
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                type="button"
                                className="btn btn-light btn-sm text-danger"
                                onClick={() => onRequirementDelete(req.id)}
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

export default ManageRequirement;
