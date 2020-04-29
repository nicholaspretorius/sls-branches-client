import React from "react";
import "./App.css";

import Header from "../../components/Header/Header";

const App: React.FC = () => {
  return (
    <div className="App container">
      <Header title="Branchly" />
      <header className="App-header">
        <p>Hello world!</p>
      </header>
    </div>
  );
};

export default App;
