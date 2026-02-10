import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { set, useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import EditVideo from "./EditVideo";

const EditLesson = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm({});

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [checked, setChecked] = useState(false);

  const [description, setDescription] = useState("");
  const editorRef = useRef(null);
  const params = useParams();

  const onSubmit = (data) => {
    setLoading(true);
    fetch(apiUrl + "/lessons/" + params.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...data,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          toast.success("Lesson updated successfully");
        } else {
          toast.error("Error updating lesson");
        }
      })
      .catch((error) => {
        console.error("Error updating lesson:", error);
      });
  };

  useEffect(() => {
    // Fetch chapter data and populate the form
    fetch(apiUrl + "/chapters?course_id=" + params.courseId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setChapters(result.data);
        } else {
          console.log("Error fetching metadata");
        }
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });

    // Fetch lesson data and populate the form
    fetch(apiUrl + "/lessons/" + params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setLessonData(result.data);
          reset({
            title: result.data.title,
            chapter_id: String(result.data.chapter_id),
            status: result.data.status,
            description: result.data.description,
            duration: result.data.duration,
          });
          setDescription(result.data.description);
          setChecked(result.data.is_free_preview == "yes" ? true : false);
        } else {
          console.log("Error fetching metadata");
        }
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  }, []);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 300,
      placeholder: "Start typing...",
    }),
    [],
  );

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/account/my-courses">My Courses</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Lesson
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
                <Link
                  to={`/account/my-courses/edit/${params.courseId}`}
                  className="btn btn-success btn-sm"
                >
                  Back
                </Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-lg mb-4">
                <div className="card-body p-4">
                  <h4 className="mb-3 h5 border-bottom pb-3">
                    Basic Information
                  </h4>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        id="title"
                        placeholder="What is Web Development?"
                        {...register("title", {
                          required: "Title is required",
                        })}
                      />
                      {errors.title && (
                        <span className="text-danger">
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="chapter" className="form-label">
                        Chapter
                      </label>
                      <select
                        id="chapter"
                        className="form-select"
                        {...register("chapter_id", {
                          required: "Chapter is required",
                        })}
                      >
                        <option value="">Select Chapter</option>
                        {chapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            {chapter.title}
                          </option>
                        ))}
                      </select>
                      {errors.chapter_id && (
                        <span className="text-danger">
                          {errors.chapter_id.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="duration" className="form-label">
                        Duration (in minutes)
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                        id="duration"
                        placeholder="20"
                        {...register("duration", {
                          required: "Duration is required",
                          min: {
                            value: 1,
                            message: "Duration must be at least 1 minute",
                          },
                        })}
                      />
                      {errors.duration && (
                        <span className="text-danger">
                          {errors.duration.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <JoditEditor
                        ref={editorRef}
                        value={description}
                        config={editorConfig}
                        onBlur={(newContent) => {
                          setDescription(newContent);
                          setValue("description", newContent, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />
                      <input
                        type="hidden"
                        id="description"
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        {...register("description")}
                      />
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        id="status"
                        className={`form-select ${errors.status ? "is-invalid" : ""}`}
                        {...register("status", {
                          required: "Status is required",
                        })}
                      >
                        <option value="">Select Status</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                      {errors.status && (
                        <span className="text-danger">
                          {errors.status.message}
                        </span>
                      )}
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className={`form-check-input ${errors.is_free_preview ? "is-invalid" : ""}`}
                        type="checkbox"
                        id="freeLesson"
                        {...register("is_free_preview")}
                        checked={checked}
                        onChange={(e) => {
                          setChecked(e.target.checked);
                        }}
                      />
                      {errors.is_free_preview && (
                        <span className="text-danger">
                          {errors.is_free_preview.message}
                        </span>
                      )}
                      <label className="form-check-label" htmlFor="freeLesson">
                        Free Lesson
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Lesson"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              {lessonData && (
                <EditVideo lesson={lessonData} setLesson={setLessonData} />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditLesson;
