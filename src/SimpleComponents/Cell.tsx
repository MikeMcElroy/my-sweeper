import React, { useState } from "react";
import { CellState } from "../state";

const REVEALED_STYLE = {
  backgroundColor: "darkgray",
  borderStyle: "ridge",
};

const UNREVEALED_STYLE = {
  backgroundColor: "gray",
  borderColor: "darkgray",
};

const UNFLAGGED_STYLE = {
  fontWeight: "bolder",
};
const FLAGGED_STYLE = {};

const neighboringMineStyles: { [k: number]: { color: string } } = {
  1: { color: "green" },
  2: { color: "yellow" },
  3: { color: "green" },
  4: { color: "red" },
  5: { color: "purple" },
  6: { color: "black" },
  7: { color: "pink" },
  8: { color: "#BADA55" },
  [-1]: { color: "red" },
};

function cellContent(
  neighboringMines: number,
  flagged: boolean,
  revealed: boolean
): string {
  if (flagged) {
    return `🚩`;
  } else if (!revealed) {
    return " ";
  } else if (neighboringMines === -1) {
    return "✸";
  } else if (neighboringMines === 0) {
    return " ";
  }
  return neighboringMines.toString();
}

export function Cell({
  revealed,
  flagged,
  neighboringMines,
  onReveal,
  onFlag,
}: CellState) {
  const [clickedOnMine, setClickedOnMine] = useState(false);
  function handleContextMenu(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    ev.preventDefault();
    if (!revealed) {
      onFlag();
    }
  }
  function handleClick(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    ev.preventDefault();
    if (ev.metaKey) {
      onFlag();
    } else if (!flagged) {
      if (neighboringMines === -1) {
        setClickedOnMine(true);
      }
      onReveal();
    }
  }
  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      style={{
        flex: 1,
        borderWidth: "2px",
        borderStyle: "outset",
        flexBasis: "50px",
        ...(!revealed ? UNREVEALED_STYLE : REVEALED_STYLE),
        ...neighboringMineStyles[neighboringMines],
        ...(clickedOnMine ? { backgroundColor: "red", color: "white" } : {}),
      }}
    >
      <span
        style={{
          verticalAlign: "top",
          fontSize: "smaller",
          ...(!flagged ? UNFLAGGED_STYLE : FLAGGED_STYLE),
        }}
      >
        {cellContent(neighboringMines, flagged, revealed)}
      </span>
    </div>
  );
}
