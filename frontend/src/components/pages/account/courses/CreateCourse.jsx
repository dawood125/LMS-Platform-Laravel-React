import React from "react";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";

const CreateCourse = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle create course logic here
     fetch(apiUrl + "/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
            navigate("/account/courses/edit/"+result.data.id);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Create course error:", error);
        setError("general", {
          message: "Failed to create course. Please try again.",
        });
      });
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
              <li className="breadcrumb-item active" aria-current="page">
                Create Course
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Create Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="card border-0 shadow-lg mb-4">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Course Title
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? "is-invalid" : ""}`}
                          id="title"
                          placeholder="Enter Course Title"
                          {...register("title", {
                            required: "Course title is required",
                          })}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">
                            {errors.title.message}
                          </div>
                        )}
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Continue
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCourse;
