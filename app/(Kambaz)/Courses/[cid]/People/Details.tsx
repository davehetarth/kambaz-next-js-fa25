import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as client from "../../../Account/client";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string; // Made optional
  email?: string; // Made optional
  dob?: string; // Made optional
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
}

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  // State for user data, name being edited, and edit mode toggle
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    onClose();
  };

  const saveUser = async () => {
    if (!user) return; // Should not happen due to guards, but for safety

    // Simple split: assumes first word is firstName, rest is lastName
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const updatedUser = { ...user, firstName, lastName };

    try {
      await client.updateUser(updatedUser);
      setUser(updatedUser); // Update local state immediately
    } catch (error) {
      console.error("Failed to save user:", error);
      // Revert UI changes on failure if necessary
    }

    setEditing(false);
    onClose(); // Close the drawer/modal
  };

  const fetchUser = async () => {
    if (!uid) return;
    const fetchedUser = await client.findUserById(uid);

    // Initialize user and name state simultaneously
    if (fetchedUser) {
      setUser(fetchedUser);
      setName(`${fetchedUser.firstName} ${fetchedUser.lastName}`);
    }
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  // Guard clause: If uid is null or user data is not yet loaded, return null.
  if (!uid || !user) {
    return null;
  }

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />{" "}
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />{" "}
      </div>
      <hr />
      {/* --- Name Display and Edit Toggle --- */}
      <div className="text-danger fs-4 wd-name d-flex align-items-center justify-content-between">
        {editing ? (
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <>
            {user.firstName} {user.lastName}
            <button
              onClick={() => setEditing(true)}
              className="btn btn-sm btn-outline-secondary ms-2 wd-edit-name-btn"
            >
              <FaPencil />
            </button>
          </>
        )}
      </div>
      <hr className="mt-2" />
      {/* --- User Details (Read-only) --- */}
      <b>Roles:</b> <span className="wd-roles"> {user.role} </span> <br />
      <b>Login ID:</b> <span className="wd-login-id"> {user.loginId} </span>{" "}
      <br />
      <b>Section:</b> <span className="wd-section"> {user.section} </span>{" "}
      <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span> <hr />
      {/* --- Action Buttons (Conditional) --- */}
      {editing ? (
        <>
          <button
            onClick={saveUser}
            className="btn btn-success float-end wd-save-changes"
          >
            <FaCheck className="me-1" /> Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="btn btn-secondary float-end me-2 wd-cancel-edit"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => deleteUser(uid)}
            className="btn btn-danger float-end wd-delete"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary float-end me-2 wd-cancel"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
