import React, { useState, useEffect } from "react";
import { BoardState, GameStatus, Cell } from "../state";
import findNeighboringCells from "../BusinessLogic/findNeighboringCells";
import { reveal } from "../BusinessLogic/searching";
import { Cell as GameCell } from "../SimpleComponents/Cell";

const noop = () => {};

export function Board({
  rows,
  columns,
  mines,
  onWin,
  onLose,
}: {
  rows: number;
  columns: number;
  mines: number;
  onWin: () => void;
  onLose: () => void;
}): React.ReactElement {
  const [revealed, setRevealed] = useState<boolean[][] | null>(null);
  const [internalBoardState, setInternalBoardState] = useState<Cell[][] | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [flagged, setFlagged] = useState<boolean[][] | null>(null);

  useEffect(() => {
    let mine_array: [number, number][] = [];
    let cells: number[] = Array.from(new Array(rows * columns), () =>
      Math.random()
    );
    for (let i = 1; i <= mines; i++) {
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
    setFlagged(board.flagged);
  }, [rows, columns, mines]);

  useEffect(() => {
    if (!revealed || !internalBoardState || !flagged) {
      return;
    }
    const revealedCells = revealed.flat();
    const flaggedCells = flagged.flat();
    const boardCells = internalBoardState.flat();
    if (
      // every non-mine cell is revealed
      boardCells
        .every(({ neighboringMines }, index) =>
          neighboringMines === -1 ? true : revealedCells[index]
        )
        ||
      // every mine cell is flagged
      boardCells
        .every(({ neighboringMines }, index) =>
          neighboringMines === -1 ? flaggedCells[index] : !flaggedCells[index]
        )
    ) {
      setGameStatus(GameStatus.WIN);
    }
  }, [revealed, flagged, internalBoardState, setGameStatus]);

  useEffect(() => {
    if (gameStatus === GameStatus.LOSE) {
      onLose();
    } else if (gameStatus === GameStatus.WIN) {
      onWin();
    }
  }, [gameStatus, onLose, onWin]);

  if (!revealed || !internalBoardState || !flagged) {
    return <div>Waiting for the game to start...</div>;
  }

  const clickCell =
    gameStatus === GameStatus.PLAYING
      ? function (row: number, column: number) {
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
          setFlagged(newState.flagged);
        }
      : noop;

  const toggleFlagCell =
    gameStatus === GameStatus.PLAYING
      ? function (row: number, column: number): void {
          const newFlags = flagged.map((r, ri) =>
            ri !== row ? r : r.map((c, ci) => (ci === column ? !c : c))
          );
          setFlagged(newFlags);
        }
      : noop;

  return (
    <div>
      {internalBoardState.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            width: `${columns * 50}px`,
            height: "50px",
          }}
        >
          {row.map((column, columnIndex) => (
            <GameCell
              key={`${rowIndex}-${columnIndex}`}
              revealed={revealed[rowIndex][columnIndex]}
              neighboringMines={column.neighboringMines}
              onReveal={() => clickCell(rowIndex, columnIndex)}
              onFlag={() => toggleFlagCell(rowIndex, columnIndex)}
              flagged={flagged[rowIndex][columnIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
