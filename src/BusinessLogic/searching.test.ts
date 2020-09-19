import { reveal } from "./searching";
import { BoardState, GameStatus } from "../state";

const M = -1;
const F = false;
const T = true;
const X = "FLAGGED";

function reportBoardState(board: BoardState) {
  console.log(
    JSON.stringify(board.revealed, null, 2)
      .replace(/false/g, "F")
      .replace(/true/g, "T")
      .replace(/\s\s\s\s+\[\n/g, "      [")
      .replace(/\n\s\s\s\s+\]/g, "]")
      .replace(/\s+([F|T],?)\s?\s?\n/g, " $1")
  );
}

function buildTestState(board: number[][]): BoardState {
  return {
    flagged: board.map((row) => row.map((_) => false)),
    revealed: board.map((row) => row.map((_) => false)),
    cells: board.map((row) =>
      row.map((column) => ({
        neighboringMines: column,
      }))
    ),
    gameStatus: GameStatus.PLAYING,
  };
}

describe("reveal function", () => {
  describe("with simple inputs", () => {
    const originalState = buildTestState([
      [M, 1, 0, 1, M],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
      [M, 1, 0, 1, M],
    ]);
    it("will only reveal single cells with nearby mines", () => {
      const newState = reveal(originalState, 1, 1);
      expect(newState.revealed).toEqual([
        [F, F, F, F, F],
        [F, T, F, F, F],
        [F, F, F, F, F],
        [F, F, F, F, F],
        [F, F, F, F, F],
      ]);
    });
    it("will reveal all mines on a mine cell", () => {
      const newState = reveal(originalState, 0, 0);
      expect(newState.revealed).toEqual([
        [T, F, F, F, T],
        [F, F, F, F, F],
        [F, F, F, F, F],
        [F, F, F, F, F],
        [T, F, F, F, T],
      ]);
    });
    it("will lose the game on revealing a mine cell", () => {
      const newState = reveal(originalState, 0, 0);
      expect(newState.gameStatus).toEqual(GameStatus.LOSE);
    });
    it("will reveal all neighbors of a 0-neighboring-mine cell", () => {
      const newState = reveal(originalState, 2, 2);

      expect(newState.revealed).toEqual([
        [F, T, T, T, F],
        [T, T, T, T, T],
        [T, T, T, T, T],
        [T, T, T, T, T],
        [F, T, T, T, F],
      ]);
    });
  });

  describe("with more strange inputs", () => {
    const originalState = buildTestState([
      //      0  1  2  3  4  5  6  7  8
      //     ============================
      /* 0 */ [M, 1, 0, 1, M, 1, 1, M, M],
      /* 1 */ [1, 1, 0, 1, 2, 2, 3, 4, 4],
      /* 2 */ [0, 0, 0, 0, 1, M, 2, M, M],
      /* 3 */ [1, 1, 0, 1, 2, 2, 2, 3, M],
      /* 4 */ [M, 1, 0, 2, M, 2, 0, 1, 1],
      /* 5 */ [1, 1, 0, 2, M, 2, 0, 0, 0],
    ]);

    it("should reveal all mines when revealing a mine square", () => {
      const newState = reveal(originalState, 0, 0);

      expect(newState.revealed).toEqual([
        [T, F, F, F, T, F, F, T, T],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, T, F, T, T],
        [F, F, F, F, F, F, F, F, T],
        [T, F, F, F, T, F, F, F, F],
        [F, F, F, F, T, F, F, F, F],
      ]);
    });

    it("should reveal only a single square when revealing a cell neighboring a mine", () => {
      const newState = reveal(originalState, 1, 4);

      expect(newState.revealed).toEqual([
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, T, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
      ]);
    });

    it("should reveal all adjacent squares to a zero-neighboring mine cell", () => {
      const newState = reveal(originalState, 5, 6);

      expect(newState.revealed).toEqual([
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, T, T, T, F],
        [F, F, F, F, F, T, T, T, T],
        [F, F, F, F, F, T, T, T, T],
      ]);
    });
    it("should retain state when mines explode", () => {
      const intermediateState = reveal(originalState, 5, 6);
      const newState = reveal(intermediateState, 0, 0);
      expect(newState.revealed).toEqual([
        [T, F, F, F, T, F, F, T, T],
        [F, F, F, F, F, F, F, F, F],
        [F, F, F, F, F, T, F, T, T],
        [F, F, F, F, F, T, T, T, T],
        [T, F, F, F, T, T, T, T, T],
        [F, F, F, F, T, T, T, T, T],
      ]);
    });
  });
});
