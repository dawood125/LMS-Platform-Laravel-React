import React, { useState } from "react";
import Layout from "../../common/Layout";
import Accordion from "react-bootstrap/Accordion";
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from "react-bootstrap/ProgressBar";
import { apiUrl, authToken } from "../../common/Config";
import { useParams } from "react-router-dom";

const WatchCourses = () => {
  const [course, setCourse] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const mediaBase = apiUrl?.replace(/\/api\/?$/, "");
  const rawVideoPath = activity?.video?.trim();
  const isAbsoluteUrl = /^https?:\/\//i.test(rawVideoPath || "");
  const videoUrl = rawVideoPath
    ? isAbsoluteUrl
      ? rawVideoPath
      : `${mediaBase}/${rawVideoPath}`
    : null;

  const fetchCourse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(apiUrl + `/course-access/${params.id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCourse(result.data);
        setActivity(result.active_lesson);
      } else {
        const result = await response.json().catch(() => null);
        setError(result?.message || "Failed to fetch course");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setError("Something went wrong while fetching this course.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCourse();
  }, [params.id]);
  return (
    <Layout>
      {loading && (
        <section className="section-5 my-5">
          <div className="container">
            <div className="alert alert-info mb-0">Loading course...</div>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="section-5 my-5">
          <div className="container">
            <div className="alert alert-danger mb-0">{error}</div>
          </div>
        </section>
      )}

      {course && (
        <section className="section-5 my-5">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <div className="ratio ratio-16x9 mb-3">
                  <video
                    className="w-100 h-100"
                    controls
                    preload="metadata"
                    src={videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="meta-content">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1">
                    <h3 className="pt-2">{activity?.title}</h3>
                    <div>
                      <button type="button" className="btn btn-primary px-3">
                        Mark as complete{" "}
                        <IoMdCheckmarkCircleOutline size={20} />{" "}
                      </button>
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: activity?.description || "",
                    }}
                  ></div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card rounded-0">
                  <div className="card-body">
                    <div className="h6">
                      <strong>{course?.title}</strong>
                    </div>
                    <div className="py-2">
                      <ProgressBar now={0} />
                      <div className="pt-2">0% complete</div>
                    </div>
                    <Accordion defaultActiveKey="0" flush>
                      {course &&
                        course.chapters.map((chapter, index) => (
                          <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>{chapter.title}</Accordion.Header>
                            <Accordion.Body className="pt-2 pb-0 ps-0">
                              <ul className="lessons mb-0">
                                {chapter.lessons &&
                                  chapter.lessons.map((lesson, index) => (
                                    <li className="pb-2" key={lesson.id || index}>
                                      <button
                                        type="button"
                                        onClick={() => setActivity(lesson)}
                                        className="btn btn-link d-flex align-items-center text-decoration-none p-0"
                                      >
                                        <MdSlowMotionVideo
                                          size={20}
                                          className="me-3"
                                        />{" "}
                                        {lesson.title}
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default WatchCourses;
