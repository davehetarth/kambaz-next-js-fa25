import { Button, InputGroup, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
export default function AssignmentsControl() {
  const { cid } = useParams();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEdit = currentUser?.role === "FACULTY";
  return (
    <div
      id="wd-modules-controls"
      className="mb-3 d-flex align-items-center pe-5"
    >
      {" "}
      <div className="position-relative w-50 me-2 ">
        <FaSearch
          className="position-absolute"
          style={{
            top: "50%",
            left: "12px",
            transform: "translateY(-50%)",
            color: "#6c757d",
          }}
        />

        <Form.Control
          type="text"
          placeholder="Search..."
          style={{
            paddingLeft: "40px",
            height: "48px",
          }}
        />
      </div>
      {canEdit && (
        <>
          <Button variant="secondary" size="lg" className="me-2 ms-auto">
            <FaPlus className="me-1" /> Group
          </Button>
          <Link
            href={`/Courses/${cid}/Assignments/new`}
            className="btn btn-danger btn-lg" // Use bootstrap classes to style the Link as a Button
          >
            <FaPlus className="me-1" /> Assignment
          </Link>
        </>
      )}
    </div>
  );
}
