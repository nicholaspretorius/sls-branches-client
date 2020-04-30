import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { API, Storage } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import { s3Upload } from "../../libs/aws";
import config from "../../config";
import { IEntity } from "../../models/interfaces";

export default function Entity() {
  const file: any = useRef(null);
  const { id } = useParams();
  const history = useHistory();

  const [entity, setEntity] = useState<IEntity | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadEntity() {
      return API.get("branches", `/entities/${id}`, {});
    }

    async function onLoad() {
      try {
        const entity = await loadEntity();
        const { name, attachment } = entity;

        if (attachment) {
          entity.attachmentURL = await Storage.vault.get(attachment);
        }

        setName(name);
        setEntity(entity);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm(): boolean {
    return name.length > 0;
  }

  function formatFilename(str: string): string {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event: any) {
    file.current = event.target.files[0];
  }

  function saveEntity(entity: any) {
    return API.put("branches", `/entities/${id}`, {
      body: entity,
    });
  }

  async function handleSubmit(event: any) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveEntity({
        name,
        attachment: attachment, // || name.attachment
      });
      history.push("/dashboard");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteEntity() {
    return API.del("branches", `/entities/${id}`, {});
  }

  async function handleDelete(event: any) {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this entity?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEntity();
      history.push("/dashboard");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Entity">
      {entity && (
        <form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control value={name} as="textarea" onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          {entity.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <Form.Control>
                <a target="_blank" rel="noopener noreferrer" href={entity.attachmentURL}>
                  {formatFilename(entity.attachment)}
                </a>
              </Form.Control>
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!entity.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoadingButton
            block
            type="submit"
            bssize="large"
            variant="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoadingButton>
          <LoadingButton
            block
            bssize="large"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoadingButton>
        </form>
      )}
    </div>
  );
}
