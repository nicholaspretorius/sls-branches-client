import * as React from "react";

import "./Header.css";

type Props = {
  title?: string;
};

const Header: React.SFC<Props> = ({ title = "Default App Name" }: Props) => {
  return (
    <nav className="main_nav">
      <h1>{title}</h1>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Register</li>
        <li>Login</li>
      </ul>
    </nav>
  );
};

export default Header;
