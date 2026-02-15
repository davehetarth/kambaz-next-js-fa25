import Link from "next/link";
import AssignmentsControl from "./AssignmentsControl";
import { ListGroup } from "react-bootstrap";
import { ListGroupItem } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import { FaRegEdit, FaCheckCircle, FaPlus, FaCaretDown } from "react-icons/fa";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import "./styles.css";

export default function Assignments() {
  const assignments = [
    {
      id: "A1",
      title: "A1",
      moduleInfo: "Multiple Modules",
      availability: "Not available until May 6 at 12:00am",
      dueDate: "May 13 at 11:59pm",
      points: 100,
    },
    {
      id: "A2",
      title: "A2",
      moduleInfo: "Multiple Modules",
      availability: "Not available until May 13 at 12:00am",
      dueDate: "May 20 at 11:59pm",
      points: 100,
    },
    {
      id: "A3",
      title: "A3",
      moduleInfo: "Multiple Modules",
      availability: "Not available until May 20 at 12:00am",
      dueDate: "May 27 at 11:59pm",
      points: 100,
    },
  ];

  return (
    <div id="wd-assignments">
      <AssignmentsControl /> <br /> <br /> <br />
      <div className="mt-4 pe-5">
        {/* Assignments Header */}
        <div className="d-flex bg-secondary justify-content-between align-items-center border rounded-top p-3">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-3" />
            <FaCaretDown className="me-2" />
            <h3 className="mb-0">ASSIGNMENTS</h3>
          </div>
          <div className="d-flex align-items-center">
            <Badge bg="secondary" className="me-2 fs-6 text-dark">
              40% of Total
            </Badge>
            <button className="btn">
              <FaPlus />
            </button>
            <button className="btn">
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>
        {/* Assignments List (remains the same) */}
        <ListGroup>
          {assignments.map((assignment) => (
            <ListGroupItem
              key={assignment.id}
              className="d-flex align-items-center assignment-item p-3"
            >
              <BsGripVertical className="me-3" />
              <FaRegEdit className="me-4 text-success" size={24} />
              <div className="flex-grow-1">
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="fw-bold text-dark text-decoration-none"
                >
                  {assignment.title}
                </Link>
                <p className="mb-0 text-muted small">
                  <span className="text-danger">{assignment.moduleInfo}</span> |{" "}
                  <b>{assignment.availability}</b> |<br />
                  <b>Due</b> {assignment.dueDate} | {assignment.points} pts
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FaCheckCircle className="text-success me-3" />
                <BsThreeDotsVertical />
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
}
