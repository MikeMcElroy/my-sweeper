export default function findNeighboringCells(
  cells: unknown[][],
  row: number,
  column: number
) {
  return [
    [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    // This is already known
    // [row, column],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ].filter(
    ([revealRow, revealColumn]) =>
      revealRow >= 0 &&
      revealColumn >= 0 &&
      revealRow < cells.length &&
      revealColumn < cells[revealRow].length
  );
}
