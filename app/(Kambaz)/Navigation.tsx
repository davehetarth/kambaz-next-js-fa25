"use client";
import Link from "next/link";
import { FaRegUserCircle, FaRegCalendarAlt, FaSchool } from "react-icons/fa";
import { MdDashboard, MdMoveToInbox } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { CiBeaker1 } from "react-icons/ci";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: MdDashboard },
    { label: "Courses", path: "/Dashboard", icon: FaBook },
    { label: "Calendar", path: "/Calendar", icon: FaRegCalendarAlt },
    { label: "Inbox", path: "/Inbox", icon: MdMoveToInbox },
    { label: "Labs", path: "/Labs", icon: CiBeaker1 },
  ];

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 "
      style={{ width: 140 }}
      id="wd-kambaz-navigation"
    >
      <ListGroupItem
        as={Link}
        className="bg-black text-white border-0 text-center"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
        target="_blank"
      >
        <FaSchool className="fs-1" />
        <br />
        Northeastern
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        href="/Account"
        className={`text-center border-0 bg-black 
      ${
        pathname.includes("Account")
          ? "bg-white text-danger"
          : "bg-black text-white"
      }`}
      >
        <FaRegUserCircle
          className={`fs-1 ${
            pathname.includes("Account") ? "text-danger" : "text-white"
          }`}
        />
        <br />
        Account
      </ListGroupItem>
      {links.map((link) => (
        <ListGroupItem
          key={link.path}
          as={Link}
          href={link.path}
          className={`bg-black text-center border-0 ${
            pathname.includes(link.label)
              ? "text-danger bg-white"
              : "text-white bg-black"
          }`}
        >
          {link.icon({ className: "fs-1 text-danger" })}
          <br />
          {link.label}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
