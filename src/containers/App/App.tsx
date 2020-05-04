import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

import { AppContext } from "../../libs/context";
import Header from "../../components/Header/Header";
import Routes from "../../Routes";
import { onError } from "../../libs/error";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

import "./App.css";

const App = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      const user = await Auth.currentUserInfo();
      setUser(user);
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  return !isAuthenticating ? (
    <div className="App container">
      <ErrorBoundary>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Header title="Branchly" user={user} />
          <Routes />
        </AppContext.Provider>
      </ErrorBoundary>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default App;
