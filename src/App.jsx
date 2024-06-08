import React from "react";
import Header from "./components/Header";
import Board from "./components/Board";
import Instructions from "./components/Instructions";
import "./index.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Instructions />
        <Board />
      </div>
    </div>
  );
}

export default App;
