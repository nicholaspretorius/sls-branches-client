import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <NotFound />
    </Switch>
  );
}
