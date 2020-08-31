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

export function Cell({ revealed, neighboringMines }: CellState) {
  return (
    <div style={{
      ...!revealed ? UNREVEALED_STYLE : REVEALED_STYLE
    }}>
      {!revealed ? '&nbsp;' : neighboringMines}
    </div>
  )
}
