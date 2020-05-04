import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import config from "../../config";
import { onError } from "../../libs/error";
import { useFormFields } from "../../libs/hooks";
import { s3Upload } from "../../libs/aws";
// import { countries } from "../../models/data";
import "./NewEntity.css";
const axios = require("axios");

export default function NewEntity() {
  const file: any = useRef(null);
  const history = useHistory();
  // const [name, setName] = useState("");
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    country_name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // const [restCountries, setRestCountries] = useState<any | null>(null);
  const [lCountries, setCountries] = useState<any | any[]>([]);
  const { name, country_name, email } = fields;

  useEffect(() => {
    async function loadCountries() {
      const restCountries = await axios.get("https://restcountries.eu/rest/v2/all");

      return restCountries;
    }

    async function onLoad() {
      const rCountries = await loadCountries();
      const lCountries = rCountries.data.map((c: any) => {
        const country = {
          countryName: c.name,
          countryCode: c.alpha2Code,
        };

        return country;
      });
      // setRestCountries(rCountries.data);
      setCountries(lCountries);
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
      console.log("Country: ", country);

      const newEntity = {
        name,
        country,
        contacts: [
          {
            contactType: "email",
            contactHandle: email,
          },
        ],
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
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={handleFieldChange} type="text" />
        </Form.Group>
        <Form.Group controlId="country_name">
          <Form.Label>Country</Form.Label>
          <Form.Control
            as="select"
            data-live-search="true"
            value={country_name}
            onChange={handleFieldChange}
          >
            {lCountries.map((c: any) => (
              <option key={c.countryCode}>{c.countryName}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={handleFieldChange} type="email" />
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
      </Form>
    </div>
  );
}
