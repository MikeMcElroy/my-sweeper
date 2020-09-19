export type Cell = {
  neighboringMines: number;
};

export type CellState = Cell & {
  revealed: boolean;
  flagged: boolean;
  onReveal: () => void;
  onFlag: () => void;
};

export enum GameStatus {
  WIN,
  LOSE,
  PLAYING,
}

export type Board = Cell[][];
export type BoardState = {
  cells: Cell[][];
  revealed: boolean[][];
  gameStatus: GameStatus;
  flagged: boolean[][];
};
