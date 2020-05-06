import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { API } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import config from "../../config";
import { onError } from "../../libs/error";
import { useFormFields } from "../../libs/hooks";
import { s3Upload } from "../../libs/aws";
import { loadEntities } from "../../libs/apiEntities";
import "./NewEntity.css";
const axios = require("axios");

export default function NewEntity() {
  const file: any = useRef(null);
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    parent: "",
    country_name: "",
    lat: "",
    lng: "",
    email: "",
    telephone: "",
    twitter: "",
    instgram: "",
    facebook: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lCountries, setCountries] = useState<any | any[]>([]);
  const [entities, setEntities] = useState<any | any[]>([]);
  const {
    name,
    parent,
    country_name,
    email,
    lat,
    lng,
    telephone,
    twitter,
    facebook,
    instagram,
    website,
  } = fields;

  useEffect(() => {
    async function loadCountries() {
      const restCountries = await axios.get("https://restcountries.eu/rest/v2/all");

      return restCountries;
    }

    async function onLoad() {
      const entities = await loadEntities();
      const rCountries = await loadCountries();
      const lCountries = rCountries.data.map((c: any) => {
        const country = {
          countryName: c.name,
          countryCode: c.alpha2Code,
        };

        return country;
      });
      setCountries(lCountries);
      setEntities(entities);
    }

    onLoad();
  }, []);

  function validateForm() {
    return name.length > 0 && country_name.length > 0 && email.length > 0;
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

      const country = lCountries!.filter((country: any) => country.countryName === country_name);

      let parentEntity;
      if (parent) {
        parentEntity = entities.filter((entity: any) => entity.name === parent)[0];
        console.log("Parent: ", parentEntity);
      } else {
        parentEntity = "";
      }

      const newEntity = {
        name,
        parentId: parentEntity !== "" ? parentEntity.entityId : "",
        country,
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
        channels: [
          {
            channelType: "twitter",
            channelHandle: twitter,
          },
          {
            channelType: "instagram",
            channelHandle: instagram,
          },
          {
            channelType: "facebook",
            channelHandle: facebook,
          },
        ],
        website,
        location: {
          lat,
          lng,
        },
        attachment,
      };
      await createEntity(newEntity);
      history.push("/dashboard");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createEntity(data: any) {
    return API.post("branches", "/entities", {
      body: data,
    });
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Branch Name</Form.Label>
          <Form.Control value={name} onChange={handleFieldChange} type="text" />
        </Form.Group>
        <Form.Group controlId="parent">
          <Form.Label>Parent Entity</Form.Label>
          <Form.Control as="select" value={parent} onChange={handleFieldChange}>
            <option>Please select</option>
            {entities.map((entity: any) => (
              <option key={entity.entityId}>{entity.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="country_name">
          <Form.Label>Country</Form.Label>
          <Form.Control as="select" value={country_name} onChange={handleFieldChange}>
            <option>Please select</option>
            {lCountries.map((c: any) => (
              <option key={c.countryCode}>{c.countryName}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={handleFieldChange} type="email" />
        </Form.Group>
        <Form.Group controlId="telephone">
          <Form.Label>Telephone</Form.Label>
          <Form.Control value={telephone} onChange={handleFieldChange} type="tel" />
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} md="4" controlId="twitter">
            <Form.Label>Twitter</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="twitterPrepend">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                value={twitter}
                onChange={handleFieldChange}
                placeholder="Twitter handle"
                aria-describedby="twitterPrepend"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your Twitter handle.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="instagram">
            <Form.Label>Instagram</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="instagramPrepend">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                value={instagram}
                onChange={handleFieldChange}
                placeholder="Instagram handle"
                aria-describedby="instagramPrepend"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your Instagram handle.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="facebook">
            <Form.Label>Facebook</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="facebookPrepend">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                value={facebook}
                onChange={handleFieldChange}
                placeholder="Facebook handle"
                aria-describedby="facebookPrepend"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your Facebook handle.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form.Row>
        <Form.Group controlId="website">
          <Form.Label>Website</Form.Label>
          <Form.Control value={website} onChange={handleFieldChange} type="url" />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="lat">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                placeholder="Latitude coordinates in format: 48.198921"
                value={lat}
                onChange={handleFieldChange}
                type="text"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lng">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                placeholder="Longitude coordinates in format: 11.601885"
                value={lng}
                onChange={handleFieldChange}
                type="text"
              />
            </Form.Group>
          </Col>
        </Row>
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
      </Form>
    </div>
  );
}
