import React from "react";
import Header from "../../components/Header/Header";
import Routes from "../../Routes";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App container">
      <Header title="Branchly" />
      <Routes />
    </div>
  );
};

export default App;
