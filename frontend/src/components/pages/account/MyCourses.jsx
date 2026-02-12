import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import CourseEdit from "../../common/CourseEdit";
import Layout from "../../common/Layout";
import { apiUrl, authToken } from "../../common/Config";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const fetchMyCourses = async () => {
    try {
      const response = await fetch(apiUrl + "/my-courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setCourses(result.data);
        console.log("My Courses:", result.data);
      } else {
        console.error("Failed to fetch my courses");
      }
    } catch (error) {
      console.error("Error fetching my courses:", error);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl + `/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        fetchMyCourses(); // Refresh the course list after deletion
      } else {
        console.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  React.useEffect(() => {
    fetchMyCourses();
  }, []);
  return (
    <Layout>
      <section className="section-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">My Courses</h2>
                <Link
                  to="/account/my-courses/create"
                  className="btn btn-primary"
                >
                  Create
                </Link>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row gy-4">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <CourseEdit
                      course={course}
                      onStatusChange={fetchMyCourses}
                      deleteCourse={deleteCourse}
                    />
                  ))
                ) : (
                  <p>No courses found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyCourses;
