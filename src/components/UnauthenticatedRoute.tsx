import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "../libs/context";

function queryString(name: string, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute(props: any) {
  const { children, ...rest } = props;
  const { isAuthenticated } = useAppContext();
  const redirect = queryString("redirect");
  return (
    <Route {...rest}>
      {!isAuthenticated ? (
        children
      ) : (
        <Redirect to={redirect === "" || redirect === null ? "/dashboard" : redirect} />
      )}
    </Route>
  );
}
