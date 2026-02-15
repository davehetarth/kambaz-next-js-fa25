import Link from "next/link";
export default function CourseNavigation() {
  return (
    <div
      className="rounded-0 border-0 list-group fs-5"
      id="wd-courses-navigation"
    >
      <Link
        className="list-group-item active"
        href="/Courses/1234/Home"
        id="wd-course-home-link"
      >
        Home
      </Link>

      <Link
        className="list-group-item text-danger border-0"
        href="/Courses/1234/Modules"
        id="wd-course-modules-link"
      >
        Modules
      </Link>

      <Link
        className="list-group-item text-danger  border-0"
        href="/Courses/1234/Piazza"
        id="wd-course-piazza-link"
      >
        Piazza
      </Link>

      <Link
        className="list-group-item text-danger  border-0"
        href="/Courses/1234/Zoom"
        id="wd-course-zoom-link"
      >
        Zoom
      </Link>

      <Link
        className="list-group-item text-danger  border-0"
        href="/Courses/1234/Assignments"
        id="wd-course-quizzes-link"
      >
        Assignments
      </Link>

      <Link
        className="list-group-item text-danger  border-0"
        href="/Courses/1234/Quizzes"
        id="wd-course-assignments-link"
      >
        Quizzes
      </Link>

      <Link
        className="list-group-item text-danger border-0"
        href="/Courses/1234/Grades"
        id="wd-course-grades-link"
      >
        Grades
      </Link>

      <Link
        className="list-group-item text-danger border-0"
        href="/Courses/1234/People/Table"
        id="wd-course-people-link"
      >
        People
      </Link>
    </div>
  );
}
