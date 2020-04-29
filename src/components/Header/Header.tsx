import React from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavItem } from "react-bootstrap";

import { useAppContext } from "../../libs/context";
import "./Header.css";

type Props = {
  title?: string;
};

const Header: React.SFC<Props> = ({ title = "Default App Name" }: Props) => {
  const { isAuthenticated, userHasAuthenticated } = useAppContext();
  console.log("isAuth? ", isAuthenticated);

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
  }

  return (
    <Navbar expand="lg">
      <Navbar.Brand>
        <Link to="/">{title}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          {isAuthenticated ? (
            <NavItem onClick={handleLogout}>Logout</NavItem>
          ) : (
            <>
              <LinkContainer to="/register">
                <NavItem>Register</NavItem>
              </LinkContainer>
              <LinkContainer to="/login">
                <NavItem>Login</NavItem>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
