"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../../Courses/[cid]/People/Table/page";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
  email: string;
}

interface NewUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  section: string;
  role: string;
}

export default function Users() {
  // State holds ALL users fetched from the server
  const [users, setUsers] = useState<User[]>([]);

  // State holds the filter criteria
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  // --- Data Fetching ---
  const fetchUsers = async () => {
    // This fetches ALL users needed for the page
    const fetchedUsers: User[] = await client.findAllUsers();
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- CRUD Operations ---
  const createUser = async () => {
    const newUserPayload: NewUserPayload = {
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    };

    try {
      await client.createUser(newUserPayload);
      // FIX: Refresh the list from the server to get the new user data
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  // --- Filtering Handlers ---
  // FIX: These functions only update the state variables
  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
  };

  // --- Client-side Filtering Logic (CRITICAL for display) ---
  const filteredUsers = users.filter((user) => {
    // 1. Name Filter
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesName =
      fullName.includes(nameFilter.toLowerCase()) || nameFilter === "";

    // 2. Role Filter
    const matchesRole = user.role === roleFilter || roleFilter === "";

    return matchesName && matchesRole;
  });

  return (
    <div>
      <h3>Users</h3>
      <div className="d-flex justify-content-between mb-4">
        {/* Search by Name */}
        <FormControl
          onChange={(e) => handleNameFilterChange(e.target.value)}
          value={nameFilter}
          placeholder="Search people"
          className="float-start w-25 me-2 wd-filter-by-name"
        />

        {/* Filter by Role */}
        <select
          value={roleFilter}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
          className="form-select float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>{" "}
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>{" "}
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>

        <button
          className="btn btn-success float-end wd-add-user"
          onClick={createUser}
        >
          + Add New User
        </button>
      </div>

      {/* FIX: Pass the calculated filtered list to PeopleTable */}
      <PeopleTable users={filteredUsers} fetchUsers={fetchUsers} />
    </div>
  );
}
