import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

import { AppContext } from "../../libs/context";
import Header from "../../components/Header/Header";
import Routes from "../../Routes";

import "./App.css";

const App = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  return !isAuthenticating ? (
    <div className="App container">
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Header title="Branchly" />
        <Routes />
      </AppContext.Provider>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default App;
