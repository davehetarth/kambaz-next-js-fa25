"use client";
import { useParams } from "next/navigation";
// REMOVED unused and incorrect DB import for a client component:
// import * as db from "../../../../Database";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../Details";
import Link from "next/link";

// Ensure this interface is exported so the parent page can use it if needed
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
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
  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            // This will now call the parent's fetchUsersForCourse function
            fetchUsers();
          }}
        />
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
          {users.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }} // Added cursor pointer for better UX
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>
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
    </div>
  );
}
