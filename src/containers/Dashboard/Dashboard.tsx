import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useAppContext } from "../../libs/context";
import { onError } from "../../libs/error";
import "./Dashboard.css";

export interface Contact {
  contactType: string;
  contactHandle: string;
}

export interface Country {
  countryCode: string;
  countryName: string;
  countryId?: string;
}

export interface Entity {
  entityId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  country: Country;
  contacts: Contact[];
}

export default function Dashboard() {
  const [entities, setEntities] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const entities = await loadEntities();
        setEntities(entities);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadEntities() {
    return API.get("branches", "/entities", {});
  }

  function renderEntitiesList(entities: Entity[]) {
    return [{}].concat(entities).map((entity: any, i) =>
      i !== 0 ? (
        <LinkContainer key={entity.entityId} to={`/entities/${entity.entityId}`}>
          <ListGroup.Item>
            {entity.name.trim().split("\n")[0]}
            <span>{"Created: " + new Date(entity.createdAt).toLocaleString()}</span>
          </ListGroup.Item>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/entities/new">
          <ListGroup.Item>
            <h4>
              <b>{"\uFF0B"}</b> Create a new entity
            </h4>
          </ListGroup.Item>
        </LinkContainer>
      )
    );
  }

  return (
    <div className="Dashboard">
      <h3>Dashboard</h3>
      <ListGroup>{!isLoading && renderEntitiesList(entities)}</ListGroup>
    </div>
  );
}
