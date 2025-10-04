import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signin-screen" className="ms-4">
      <h1>Sign up</h1>
      <FormControl
        id="wd-username"
        placeholder="username"
        className="mb-2 w-50"
      />
      <br />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2 w-50"
      />
      <br />
      <Link
        id="wd-signup-btn"
        href="/Account/Profile"
        className="btn btn-primary w-50 mb-2"
      >
        Sign up{" "}
      </Link>
      <br />
      <Link id="wd-signin-link" href="/Account/Signin">
        Sign in
      </Link>
    </div>
  );
}
