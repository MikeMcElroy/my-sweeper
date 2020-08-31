import React, { useState, useEffect } from "react";
import { BoardState, GameStatus, Cell } from "../state";
import findNeighboringCells from "../BusinessLogic/findNeighboringCells";
import { reveal } from "../BusinessLogic/searching";
import { Cell as GameCell } from "../SimpleComponents/Cell";

export function Board({
  rows,
  columns,
  mines,
  onWin,
  onLose,
}: {
  rows: number
  columns: number
  mines: number
  onWin: () => void
  onLose: () => void
}): React.ReactElement {
  const [revealed, setRevealed] = useState<boolean[][] | null>(null);
  const [internalBoardState, setInternalBoardState] = useState<Cell[][] | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [flagged, setFlagged] = useState<boolean[][] | null>(null)

  useEffect(() => {
    let mine_array: [number, number][] = [];
    let cells: number[] = Array.from(new Array(rows * columns), () =>
      Math.random()
    );
    for (let i = 1; i < mines; i++) {
      const min = Math.min(...cells);
      const index = cells.indexOf(min);
      mine_array.push([Math.floor(index / columns), index % columns]);
      cells[index] = Infinity;
    }
    const board: BoardState = {
      cells: Array.from(new Array(rows), () =>
        Array.from(new Array(columns), () => ({ neighboringMines: 0 }))
      ),
      revealed: Array.from(new Array(rows), () =>
        Array.from(new Array(columns), () => false)
      ),
      flagged: Array.from(new Array(rows), () =>
        Array.from(new Array(columns), () => false)
      ),
      gameStatus: GameStatus.PLAYING,
    };
    mine_array.forEach(([row, col]) => {
      board.cells[row][col].neighboringMines = -1;
      findNeighboringCells(board.cells, row, col)
        .filter(([r, c]) => board.cells[r][c].neighboringMines !== -1)
        .forEach(([r, c]) => (board.cells[r][c].neighboringMines += 1));
    });

    setInternalBoardState(board.cells);
    setRevealed(board.revealed);
    setFlagged(board.flagged)
  }, [rows, columns, mines]);

  useEffect(() => {
    if (!revealed || !internalBoardState) {
      return
    }
    const revealedCells = revealed.flat()
    if (internalBoardState.flat().every(({ neighboringMines }, index) => neighboringMines === -1 ? true : revealedCells[index])) {
      setGameStatus(GameStatus.WIN)
    }
  }, [revealed, internalBoardState, setGameStatus])

  useEffect(() => {
    if (gameStatus === GameStatus.LOSE) {
      onLose()
    } else if (gameStatus === GameStatus.WIN) {
      onWin()
    }
  }, [gameStatus, onLose, onWin])

  if (!revealed || !internalBoardState || !flagged) {
    return <div>Waiting for the game to start...</div>;
  }

  const clickCell = function (row: number, column: number) {
    const newState = reveal(
      {
        cells: internalBoardState,
        revealed,
        gameStatus,
        flagged,
      },
      row,
      column
    );
    setInternalBoardState(newState.cells);
    setRevealed(newState.revealed);
    setGameStatus(newState.gameStatus);
  };
  return (
    <div>
      {internalBoardState.map((rows, rowIndex) =>
        <div key={rowIndex} style={{display:'flex', width: '250px', height: '50px'}}>
          {rows.map((column, columnIndex) => (
            <GameCell
              key={`${rowIndex}-${columnIndex}`}
              revealed={revealed[rowIndex][columnIndex]}
              neighboringMines={column.neighboringMines}
              onClick={() => clickCell(rowIndex, columnIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}