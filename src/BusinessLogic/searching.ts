import { BoardState, GameStatus } from "../state";
import findNeighboringCells from "./findNeighboringCells";
import p from "immer";

export function reveal(
  state: BoardState,
  row: number,
  column: number
): BoardState {
  return p(state, (draft: BoardState) => {
    if (draft.cells[row][column].neighboringMines === -1) {
      draft.gameStatus = GameStatus.LOSE;
      draft.cells.forEach((row, r) => {
        row.forEach((col, c) => {
          if (col.neighboringMines === -1) {
            draft.revealed[r][c] = true;
          }
        });
      });
    } else {
      // clicked on an empty space
      let queueOfRevealingCells: number[][] = [[row, column]];
      while (queueOfRevealingCells.length) {
        const [rr, rc] = queueOfRevealingCells[0];
        queueOfRevealingCells.shift();
        draft.revealed[rr][rc] = true;
        if (draft.cells[rr][rc].neighboringMines === 0) {
          queueOfRevealingCells.push(
            ...findNeighboringCells(draft.cells, rr, rc).filter(
              ([cellRow, cellColumn]) => !draft.revealed[cellRow][cellColumn]
            )
          );
        }
      }
    }
  });
}
