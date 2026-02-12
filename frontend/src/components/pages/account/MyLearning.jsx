import React, { useState } from "react";
import Layout from "../../common/Layout";
import UserSidebar from "../../common/UserSidebar";
import CourseEnrolled from "../../common/CourseEnrolled";
import { apiUrl, authToken } from "../../common/Config";
import { set } from "react-hook-form";
import Loading from "../../common/Loading";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + "/enrollments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setLoading(false);
        const result = await response.json();
        setEnrollments(result.data);
      } else {
        console.error("Failed to fetch enrollments");
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  React.useEffect(() => {
    fetchEnrollments();
  }, []);
  return (
    <Layout>
      <section className="section-4">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-between  mt-5 mb-3">
              <h2 className="h4 mb-0 pb-0">My Learning</h2>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row gy-4">
                {loading == true && <Loading></Loading>}
                
                {loading == false &&
                  enrollments.length > 0 &&
                  enrollments.map((enrollment) => (
                    <CourseEnrolled
                      key={enrollment.id}
                      course={enrollment.course}
                    />
                  ))}

                {loading == false && enrollments.length == 0 && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      You have not enrolled in any courses yet.
                    </div>
                  </div>
                )}
                  
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyLearning;
