"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../Courses/reducer";
import Link from "next/link";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import { Card, CardImg, CardText, CardTitle, CardBody } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { RootState } from "../store";
// 1. Import the new enrollment reducers
import { setEnrollments, addEnrollment, removeEnrollment } from "./reducer";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";
import { Course } from "../Courses/client";
import { useEffect } from "react";

export default function Dashboard() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const router = useRouter();
  // 2. Get enrollments from the new reducer
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentReducer
  );
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
    department: "New Dept", // <-- ADD THIS
    credits: 3,
  });

  const canEdit = currentUser?.role === "FACULTY";

  // 3. New function to fetch all courses
  const fetchCourses = async () => {
    try {
      // Fetches ALL courses, not just enrolled ones
      const courses = await client.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  // 4. New function to fetch enrollments for the current user
  const fetchEnrollments = async () => {
    if (currentUser) {
      try {
        const enrollments = await client.findMyEnrollments();
        dispatch(setEnrollments(enrollments));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 5. useEffect to fetch both on load (or user change)
  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [currentUser]);

  // 6. New function to check enrollment status
  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course === courseId);
  };

  // 7. Make handleEnroll persistent
  const handleEnroll = async (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    try {
      const newEnrollment = await client.enrollInCourse(courseId);
      dispatch(addEnrollment(newEnrollment));
    } catch (error) {
      console.error("Failed to enroll", error);
    }
  };

  // 8. Make handleUnenroll persistent
  const handleUnenroll = async (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    try {
      await client.unenrollFromCourse(courseId);
      dispatch(removeEnrollment(courseId)); // Dispatch with courseId
    } catch (error) {
      console.error("Failed to unenroll", error);
    }
  };

  // --- 9. THIS IS THE SECURITY FIX ---
  const handleNavigate = (event: React.MouseEvent, courseId: string) => {
    if (currentUser?.role === "STUDENT" && !isEnrolled(courseId)) {
      // If user is a STUDENT and NOT enrolled, prevent navigation
      event.preventDefault();
      alert("You must be enrolled in this course to view it.");
    }
    // Faculty can navigate to any course
    // Enrolled students can navigate
  };
  // ------------------------------------------

  // 10. Fix Add/Delete/Update to use the correct reducers
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(addNewCourse(newCourse)); // Use addNewCourse
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(deleteCourse(courseId)); // Use deleteCourse
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(updateCourse(course)); // Use updateCourse
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <hr />
      {canEdit && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
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
          {courses.map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  // --- 11. ADD onClick HANDLER TO THE LINK ---
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
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {/* 12. Conditionally show Enroll/Unenroll */}
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
                      </div>
                      {canEdit && (
                        <div>
                          <Button
                            onClick={(event) => {
                              event.preventDefault();
                              onDeleteCourse(course._id);
                            }}
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
