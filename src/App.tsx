import React, { useState, useReducer, useEffect, useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Board } from "./ComplicatedComponents/Board";

function clamp(min: number, number: number, max: number): number {
  if (number < min) {
    return min;
  } else if (number > max) {
    return max;
  }
  return number;
}

function App() {
  const [key, refresh] = useReducer((state) => state + 1, 0);
  const [won, setWon] = useState<boolean | null>(null);
  const [mines, setMines] = useState<number>(40);
  const [rows, setRows] = useState<number>(20);
  const [columns, setColumns] = useState<number>(30);

  // this effect will enforce the constraints of the game.
  // we can't have more mines than rows * columns
  useEffect(() => {
    setMines(clamp(1, mines, rows * columns))
    setRows(clamp(5, rows, 80))
    setColumns(clamp(5, columns, 80))
  }, [mines, rows, columns])

  const gameBoard = useMemo(
    () => (
      <Board
        key={key}
        rows={rows}
        columns={columns}
        mines={mines}
        onWin={() => setWon(true)}
        onLose={() => setWon(false)}
      />
    ),
    // This allows us to not refresh the game on every change of the state objects.
    // You must hit the refresh the game button each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <section className="App-mySweeper-game">
        {won === true && `YOU WON!`}
        {won === false && `YOU LOST! :-( `}
        <hr />
        My-Sweeper!
        {gameBoard}
        </section>
        <section className="App-mySweeper-config">
        <button
          onClick={() => {
            setWon(null);
            refresh();
          }}
        >
          Refresh Game
        </button>
        <p>
          <label>
            Number of mines:{" "}
            <input
              type="number"
              value={mines}
              onChange={(ev) =>
                setMines(parseInt(ev.target.value, 10) || mines)
              }
            />
          </label>
        </p>
        <p>
          <label>
            Number of rows:{" "}
            <input
              type="number"
              value={rows}
              onChange={(ev) => setRows(parseInt(ev.target.value, 10) || rows)}
            />
          </label>
        </p>
        <p>
          <label>
            Number of columns:{" "}
            <input
              type="number"
              value={columns}
              onChange={(ev) =>
                setColumns(parseInt(ev.target.value, 10) || columns)
              }
            />
          </label>
        </p>
      </section>
    </div>
  );
}
export default App;
