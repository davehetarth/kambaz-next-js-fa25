import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FormControl } from "react-bootstrap";
import * as client from "../../../Account/client";

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string; //sad
}

export default function PeopleDetails({
  uid,
  onClose,
  fetchUsers, // <-- REQUIRED: Must be passed from parent
}: {
  uid: string | null;
  onClose: () => void;
  fetchUsers: () => void; // <-- Type definition added
}) {
  // FIX: Initialize with null to satisfy TypeScript
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  // ------------------------------------
  // DELETE USER LOGIC
  // ------------------------------------
  const deleteUser = async (userId: string) => {
    await client.deleteUser(userId);
    onClose();
    fetchUsers(); // Refresh parent component
  };

  // ------------------------------------
  // SAVE USER LOGIC - FIX IS HERE
  // ------------------------------------
  const saveUser = async () => {
    if (!user || !name) return;

    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // FIX: Explicitly cast the object as User to resolve 'not assignable' error on setUser
    const updatedUser: User = {
      ...user,
      firstName,
      lastName,
      _id: user._id,
    };

    await client.updateUser(updatedUser);

    setUser(updatedUser);
    setEditing(false);
    onClose();
    fetchUsers();
  };

  // ------------------------------------
  // FETCH USER LOGIC
  // ------------------------------------
  const fetchUser = async () => {
    if (!uid) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const fetchedUser: User = await client.findUserById(uid);

    setUser(fetchedUser);
    setName(`${fetchedUser.firstName} ${fetchedUser.lastName}`);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [uid]);

  if (!uid || isLoading || !user) {
    return (
      <div className="p-4 text-center text-muted">
        {isLoading ? "Loading user details..." : "Select a user"}
      </div>
    );
  }

  const userId = uid;

  return (
    <div className="wd-people-details p-2">
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4 wd-name">
        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2 wd-edit"
            style={{ cursor: "pointer" }}
          />
        )}
        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
            style={{ cursor: "pointer" }}
          />
        )}
        {!editing && (
          <div
            className="wd-name"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <FormControl
            className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>
      <b>Roles:</b> <span className="wd-roles"> {user.role} </span> <br />
      <b>Login ID:</b> <span className="wd-login-id"> {user.loginId} </span>{" "}
      <br />
      <b>Section:</b> <span className="wd-section"> {user.section} </span>{" "}
      <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span> <hr />
      <button
        onClick={() => deleteUser(userId)}
        className="btn btn-danger float-end wd-delete"
      >
        {" "}
        Delete{" "}
      </button>
      <button
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        {" "}
        Cancel{" "}
      </button>
    </div>
  );
}
