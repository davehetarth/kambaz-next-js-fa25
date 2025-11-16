"use client";
import Link from "next/link";
import AssignmentsControl from "./AssignmentsControl";
import { ListGroup } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { ListGroupItem } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { Badge } from "react-bootstrap";
import { FaRegEdit, FaCheckCircle, FaPlus, FaCaretDown } from "react-icons/fa";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { deleteAssignment, setAssignments } from "./reducer";
import { Button } from "react-bootstrap";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useEffect } from "react";
import * as client from "./../../../Courses/client";
import "./styles.css";

export default function Assignments() {
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentReducer
  );
  const { cid } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";
  const fetchAssignments = async () => {
    if (cid) {
      const assignments = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    }
  };
  useEffect(() => {
    fetchAssignments();
  }, [cid]);
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      try {
        await client.deleteAssignment(assignmentId);
        dispatch(deleteAssignment(assignmentId));
      } catch (err) {
        console.error("Failed to delete assignment", err);
      }
    }
  };

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
            {canEdit && (
              <button className="btn">
                <BsThreeDotsVertical />
              </button>
            )}
          </div>
        </div>
        {/* Assignments List (remains the same) */}
        <ListGroup>
          {assignments
            // .filter((assignment) => assignment.course === cid)
            .map((assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="d-flex align-items-center assignment-item p-3"
              >
                <BsGripVertical className="me-3" />
                <FaRegEdit className="me-4 text-success" size={24} />
                <div className="flex-grow-1">
                  <Link
                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                    className="fw-bold text-dark text-decoration-none"
                  >
                    {assignment.title}
                  </Link>

                  <p className="mb-0 text-muted small">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <b>
                      Not available until{" "}
                      {assignment.availablefrom.split("T")[0]}
                    </b>{" "}
                    |<br />
                    <b>Due</b> {assignment.due.split("T")[0]} |{" "}
                    {assignment.points} pts
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="text-success me-3" />
                  {canEdit && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteAssignment(assignment._id)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                  {canEdit && (
                    <div>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          router.push(
                            `/Courses/${cid}/Assignments/${assignment._id}`
                          )
                        }
                      >
                        <FaPencilAlt />
                      </Button>
                      <BsThreeDotsVertical />
                    </div>
                  )}
                </div>
              </ListGroupItem>
            ))}
        </ListGroup>
      </div>
    </div>
  );
}
