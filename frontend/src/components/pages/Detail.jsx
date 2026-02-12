import React from "react";
import Layout from "../common/Layout";
import { Rating } from "react-simple-star-rating";
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { useState } from "react";
import { apiUrl, authToken, convertMinutesToHours } from "../common/Config";
import { useNavigate, useParams } from "react-router-dom";
import { PiMonitorPlayBold } from "react-icons/pi";
import Loading from "../common/Loading";
import FreePreview from "../common/FreePreview";
import toast from "react-hot-toast";

const Detail = () => {
  const [rating, setRating] = useState(4.0);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [course, setCourses] = useState([]);
  const [freeLesson, setFreeLesson] = useState(null);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (lesson) => {
    setFreeLesson(lesson);
    setShow(true);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + "/course-details/" + params.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setCourses(result.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const EnrollCourse = async () => {
    let data = { course_id: course.id };
    try {
      const response = await fetch(apiUrl + "/enroll-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const result = await response.json();
        toast.success(result.message);
      } else if (response.status === 401) {
        toast.error(
          "You are not authorized to enroll in this course. Please log in.",
        );
        navigate("/account/login");
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to enroll in course");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <Layout>
      {freeLesson && (
        <FreePreview
          show={show}
          handleClose={handleClose}
          freeLesson={freeLesson}
        ></FreePreview>
      )}

      {loading === true && <Loading></Loading>}

      {loading == false && course && (
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/courses">Courses</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {course.title ?? "Course Details"}
              </li>
            </ol>
          </nav>
          <div className="row my-5">
            <div className="col-lg-8">
              <h2>{course.title ?? "Course Details"}</h2>
              <div className="d-flex">
                <div className="mt-1">
                  <span className="badge bg-green">
                    {course.category?.name ?? "Category"}
                  </span>
                </div>
                <div className="d-flex ps-3">
                  <div className="text pe-2 pt-1">0.0</div>
                  <Rating initialValue={rating} size={20} />
                </div>
              </div>
              <div className="row mt-4">
                {/* <div className="col">
                            <span className="text-muted d-block">Last Updates</span>
                            <span className="fw-bold">Aug 2021</span>
                        </div> */}
                <div className="col">
                  <span className="text-muted d-block">Level</span>
                  <span className="fw-bold">
                    {course.level?.name ?? "Beginner"}
                  </span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Students</span>
                  <span className="fw-bold">0</span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Language</span>
                  <span className="fw-bold">
                    {course.language?.name ?? "Language"}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3  h4">Overview</h3>
                    <p>{course.description ?? "No description available."}</p>
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">What you will learn</h3>
                    <ul className="list-unstyled mt-3">
                      {course.outcomes && course.outcomes.length > 0 ? (
                        course.outcomes.map((outcome) => (
                          <li
                            key={outcome.id}
                            className="d-flex align-items-center mb-2"
                          >
                            <span className="text-success me-2">&#10003;</span>
                            <span>{outcome.text}</span>
                          </li>
                        ))
                      ) : (
                        <li className="d-flex align-items-center mb-2">
                          <span className="text-muted">
                            No learning outcomes available.
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">Requirements</h3>
                    <ul className="list-unstyled mt-3">
                      {course.requirements && course.requirements.length > 0 ? (
                        course.requirements.map((req) => (
                          <li
                            key={req.id}
                            className="d-flex align-items-center mb-2"
                          >
                            <span className="text-success me-2">&#10003;</span>
                            <span>{req.text}</span>
                          </li>
                        ))
                      ) : (
                        <li className="d-flex align-items-center mb-2">
                          <span className="text-muted">
                            No requirements available.
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="h4 mb-3">Course Structure</h3>
                    <p>
                      {course.chapters_count} Chapters : {course.total_lessons}{" "}
                      Lectures: {convertMinutesToHours(course.total_duration)}
                    </p>
                    <Accordion defaultActiveKey="0" id="courseAccordion">
                      {course.chapters && course.chapters.length > 0 ? (
                        course.chapters.map((chapter) => (
                          <Accordion.Item
                            eventKey={chapter.id}
                            key={chapter.id}
                          >
                            <Accordion.Header>
                              {chapter.title}
                              <span className="ms-3 text-muted">
                                ({chapter.lessons_count} lectures -{" "}
                                {convertMinutesToHours(
                                  chapter.lessons_sum_duration,
                                )}
                                )
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <ListGroup>
                                {chapter.lessons &&
                                chapter.lessons.length > 0 ? (
                                  chapter.lessons.map((lesson) => (
                                    <ListGroup.Item>
                                      <div className="row">
                                        <div className="col-md-9">
                                          <PiMonitorPlayBold className="me-2" />
                                          {lesson.title}
                                        </div>
                                        <div className="col-md-3">
                                          <div className="d-flex justify-content-end align-items-center">
                                            {lesson.is_free_preview ===
                                              "yes" && (
                                              <Badge
                                                bg="success"
                                                className="me-2"
                                              >
                                                <button
                                                  type="button"
                                                  className="btn btn-link text-white text-decoration-none p-0"
                                                  onClick={() =>
                                                    handleShow(lesson)
                                                  }
                                                >
                                                  Free Preview
                                                </button>
                                              </Badge>
                                            )}

                                            <span className="text-muted ms-2">
                                              {lesson.duration} mins
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </ListGroup.Item>
                                  ))
                                ) : (
                                  <div className="text-muted">
                                    No lessons available for this chapter.
                                  </div>
                                )}
                              </ListGroup>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))
                      ) : (
                        <div className="text-muted">
                          No course structure available.
                        </div>
                      )}
                    </Accordion>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">Reviews</h3>
                    <p>Our student says about this course</p>

                    <div className="mt-4">
                      <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                        <img
                          src="https://placehold.co/50"
                          alt="User"
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h6 className="mb-0">
                            Mohit Singh{" "}
                            <span className="text-muted fs-6">Jan 2, 2025</span>
                          </h6>
                          <div className="text-warning mb-2">
                            <Rating initialValue={rating} size={20} />
                          </div>
                          <p className="mb-0">
                            Quisque et quam lacus amet. Tincidunt auctor
                            phasellus purus faucibus lectus mattis.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-start mb-4  pb-3">
                        <img
                          src="https://placehold.co/50"
                          alt="User"
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h6 className="mb-0">
                            mark Doe{" "}
                            <span className="text-muted fs-6">
                              Jan 10, 2025
                            </span>
                          </h6>
                          <div className="text-warning mb-2">
                            <Rating initialValue={rating} size={20} />
                          </div>
                          <p className="mb-0">
                            Quisque et quam lacus amet. Tincidunt auctor
                            phasellus purus faucibus lectus mattis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border rounded-3 bg-white p-4 shadow-sm">
                <Card.Img
                  variant="top"
                  src={course.course_small_image}
                  className="img-fluid mb-3"
                />
                <Card.Body>
                  <h3 className="fw-bold">${course.price}</h3>
                  <div className="text-muted text-decoration-line-through">
                    {course.cross_price > course.price &&
                      `$${course.cross_price}`}
                  </div>
                  {/* Buttons */}
                  <div className="mt-4">
                    <button
                      onClick={() => EnrollCourse()}
                      className="btn btn-primary w-100"
                    >
                      <i className="bi bi-ticket"></i> Enroll
                    </button>
                  </div>
                </Card.Body>
                <Card.Footer className="mt-4">
                  <h6 className="fw-bold">This course includes</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-infinity text-primary me-2"></i>
                      Full lifetime access
                    </ListGroup.Item>
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-tv text-primary me-2"></i>
                      Access on mobile and TV
                    </ListGroup.Item>
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-award-fill text-primary me-2"></i>
                      Certificate of completion
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Footer>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Detail;
