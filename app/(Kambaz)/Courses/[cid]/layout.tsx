"use client";
import { ReactNode } from "react";
import { useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa6";
import { RootState } from "../../store";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
export default function CoursesLayout({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course) => course._id === cid);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setIsVisible(!isVisible)}
        />
        <Breadcrumb course={course} />
        {/* {course?.name} */}
      </h2>{" "}
      <hr />
      <div className="d-flex">
        <div className={`${isVisible ? "d-block" : "d-none"} `}>
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
