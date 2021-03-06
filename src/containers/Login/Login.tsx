import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";

import { useAppContext } from "../../libs/context";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import { useFormFields } from "../../libs/hooks";
import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const { email, password } = fields;

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      setIsLoading(false);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={email} onChange={handleFieldChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={handleFieldChange}
            type="password"
          ></Form.Control>
        </Form.Group>
        <Link to="/login/forgot">Forgot password?</Link>
        <LoadingButton
          block
          size="lg"
          disabled={!validateForm()}
          isLoading={isLoading}
          type="submit"
        >
          Login
        </LoadingButton>
      </Form>
    </div>
  );
}
