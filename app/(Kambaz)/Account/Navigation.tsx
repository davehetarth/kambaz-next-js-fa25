"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();

  const isAdmin = currentUser && currentUser.role === "ADMIN";

  return (
    <div id="wd-account-navigation">
      <Nav variant="pills">
        {links.map((link) => (
          <NavItem key={link}>
            <NavLink
              as={Link}
              href={link}
              active={pathname.endsWith(link.toLowerCase())}
            >
              {link}
            </NavLink>
          </NavItem>
        ))}

        {isAdmin && (
          <NavItem key="Users">
            <NavLink
              as={Link}
              href={`/Account/Users`}
              active={pathname.endsWith("Users")}
            >
              Users
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </div>
  );
}
