import React, { useState } from "react";

import { AppContext } from "../../libs/context";
import Header from "../../components/Header/Header";
import Routes from "../../Routes";

import "./App.css";

const App: React.FC = () => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  return (
    <div className="App container">
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Header title="Branchly" />
        <Routes />
      </AppContext.Provider>
    </div>
  );
};

export default App;
