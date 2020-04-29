import * as React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import "./Header.css";

type Props = {
  title?: string;
};

const Header: React.SFC<Props> = ({ title = "Default App Name" }: Props) => {
  return (
    <Navbar expand="lg">
      <Navbar.Brand>
        <Link to="/">{title}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          <LinkContainer to="/register">
            <NavItem>Register</NavItem>
          </LinkContainer>
          <LinkContainer to="/login">
            <NavItem>Login</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
