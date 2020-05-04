import React from "react";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavItem } from "react-bootstrap";

import { useAppContext } from "../../libs/context";
import { onError } from "../../libs/error";
import "./Header.css";

type Props = {
  title?: string;
  user?: any;
};

const Header: React.SFC<Props> = ({ user, title = "Default App Name" }: Props) => {
  const history = useHistory();
  const { isAuthenticated, userHasAuthenticated } = useAppContext();

  async function handleLogout() {
    try {
      await Auth.signOut();
      userHasAuthenticated(false);
      history.push("/login");
    } catch (error) {
      onError(error);
    }
  }

  return (
    <Navbar expand="lg">
      <Navbar.Brand>
        <Link to="/">{title}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {isAuthenticated && (
          <Nav>
            <LinkContainer to="/dashboard">
              <NavItem>Dashboard</NavItem>
            </LinkContainer>
          </Nav>
        )}
        <Nav className="ml-auto">
          {isAuthenticated ? (
            <>
              <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                  {user.attributes.email}
                </Nav.Link>
              </Nav.Item>
              <LinkContainer to="/settings">
                <NavItem>Settings</NavItem>
              </LinkContainer>
              <NavItem onClick={handleLogout}>Logout</NavItem>
            </>
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
