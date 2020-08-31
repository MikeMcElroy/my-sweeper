export type Cell = {
  neighboringMines: number
}

export enum GameStatus {
  WIN,
  LOSE,
  PLAYING,
}

export type Board = Cell[][]
export type BoardState = {
  cells: Cell[][],
  revealed: boolean[][],
  gameStatus: GameStatus,
}
