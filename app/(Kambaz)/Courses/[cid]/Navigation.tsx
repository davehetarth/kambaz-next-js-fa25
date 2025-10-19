"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function CourseNavigation() {
  const { cid } = useParams();
  const pathname = usePathname();
  const links = [
    { href: "Home", label: "Home" },
    { href: "Modules", label: "Modules" },
    { href: "Piazza", label: "Piazza" },
    { href: "Zoom", label: "Zoom" },
    { href: "Assignments", label: "Assignments" },
    { href: "Quizzes", label: "Quizzes" },
    { href: "Grades", label: "Grades" },
    { href: "People/Table", label: "People" },
  ];
  return (
    <div
      className="rounded-0 border-0 list-group fs-5"
      id="wd-courses-navigation"
    >
      {links.map(({ href, label }) => (
        <Link
          key={href}
          className={`list-group-item ${
            pathname.includes(href) ? "active" : "text-danger border-0"
          }`}
          href={`/Courses/${cid}/${href}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
