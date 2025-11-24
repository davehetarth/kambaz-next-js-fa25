"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../Courses/reducer";
import { setCurrentUser } from "../Users/reducer";
import Link from "next/link";
import {
  FormControl,
  Card,
  CardImg,
  CardText,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { RootState } from "../store";
import { setEnrollments, addEnrollment, removeEnrollment } from "./reducer";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";
import * as userClient from "../Users/client";
import { Course } from "../Courses/client";

// Define a flexible interface to avoid 'any' for mixed enrollment state
interface EnrollmentCheck {
  _id: string; // Present in Course objects
  course?: string; // Present in Enrollment objects (optional)
}

export default function Dashboard() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const router = useRouter();
  // Default enrollments to an empty array to avoid errors before fetch completes
  const { enrollments = [] } = useSelector(
    (state: RootState) => state.enrollmentReducer
  );
  // Default courses to an empty array
  const { courses = [] } = useSelector(
    (state: RootState) => state.coursesReducer
  );
  const dispatch = useDispatch();
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    location: "/images/reactjs.jpg",
    description: "New Description",
    department: "New Dept",
    credits: 3,
  });

  // Helpers for roles
  const canEdit = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  const checkSession = async () => {
    try {
      if (!currentUser) {
        const profile = await userClient.profile();
        dispatch(setCurrentUser(profile));
      }
    } catch (error) {
      // User is not logged in
    }
  };

  const fetchCourses = async () => {
    try {
      const courses = await client.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    if (currentUser) {
      try {
        const fetchedEnrollments = await client.findMyEnrollments();
        dispatch(setEnrollments(fetchedEnrollments));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    checkSession();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEnrollments();
    }
  }, [currentUser]);

  // --- Filtering Logic ---

  // 1. Create a Set of IDs for courses the current user belongs to for efficient lookup.
  // We handle the mixed types in the 'enrollments' state here.
  const myCourseIds = new Set(
    (enrollments as EnrollmentCheck[]).map((e) => e.course || e._id)
  );

  // 2. Determine which courses to display based on role.
  // If Faculty (canEdit), only show courses they are associated with.
  // If Student, show all visible courses.
  const coursesToDisplay = canEdit
    ? courses.filter((c) => myCourseIds.has(c._id))
    : courses;

  // Helper to check enrollment status for buttons (used by Students)
  const isEnrolled = (courseId: string) => {
    return myCourseIds.has(courseId);
  };

  const handleEnroll = async (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    try {
      const newEnrollment = await client.enrollIntoCourse(
        currentUser._id,
        courseId
      );
      dispatch(addEnrollment(newEnrollment));
    } catch (error) {
      console.error("Failed to enroll", error);
    }
  };

  const handleUnenroll = async (event: React.MouseEvent, courseId: string) => {
    event.stopPropagation();
    event.preventDefault();
    if (!currentUser) return;
    try {
      await client.unenrollFromCourse(currentUser._id, courseId);
      dispatch(removeEnrollment(courseId));
    } catch (error) {
      console.error("Failed to unenroll", error);
    }
  };

  const handleNavigate = (event: React.MouseEvent, courseId: string) => {
    // Students can only navigate if enrolled. Faculty can always navigate to their visible courses.
    if (isStudent && !isEnrolled(courseId)) {
      event.preventDefault();
      alert("You must be enrolled in this course to view it.");
    }
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(addNewCourse(newCourse));
    // Option: Auto-enroll faculty in course they just created if backend doesn't do it automatically
    // dispatch(addEnrollment(newCourse));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(deleteCourse(courseId));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(updateCourse(course));
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {canEdit && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
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
          {/* Use coursesToDisplay instead of courses */}
          {coursesToDisplay.map((course) => (
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
                    src={course.location || "/images/reactjs.jpg"}
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
                      {/* Requirement 1: Only students see enroll buttons */}
                      <div>
                        {isStudent && (
                          <>
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
                          </>
                        )}
                      </div>
                      {/* Faculty see edit buttons */}
                      {canEdit && (
                        <div>
                          <Button
                            onClick={(event) => {
                              event.preventDefault();
                              onDeleteCourse(course._id);
                            }}
                            className="me-1"
                            variant="danger"
                            size="sm"
                          >
                            Delete
                          </Button>
                          <Button
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
