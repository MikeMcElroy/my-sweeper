import { BoardState, GameStatus } from '../state'
import p from 'immer'

export function reveal(state:BoardState, row: number, column: number): BoardState {
  return p(state, (draft: BoardState) => {
    if (draft.cells[row][column].neighboringMines === -1) {
      draft.gameStatus = GameStatus.LOSE
      draft.cells.forEach((row, r) => {
        row.forEach((col, c) => {
          if (col.neighboringMines === -1) {
            draft.revealed[r][c] = true
          }
        })
      })
    } else {
      // clicked on an empty space
      let queueOfRevealingCells: number[][] = [
        [row, column]
      ]
      while(queueOfRevealingCells.length) {
        const [rr, rc] = queueOfRevealingCells[0]
        queueOfRevealingCells.shift()
        draft.revealed[rr][rc] = true
        if (draft.cells[rr][rc].neighboringMines === 0) {
          queueOfRevealingCells.push(...[
              [rr-1, rc-1],
              [rr-1, rc],
              [rr-1, rc+1],
              [rr, rc-1],
              // We already marked this as revealed
              // [row, column],
              [rr, rc+1],
              [rr+1, rc-1],
              [rr+1, rc],
              [rr+1, rc+1],
            ].filter(([revealRow, revealColumn]) =>
            revealRow >= 0
            && revealColumn >= 0
            && revealRow < draft.cells.length
            && revealColumn < draft.cells[revealRow].length
            && !draft.revealed[revealRow][revealColumn]
          ))
        }
      }
    }
  })
}
