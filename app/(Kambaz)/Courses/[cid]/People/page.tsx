"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// Import the client fetcher provided in the prompt
import * as coursesClient from "../../client";
// Import the PeopleTable component provided in the prompt
// Adjust path as necessary based on your actual project structure
import PeopleTable from "./Table/page";

// Re-defining User interface here for state typing,
// ideally this is imported from a shared types file.
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
}

export default function CoursePeoplePage() {
  // 1. Retrieve the course ID from the URL parameters
  const { cid } = useParams();

  // 2. Manage state for the users list
  const [users, setUsers] = useState<User[]>([]);

  // 3. Define function to fetch data using the courses client
  const fetchUsersForCourse = async () => {
    if (!cid) return;
    try {
      const enrolledUsers = await coursesClient.findUsersForCourse(
        cid as string
      );
      setUsers(enrolledUsers);
    } catch (error) {
      console.error("Error fetching users for course:", error);
    }
  };

  // 4. Use useEffect to fetch data when the component mounts or cid changes
  useEffect(() => {
    fetchUsersForCourse();
  }, [cid]);

  return (
    <div>
      {/* 5. Render the PeopleTable, passing down the course-specific users and the fetch function */}
      <PeopleTable users={users} fetchUsers={fetchUsersForCourse} />
    </div>
  );
}
