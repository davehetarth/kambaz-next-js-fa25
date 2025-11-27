"use client";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../Details";

// FIX 1: Update Interface to match mixed data (Seeded vs New Users)
// New users from SignUp only have 'username', not firstName/lastName initially.
export interface User {
  _id: string;
  username: string; // Add username (present in both)
  firstName?: string; // Optional
  lastName?: string; // Optional
  loginId?: string; // Optional
  section?: string; // Optional
  role?: string;
  lastActivity?: string; // Optional
  totalActivity?: string; // Optional
  email?: string;
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
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  {/* FIX 2: Render logic to handle missing names */}
                  {user.firstName || user.lastName ? (
                    <>
                      <span className="wd-first-name">{user.firstName}</span>{" "}
                      <span className="wd-last-name">{user.lastName}</span>
                    </>
                  ) : (
                    <span className="wd-username fst-italic text-muted">
                      {user.username}
                    </span>
                  )}
                </span>
              </td>
              {/* FIX 3: Fallbacks for missing data */}
              <td className="wd-login-id">{user.loginId || "N/A"}</td>
              <td className="wd-section">{user.section || "N/A"}</td>
              <td className="wd-role">{user.role || "USER"}</td>
              <td className="wd-last-activity">{user.lastActivity || "N/A"}</td>
              <td className="wd-total-activity">
                {user.totalActivity || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
