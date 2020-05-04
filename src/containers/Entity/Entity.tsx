import React, { useRef, useState, useEffect, FormEvent } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { API, Storage } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import { s3Upload } from "../../libs/aws";
import config from "../../config";
// import { countries, countryList } from "../../models/data";
import { IEntity } from "../../models/interfaces";
const axios = require("axios");

export default function Entity() {
  const file: any = useRef(null);
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [country_name, setCountryName] = useState("");
  const [email, setEmail] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentURL, setAttachmentURL] = useState("");
  const [entity, setEntity] = useState<IEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [restCountries, setRestCountries] = useState<any | null>(null);
  const [lCountries, setCountries] = useState<any | any[]>([]);

  useEffect(() => {
    function loadEntity() {
      return API.get("branches", `/entities/${id}`, {});
    }

    async function loadCountries() {
      const restCountries = await axios.get("https://restcountries.eu/rest/v2/all");
      return restCountries;
    }

    async function onLoad() {
      try {
        const entity = await loadEntity();
        const { attachment } = entity;

        if (attachment) {
          entity.attachmentURL = await Storage.vault.get(attachment);
        }

        const rCountries = await loadCountries();
        const lCountries = rCountries.data.map((c: any) => {
          const country = {
            countryName: c.name,
            countryCode: c.alpha2Code,
          };

          return country;
        });
        //  setRestCountries(rCountries.data);
        setCountries(lCountries);

        setEntity(entity);
        setName(entity.name);
        setCountryName(entity.country[0].countryName);
        setAttachmentURL(entity.attachmentURL);
        setAttachment(entity.attachment);
        setEmail(entity.contacts[0].contactHandle);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    let attach;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attach = await s3Upload(file.current);
        console.log("File/Attach: ", attach);
      }

      const selectedCountry = lCountries.filter((c: any) => c.countryName === country_name);

      const updateEntity = {
        name,
        country: selectedCountry,
        contacts: [
          {
            contactType: "email",
            contactHandle: email,
          },
        ],
        attachment: attachment || attach || null,
        attachmentURL,
      };

      await saveEntity(updateEntity);
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
          {/* <Form.Group controlId="content">
            <Form.Control value={name} as="textarea" onChange={(e) => setName(e.target.value)} />
          </Form.Group> */}
          <Form.Group controlId="name">
            <Form.Label>Branch Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" />
          </Form.Group>
          <Form.Group controlId="country_name">
            <Form.Label>Country</Form.Label>
            <Form.Control
              as="select"
              value={country_name}
              // value={countries.filter((country) => country.countryName === country_name)}
              onChange={(e) => setCountryName(e.target.value)}
            >
              {lCountries.map((c: any) => (
                <option key={c.countryCode}>{c.countryName}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </Form.Group>
          {entity.attachment && (
            <Form.Group>
              <Form.Label>Attachment: </Form.Label>
              {/* <FormControl> */}
              <a target="_blank" rel="noopener noreferrer" href={attachmentURL}>
                {formatFilename(attachment)}
              </a>
              {/* </FormControl> */}
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!attachment && <Form.Label>Attachment</Form.Label>}
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
