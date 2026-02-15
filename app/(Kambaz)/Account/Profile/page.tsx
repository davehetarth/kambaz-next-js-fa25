import Link from "next/link";
import { Dropdown, FormControl } from "react-bootstrap";
import { DropdownToggle, DropdownItem, DropdownMenu } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen" className="ms-4">
      <h1>Profile</h1>
      <FormControl
        id="wd-username"
        placeholder="username"
        defaultValue="alice"
        className="mb-2 w-50"
      />
      <br />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2 w-50"
        defaultValue="123"
      />
      <br />
      <FormControl
        id="wd-firstname"
        placeholder="First Name"
        defaultValue="Alice"
        className="mb-2 w-50"
      />
      <br />
      <FormControl
        id="wd-lastname"
        placeholder="Last Name"
        defaultValue="wonderland"
        className="mb-2 w-50"
      />
      <br />
      <FormControl
        id="wd-dob"
        type="date"
        placeholder="Last Name"
        defaultValue="2000-01-01"
        className="mb-2 w-50"
      />
      <br />
      <FormControl
        id="wd-email"
        type="email"
        defaultValue="alice@wonderland"
        className="mb-2 w-50"
      />
      <br />
      <FormControl id="wd-role" defaultValue="User" className="mb-2 w-50" />
      <br />
      <Link
        id="wd-signout-btn"
        href="/Account/Signin"
        className="btn btn-danger w-50 mb-2"
      >
        Signout{" "}
      </Link>
      <br />
    </div>
  );
}
