import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useFormFields } from "../../libs/hooks";
import { onError } from "../../libs/error";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSendCodeClick(event: any) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    } catch (error) {
      onError(error);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmClick(event: any) {
    event.preventDefault();

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(fields.email, fields.code, fields.password);
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <Form onSubmit={handleSendCodeClick}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </Form.Group>
        <LoadingButton block type="submit" isLoading={isSendingCode} disabled={!validateCodeForm()}>
          Send Confirmation
        </LoadingButton>
      </Form>
    );
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmClick}>
        <Form.Group controlId="code">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control autoFocus type="tel" value={fields.code} onChange={handleFieldChange} />
          <Form.Text className="text-muted">
            Please check your email ({fields.email}) for the confirmation code.
          </Form.Text>
        </Form.Group>
        <hr />
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoadingButton type="submit" isLoading={isConfirming} disabled={!validateResetForm()}>
          {" "}
          Confirm
        </LoadingButton>
      </Form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className="success">
        <FaThumbsUp className="react-icon" />
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">Click here to login with your new credentials.</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ForgotPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}
