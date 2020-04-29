import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import "./Header.css";

type Props = {
  title?: string;
};

const Header: React.SFC<Props> = ({ title = "Default App Name" }: Props) => {
  return (
    <Navbar collapseOnSelect>
      <Navbar.Brand>
        <Link to="/">{title}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar>
  );
};

export default Header;
