import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import NewEntity from "./containers/NewEntity/NewEntity";
import Dashboard from "./containers/Dashboard/Dashboard";
import Entity from "./containers/Entity/Entity";
import Settings from "./containers/Settings/Settings";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact path="/entities/new">
        <NewEntity />
      </Route>
      <Route exact path="/entities/:id">
        <Entity />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
