import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import NewEntity from "./containers/NewEntity/NewEntity";
import Dashboard from "./containers/Dashboard/Dashboard";
import Entity from "./containers/Entity/Entity";
import Settings from "./containers/Settings/Settings";
import Billing from "./containers/Billing/Billing";
import ForgotPassword from "./containers/ForgotPassword/ForgotPassword";
import ChangePassword from "./containers/ChangePassword/ChangePassword";
import ChangeEmail from "./containers/ChangeEmail/ChangeEmail";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/register">
        <Register />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/login/forgot">
        <ForgotPassword />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/dashboard">
        <Dashboard />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/entities/new">
        <NewEntity />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/entities/:id">
        <Entity />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/settings">
        <Settings />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/settings/billing">
        <Billing />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/settings/password">
        <ChangePassword />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/settings/email">
        <ChangeEmail />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
