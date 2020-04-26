import React from "react";
import "./App.css";

import Header from "../../components/Header/Header";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <p>Hello world!</p>
      </header>
      <section>
        <p>Can you see me?</p>
      </section>
    </div>
  );
};

export default App;
