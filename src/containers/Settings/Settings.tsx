import React from "react";
import { LinkContainer } from "react-router-bootstrap";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import "./Settings.css";

export default function Settings() {
  return (
    <div className="Settings">
      <LinkContainer to="/settings/email">
        <LoadingButton block>Change Email</LoadingButton>
      </LinkContainer>
      <LinkContainer to="/settings/password">
        <LoadingButton block>Change Password</LoadingButton>
      </LinkContainer>
      <LinkContainer to="/settings/billing">
        <LoadingButton block>Billing</LoadingButton>
      </LinkContainer>
    </div>
  );
}
