import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { ISignUpResult } from "amazon-cognito-identity-js";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useAppContext } from "../../libs/context";
import { useFormFields } from "../../libs/hooks";
import { onError } from "../../libs/error";
import "./Register.css";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [newUser, setNewUser] = useState<ISignUpResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event: any) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text className="text-muted">Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoadingButton
          block
          type="submit"
          bssize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoadingButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoadingButton
          block
          type="submit"
          bssize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoadingButton>
      </Form>
    );
  }

  return (
    <div className="Register">{newUser === null ? renderForm() : renderConfirmationForm()}</div>
  );
}
