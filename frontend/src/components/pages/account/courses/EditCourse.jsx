import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, authToken } from "../../../common/Config";
import toast from "react-hot-toast";
import Layout from "../../../common/Layout";
import ManagedOutcome from "./ManagedOutcome";
import ManageRequirement from "./ManageRequirement";

const EditCourse = () => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);


  const courseId = window.location.pathname.split("/").pop();
  const[loading,setLoading]=useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: async () => {
      const response = await fetch(apiUrl + "/courses/" + courseId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();
      if (result.status == 200) {
        console.log(result.data);
        reset({
          title: result.data.title,
          category: result.data.category_id,
          level: result.data.level_id,
          language: result.data.language_id,
          description: result.data.description,
          "sell-price": result.data.price,
          "cross-price": result.data.cross_price,
        });
      }
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    // Handle create course logic here
    const courseId = window.location.pathname.split("/").pop();
    fetch(apiUrl + "/courses/" + courseId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.status == 200) {
          toast.success("Course updated successfully");
        } else {
          toast.error("Failed to update course");
        }
      })
      .catch((error) => {
        console.error("Update course error:", error);
        setError("general", {
          message: "Failed to update course. Please try again.",
        });
      });
  };

  const courseMetadata = async () => {
    fetch(apiUrl + "/courses/metadata", {
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
          console.log(result);
          setCategories(result.categories);
          setLevels(result.levels);
          setLanguages(result.languages);
        } else {
          console.log("Error fetching metadata");
        }
      })
      .catch((error) => {
        console.error("Error fetching metadata:", error);
      });
  };

  React.useEffect(() => {
    courseMetadata();
  }, []);


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
                Edit Course
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg mb-4">
                      <div className="card-body p-4">
                        <h4 className="mb-3 h5 border-bottom pb-3">
                          Course Details
                        </h4>
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

                        <div className="mb-3">
                          <label htmlFor="Category" className="form-label">
                            Category
                          </label>
                          <select
                            name="category"
                            id="category"
                            className={`form-control ${errors.category ? "is-invalid" : ""}`}
                            {...register("category", {
                              required: "Category is required",
                            })}
                          >
                            <option value="">Select Category</option>
                            {categories &&
                              categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          {errors.category && (
                            <div className="invalid-feedback">
                              {errors.category.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="Level" className="form-label">
                            Level
                          </label>
                          <select
                            name="level"
                            id="level"
                            className={`form-control ${errors.level ? "is-invalid" : ""}`}
                            {...register("level", {
                              required: "Level is required",
                            })}
                          >
                            <option value="">Select Level</option>
                            {levels &&
                              levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                  {level.name}
                                </option>
                              ))}
                          </select>
                          {errors.level && (
                            <div className="invalid-feedback">
                              {errors.level.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="language" className="form-label">
                            Language
                          </label>
                          <select
                            name="language"
                            id="language"
                            className={`form-control ${errors.language ? "is-invalid" : ""}`}
                            {...register("language", {
                              required: "Language is required",
                            })}
                          >
                            <option value="">Select Language</option>
                            {languages &&
                              languages.map((language) => (
                                <option key={language.id} value={language.id}>
                                  {language.name}
                                </option>
                              ))}
                          </select>
                          {errors.language && (
                            <div className="invalid-feedback">
                              {errors.language.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Course Description
                          </label>
                          <textarea
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            id="description"
                            rows={5}
                            {...register("description", {
                              required: "Description is required",
                            })}
                          />
                          {errors.description && (
                            <div className="invalid-feedback">
                              {errors.description.message}
                            </div>
                          )}
                        </div>
                        <h4 className="mb-3 h5 border-bottom pb-3">Pricing</h4>
                        <div className="mb-3">
                          <label htmlFor="sell-price" className="form-label">
                            Sell Price
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors["sell-price"] ? "is-invalid" : ""}`}
                            id="sell-price"
                            {...register("sell-price", {
                              required: "Price is required",
                              min: {
                                value: 0,
                                message: "Price must be a positive number",
                              },
                            })}
                          />
                          {errors["sell-price"] && (
                            <div className="invalid-feedback">
                              {errors["sell-price"].message}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="cross-price" className="form-label">
                            Cross Price
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors["cross-price"] ? "is-invalid" : ""}`}
                            id="cross-price"
                            {...register("cross-price", {
                              min: {
                                value: 0,
                                message:
                                  "Cross price must be a positive number",
                              },
                            })}
                          />
                          {errors["cross-price"] && (
                            <div className="invalid-feedback">
                              {errors["cross-price"].message}
                            </div>
                          )}
                        </div>
                        <button disabled={loading} type="submit" className="btn btn-primary">
                          {loading?"Updating...":"Update Course"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-5">
                  <ManagedOutcome></ManagedOutcome>
                  <ManageRequirement></ManageRequirement>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
