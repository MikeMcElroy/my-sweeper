import React from 'react'
import { CellState } from '../state'

const REVEALED_STYLE = {
  backgroundColor: 'darkgray'
}

const UNREVEALED_STYLE = {
  backgroundColor: 'gray',
  borderStyle: 'ridge',
  borderWidth: '2px',
  borderColor: 'darkgray',
}

export function Cell({ revealed, neighboringMines, onClick }: CellState) {
  return (
    <div onClick={onClick} style={{
      ...!revealed ? UNREVEALED_STYLE : REVEALED_STYLE,
      flex: 1,
      flexBasis: '50px'
    }}>
      {!revealed ? ' ' : neighboringMines}
    </div>
  )
}
