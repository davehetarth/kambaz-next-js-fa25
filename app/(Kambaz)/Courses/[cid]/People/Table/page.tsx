"use client";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle, FaTimes } from "react-icons/fa";
import PeopleDetails from "../Details"; // Assuming this path is correct
import Link from "next/link";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
}

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: User[];
  fetchUsers: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  // Find the user object for the details component based on showUserId (optional, for convenience)
  const selectedUser = users.find((u) => u._id === showUserId);

  return (
    <div id="wd-people-table">
      {/* Conditional Rendering of PeopleDetails Modal Overlay */}
      {showDetails && selectedUser && (
        <div
          // Overlay to cover the screen and center the modal
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow-lg position-relative"
            style={{ minWidth: "400px", maxWidth: "80vw" }}
          >
            {/* Close Button (X) at the top right */}
            <Link
              href="#"
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(false);
              }}
              title="Close"
            >
              <FaTimes />
            </Link>

            {/* People Details Component (The actual form) */}
            <PeopleDetails
              uid={showUserId}
              onClose={() => {
                setShowDetails(false); // 1. Hide the details component
                fetchUsers(); // 2. Refresh the users list
              }}
            />
          </div>
        </div>
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id}>
              {/* Corrected <td> structure with click handler */}
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {users.length === 0 && (
        <div className="p-3 text-center text-muted">
          No users found for this course.
        </div>
      )}
    </div>
  );
}
