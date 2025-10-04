import Link from "next/link";
import { FaRegUserCircle, FaRegCalendarAlt, FaSchool } from "react-icons/fa";
import { MdDashboard, MdMoveToInbox } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import { CiBeaker1 } from "react-icons/ci";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function KambazNavigation() {
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
        className="bg-black text-white border-0 text-center"
        href="/Account"
        id="wd-account-link"
      >
        <FaRegUserCircle className="fs-1" /> <br />
        Account
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        className="bg-white text-danger border-0 text-center"
        href="/Dashboard"
        id="wd-dashboard-link"
      >
        <MdDashboard className="fs-1" />
        <br />
        Dashboard
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        className="bg-black text-white border-0 text-center"
        href="/Dashboard"
        id="wd-course-link"
      >
        <FaBook className="fs-1 text-danger" /> <br />
        Courses
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        className="bg-black text-white border-0 text-center"
        href="/Calendar"
        id="wd-calendar-link"
      >
        <FaRegCalendarAlt className="fs-1 text-danger" /> <br />
        Calendar
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        className="bg-black text-white border-0 text-center"
        href="/Inbox"
        id="wd-inbox-link"
      >
        <MdMoveToInbox className="fs-1 text-danger" /> <br />
        Inbox
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        className="bg-black text-white border-0 text-center"
        href="/Labs/Lab1"
        id="wd-labs-link"
      >
        <CiBeaker1 className="fs-1 text-danger" /> <br />
        Labs
      </ListGroupItem>
    </ListGroup>
  );
}
