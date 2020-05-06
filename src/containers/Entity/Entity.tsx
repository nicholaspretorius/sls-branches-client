import React, { useRef, useState, useEffect, FormEvent } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { API, Storage } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import { s3Upload } from "../../libs/aws";
import config from "../../config";
import { IEntity } from "../../models/interfaces";
import { loadEntities } from "../../libs/apiEntities";
const axios = require("axios");

export default function Entity() {
  const file: any = useRef(null);
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [country_name, setCountryName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [attachment, setAttachment] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [attachmentURL, setAttachmentURL] = useState("");
  const [entity, setEntity] = useState<IEntity | null>(null);
  const [parentName, setParentName] = useState("");
  const [entities, setEntities] = useState<any | any[]>([]);
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

        // Setup parent entity
        const entities = await loadEntities();

        let parentName: string;
        if (entity.parentId) {
          parentName = entities.filter((ent: IEntity) => ent.entityId === entity.parentId)[0].name;
        } else {
          parentName = "";
        }

        // Setup countries
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
        setEntities(entities);
        setEntity(entity);
        setParentName(parentName);
        setName(entity.name);
        setCountryName(entity.country[0].countryName);
        setAttachmentURL(entity.attachmentURL);
        setAttachment(entity.attachment);
        setEmail(
          entity.contacts.find((contact: any) => contact.contactType === "email").contactHandle
        );
        setTelephone(
          entity.contacts.find((contact: any) => contact.contactType === "telephone").contactHandle
        );
        setLocation(entity.location);
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

      let parentEntity;
      if (parentName !== "") {
        parentEntity = entities.filter((ent: any) => ent.name === parentName);
      } else {
        parentEntity = "";
      }

      const updateEntity = {
        name,
        parentId: parentEntity ? parentEntity.entityId : "",
        country: selectedCountry,
        contacts: [
          {
            contactType: "email",
            contactHandle: email,
          },
          {
            contactType: "telephone",
            contactHandle: telephone,
          },
        ],
        location,
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

          <Form.Group controlId="parentName">
            <Form.Label>Parent Entity</Form.Label>
            <Form.Control
              as="select"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
            >
              <option>Please select</option>
              {entities.map((entity: any) => (
                <option key={entity.entityId}>{entity.name}</option>
              ))}
            </Form.Control>
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
          <Form.Group controlId="telephone">
            <Form.Label>Telephone</Form.Label>
            <Form.Control
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              type="tel"
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId="lat">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  placeholder="Latitude coordinates in format: 48.198921"
                  value={location.lat}
                  onChange={(e) => setLocation({ lat: e.target.value, lng: location.lng })}
                  type="text"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lng">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  placeholder="Longitude coordinates in format: 11.601885"
                  value={location.lng}
                  onChange={(e) => setLocation({ lat: location.lat, lng: e.target.value })}
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>
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
