import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Course from "../common/Course";
import Layout from "../common/Layout";
import { apiUrl } from "../common/Config";
import Loading from "../common/Loading";
import NotFound from "../common/NotFound";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("desc");
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedcategory, setCheckedCategory] = useState(() => {
    const initialCategories = searchParams.get("category");
    return initialCategories ? initialCategories.split(",") : [];
  });
  const [checkedLevel, setCheckedLevel] = useState(() => {
    const initialLevels = searchParams.get("level");
    return initialLevels ? initialLevels.split(",") : [];
  });
  const [checkedLanguage, setCheckedLanguage] = useState(() => {
    const initialLanguages = searchParams.get("language");
    return initialLanguages ? initialLanguages.split(",") : [];
  });

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (e.target.checked) {
      setCheckedCategory([...checkedcategory, categoryId]);
    } else {
      setCheckedCategory(checkedcategory.filter((id) => id !== categoryId));
    }
  };

  const handleLevelChange = (e) => {
    const levelId = e.target.value;
    if (e.target.checked) {
      setCheckedLevel([...checkedLevel, levelId]);
    } else {
      setCheckedLevel(checkedLevel.filter((id) => id !== levelId));
    }
  };

  const handleLanguageChange = (e) => {
    const languageId = e.target.value;
    if (e.target.checked) {
      setCheckedLanguage([...checkedLanguage, languageId]);
    } else {
      setCheckedLanguage(checkedLanguage.filter((id) => id !== languageId));
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (checkedcategory.length > 0) {
      params.append("category", checkedcategory.join(","));
    }
    if (checkedLevel.length > 0) {
      params.append("level", checkedLevel.join(","));
    }
    if (checkedLanguage.length > 0) {
      params.append("language", checkedLanguage.join(","));
    }
    if (keyword) {
      params.append("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    params.append("sort", sort);

    setSearchParams(params);

    try {
      const response = await fetch(
        apiUrl + "/fetch-courses?" + params.toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        setLoading(false);
        const result = await response.json();
        setCourses(result.data);
      } else {
        setLoading(false);
        console.error("Failed to fetch featured courses");
      }
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(apiUrl + "/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setCategories(result.data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch(apiUrl + "/fetch-levels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setLevels(result.data);
      } else {
        console.error("Failed to fetch levels");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch(apiUrl + "/fetch-languages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setLanguages(result.data);
      } else {
        console.error("Failed to fetch languages");
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const clearFilters = () => {
    setCheckedCategory([]);
    setCheckedLevel([]);
    setCheckedLanguage([]);
    setKeyword("");
    setSort("desc");
    document.querySelectorAll(".form-check-input").forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [checkedcategory, checkedLevel, checkedLanguage, keyword, sort]);

  useEffect(() => {
    fetchCategories();
    fetchLevels();
    fetchLanguages();
  }, []);
  return (
    <Layout>
      <div className="container pb-5 pt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Courses
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar mb-5 card border-0">
              <div className="card-body shadow">
                <div className="mb-3 input-group">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Search by keyword"
                  />
                  <button className="btn btn-primary">Search</button>
                </div>
                <div className="pt-3">
                  <h3 className="h5 mb-2">Category</h3>
                  <ul>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category.id}>
                          <div className="form-check">
                            <input
                              defaultChecked={checkedcategory.includes(
                                category.id.toString(),
                              )}
                              className="form-check-input"
                              type="checkbox"
                              onClick={(e) => handleCategoryChange(e)}
                              value={category.id}
                              id={`category-${category.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`category-${category.id}`}
                            >
                              {category.name}
                            </label>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>Loading categories...</p>
                    )}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5  mb-2">Level</h3>
                  <ul>
                    {levels.length > 0 ? (
                      levels.map((level) => (
                        <li key={level.id}>
                          <div className="form-check">
                            <input
                              defaultChecked={checkedLevel.includes(
                                level.id.toString(),
                              )}
                              onClick={(e) => handleLevelChange(e)}
                              className="form-check-input"
                              type="checkbox"
                              value={level.id}
                              id={`level-${level.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`level-${level.id}`}
                            >
                              {level.name}
                            </label>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>Loading levels...</p>
                    )}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5 mb-2">Language</h3>
                  <ul>
                    {languages.length > 0 ? (
                      languages.map((language) => (
                        <li key={language.id}>
                          <div className="form-check">
                            <input
                              defaultChecked={checkedLanguage.includes(
                                language.id.toString(),
                              )}
                              onClick={(e) => handleLanguageChange(e)}
                              className="form-check-input"
                              type="checkbox"
                              value={language.id}
                              id={`language-${language.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`language-${language.id}`}
                            >
                              {language.name}
                            </label>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>Loading languages...</p>
                    )}
                  </ul>
                </div>
                <a onClick={clearFilters} href="#" className="clear-filter">
                  Clear All Filters
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <section className="section-3">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="h5 mb-0">{/* 10 courses found */}</div>
                <div>
                  <select
                    name=""
                    id=""
                    className="form-select"
                    onChange={(e) => setSort(e.target.value)}
                    value={sort}
                  >
                    <option value="desc">Newset First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="row gy-4">

              {courses.length === 0 && loading == false && <NotFound text="No courses found matching your criteria." />}

                {loading == true && <Loading />}

                {loading == false &&
                  courses &&
                  courses.map((course) => (
                    <Course
                      key={course.id}
                      course={course}
                      customClasses="col-lg-4 col-md-6"
                    />
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
