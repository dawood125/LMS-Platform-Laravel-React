import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config";
import JoditEditor from "jodit-react";

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
    console.log(data);
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
            is_free: result.data.is_free,
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

  const editorConfig = {
    readonly: false,
    height: 300,
  };

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
                  to="/account/my-courses"
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

                  <form onSubmit={handleSubmit(onSubmit)}>
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
                        className="form-control"
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
                        onChange={(newContent) => {
                          setDescription(newContent);
                        }}
                      />
                      <input
                        type="hidden"
                        id="description"
                        {...register("description")}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        id="status"
                        className="form-select"
                        {...register("status", {
                          required: "Status is required",
                        })}
                      >
                        <option value="">Select Status</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="freeLesson"
                        checked={checked}
                        onChange={(e) => {
                          setChecked(e.target.checked);
                          setValue("is_free", e.target.checked ? "yes" : "no", {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        {...register("is_free")}
                      />
                      <label className="form-check-label" htmlFor="freeLesson">
                        Free Lesson
                      </label>
                    </div>

                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="card border-0 shadow-lg mb-4">
                <div className="card-body p-4">
                  <h4 className="mb-3 h5 border-bottom pb-3">Video</h4>
                  <div className="border rounded bg-light text-center p-3 mb-3">
                    <div className="text-muted">
                      Drag & Drop your files or{" "}
                      <span className="text-primary">Browse</span>
                    </div>
                  </div>
                  <div className="ratio ratio-16x9 bg-dark rounded overflow-hidden">
                    <video controls>
                      <source src="movie.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditLesson;
