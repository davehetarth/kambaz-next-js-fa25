"use client";
import * as client from "../client";
// 1. Removed the old "redirect" import
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Button, FormControl } from "react-bootstrap";
import { RootState } from "../../store";

interface User {
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
  totalActivity: string;
}
export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  // 2. Removed the old, buggy "fetchProfile" function

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  // 3. This is the only useEffect you need.
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    } else {
      client
        .profile()
        .then((user) => {
          // This runs if the server sends back a user (200 OK)
          if (user) {
            dispatch(setCurrentUser(user));
            setProfile(user);
          } else {
            // This case should be rare, but good to have
            router.push("/Account/Signin");
          }
        })
        .catch((error) => {
          // --- THIS IS THE FIX ---
          // This runs if the server sends a 404 (not logged in)
          // or any other error.
          console.error("Profile fetch failed, redirecting to Signin.", error);
          router.push("/Account/Signin");
        });
    }
  }, [currentUser, router, dispatch]); // Removed the old, empty useEffect

  const updateProfile = async () => {
    if (profile) {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
    }
  };

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            value={profile.username || ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            value={profile.password || ""}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName || ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName || ""}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            // 4. Fixed: Date inputs need YYYY-MM-DD format
            value={profile.dob ? profile.dob.split("T")[0] : ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            // 5. Fixed: Added 'value' prop to sync with state
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>{" "}
            <option value="STUDENT">Student</option>
          </select>
          <div>
            <button
              onClick={updateProfile}
              className="btn btn-primary w-100 mb-2"
            >
              {" "}
              Update{" "}
            </button>

            <Button
              onClick={signout}
              className="w-100 mb-2"
              id="wd-signout-btn"
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
