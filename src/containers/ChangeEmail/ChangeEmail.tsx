import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { useFormFields } from "../../libs/hooks";
import { onError } from "../../libs/error";
import "./ChangeEmail.css";

export default function ChangeEmail() {
  const history = useHistory();
  const [codeSent, setCodeSent] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  function validateEmailForm() {
    return fields.email.length > 0;
  }

  function validateConfirmForm() {
    return fields.code.length > 0;
  }

  async function handleUpdateClick(event: any) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: fields.email });
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
      await Auth.verifyCurrentUserAttributeSubmit("email", fields.code);

      history.push("/settings");
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  function renderUpdateForm() {
    return (
      <Form onSubmit={handleUpdateClick}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
        </Form.Group>
        <LoadingButton
          block
          type="submit"
          isLoading={isSendingCode}
          disabled={!validateEmailForm()}
        >
          Update Email
        </LoadingButton>
      </Form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <Form.Group controlId="code">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control autoFocus type="tel" value={fields.code} onChange={handleFieldChange} />
          <Form.Text>Please check your email ({fields.email}) for the confirmation code.</Form.Text>
        </Form.Group>
        <LoadingButton
          block
          type="submit"
          isLoading={isConfirming}
          disabled={!validateConfirmForm()}
        >
          Confirm
        </LoadingButton>
      </form>
    );
  }

  return (
    <div className="ChangeEmail">{!codeSent ? renderUpdateForm() : renderConfirmationForm()}</div>
  );
}
