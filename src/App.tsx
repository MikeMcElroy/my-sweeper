import React, { useState, useReducer } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Board } from "./ComplicatedComponents/Board";

function App() {
  const [key, refresh] = useReducer((state) => state + 1, 0);
  const [won, setWon] = useState<boolean | null>(null);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {won === true && `YOU WON!`}
        {won === false && `YOU LOST! :-(`}
        MikeSweeper!
        <Board
          key={key}
          rows={20}
          columns={30}
          mines={40}
          onWin={() => setWon(true)}
          onLose={() => setWon(false)}
        />
        <a
          onClick={() => {
            setWon(null);
            refresh();
          }}
        >
          Refresh Game
        </a>
      </header>
    </div>
  );
}
export default App;
