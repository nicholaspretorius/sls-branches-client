import React, { useRef, useState, useEffect, FormEvent } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { API, Storage } from "aws-amplify";

import LoadingButton from "../../components/LoadingButton/LoadingButton";
import { onError } from "../../libs/error";
import { s3Upload } from "../../libs/aws";
import config from "../../config";
import { IEntity, IChannel } from "../../models/interfaces";
import { loadEntities } from "../../libs/apiEntities";
const axios = require("axios");

const emptyAddress = {
  address1: "",
  address2: "",
  cityTown: "",
  areaState: "",
  areaCode: "",
};

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
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState(emptyAddress);
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
        setWebsite(entity.website);
        setTwitter(
          entity.channels
            ? entity.channels.find((channel: IChannel) => channel.channelType === "twitter")
                .channelHandle
            : ""
        );
        setInstagram(
          entity.channels
            ? entity.channels.find((channel: IChannel) => channel.channelType === "instagram")
                .channelHandle
            : ""
        );
        setFacebook(
          entity.channels
            ? entity.channels.find((channel: IChannel) => channel.channelType === "facebook")
                .channelHandle
            : ""
        );

        setEmail(
          entity.contacts.find((contact: any) => contact.contactType === "email").contactHandle
        );
        setTelephone(
          entity.contacts.find((contact: any) => contact.contactType === "telephone").contactHandle
        );
        setLocation(entity.location);
        setAddress(entity.address || emptyAddress);
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

      const channels = [
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
      ];

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
        channels,
        website,
        address,
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
                  onChange={(e) => setTwitter(e.target.value)}
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
                  onChange={(e) => setInstagram(e.target.value)}
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
                  onChange={(e) => setFacebook(e.target.value)}
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
            <Form.Control value={website} onChange={(e) => setWebsite(e.target.value)} type="url" />
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

          <Form.Group controlId="address1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              placeholder="1234 Main St"
              value={address.address1}
              onChange={(e) =>
                setAddress({
                  address1: e.target.value,
                  address2: address.address2,
                  cityTown: address.cityTown,
                  areaState: address.areaState,
                  areaCode: address.areaCode,
                })
              }
              type="text"
            />
          </Form.Group>

          <Form.Group controlId="address2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              placeholder="Apartment, studio, or floor"
              value={address.address2}
              onChange={(e) =>
                setAddress({
                  address1: address.address1,
                  address2: e.target.value,
                  cityTown: address.cityTown,
                  areaState: address.areaState,
                  areaCode: address.areaCode,
                })
              }
              type="text"
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="cityTown">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={address.cityTown}
                onChange={(e) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    cityTown: e.target.value,
                    areaState: address.areaState,
                    areaCode: address.areaCode,
                  })
                }
                type="text"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="areaState">
              <Form.Label>State</Form.Label>
              <Form.Control
                value={address.areaState}
                onChange={(e) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    cityTown: address.cityTown,
                    areaState: e.target.value,
                    areaCode: address.areaCode,
                  })
                }
                type="text"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="areaCode">
              <Form.Label>Zip/Area Code</Form.Label>
              <Form.Control
                value={address.areaCode}
                onChange={(e) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    cityTown: address.cityTown,
                    areaState: address.areaState,
                    areaCode: e.target.value,
                  })
                }
                type="text"
              />
            </Form.Group>
          </Form.Row>

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
