"use client";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import Link from "next/link";
import * as db from "../Database";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import { Card, CardImg, CardText, CardTitle, CardBody } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { RootState } from "../store";
import { enroll, unenroll } from "./reducer";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
  }
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const router = useRouter();
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentReducer
  );
  const [showAllCourses, setShowAllCourses] = useState(false);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    location: "/images/reactjs.jpg",
    description: "New Description",
  });

  const canEdit = currentUser?.role === "FACULTY";

  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (e) => e.user === currentUser._id && e.course === courseId
    );
  };

  const handleEnroll = (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    dispatch(enroll({ userId: currentUser._id, courseId: courseId }));
  };

  const handleUnenroll = (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    dispatch(unenroll({ userId: currentUser._id, courseId: courseId }));
  };

  const handleNavigate = (event: React.MouseEvent, courseId: string) => {
    if (!isEnrolled(courseId)) {
      event.preventDefault();
      alert("You must be enrolled in this course to view it.");
    }
  };

  const coursesToShow = showAllCourses
    ? courses
    : courses.filter((course) => isEnrolled(course._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <Button
        variant="primary"
        className="float-end"
        style={{ marginTop: "-50px" }}
        onClick={() => setShowAllCourses(!showAllCourses)}
      >
        {showAllCourses ? "My Enrollments" : "Show All Courses"}
      </Button>
      <hr />
      {canEdit && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => {
                dispatch(addNewCourse(course));
              }}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => {
                dispatch(updateCourse(course));
              }}
              id="wd-update-course-click"
            >
              Update{" "}
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
        </>
      )}
      <h2 id="wd-dashboard-published">Published Courses</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {coursesToShow.map((course: Course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => handleNavigate(e, course._id)}
                >
                  <CardImg
                    src={`${course.location}`}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-norap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    {/* --- New Enroll/Unenroll Buttons --- */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {isEnrolled(course._id) ? (
                          <Button
                            variant="danger"
                            className="me-1"
                            onClick={(e) => handleUnenroll(e, course._id)}
                            size="sm"
                          >
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            className="me-1"
                            onClick={(e) => handleEnroll(e, course._id)}
                            size="sm"
                          >
                            Enroll
                          </Button>
                        )}
                        <Button variant="primary">Go</Button>
                      </div>
                      {canEdit && (
                        <div>
                          <Button
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }}
                            // className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                            className="me-1"
                            variant="danger"
                            size="sm"
                          >
                            Delete
                          </Button>
                          <Button
                            id="wd-edit-course-click"
                            variant="warning"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            // className="btn btn-warning me-2 float-end"
                            size="sm"
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
