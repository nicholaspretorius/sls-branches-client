import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import config from "../../config";
import { s3Upload } from "../../libs/aws";
import "./NewEntity.css";

export default function NewEntity() {
  const file: any = useRef(null);
  const history = useHistory();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return name.length > 0;
  }

  function handleFileChange(event: any) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createEntity({ name, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createEntity(content: any) {
    return API.post("branches", "/entities", {
      body: content,
    });
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control value={name} as="textarea" onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoadingButton
          block
          type="submit"
          bssize="large"
          bsstyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoadingButton>
      </form>
    </div>
  );
}
