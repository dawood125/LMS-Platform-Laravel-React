import React, { useState } from "react";
import Course from "./Course";
import { apiUrl } from "./Config";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    try {
      const response = await fetch(apiUrl + "/featured-courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setCourses(result.data);
      } else {
        console.error("Failed to fetch featured courses");
      }
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <section className="section-3 my-5">
      <div className="container">
        <div className="section-title py-3  mt-4">
          <h2 className="h3">Featured Courses</h2>
          <p>
            Discover courses designed to help you excel in your professional and
            personal growth.
          </p>
        </div>
        <div className="row gy-4">
          {courses &&
            courses.map((course) => (
              <Course
                key={course.id}
                course={course}
                customClasses="col-lg-3 col-md-6"
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
