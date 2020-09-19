import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Cell } from "./Cell";

describe("Cell", () => {
  it("should render nothing for unrevealed cells", () => {
    const { container } = render(
      <Cell
        neighboringMines={0}
        revealed={false}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={jest.fn()}
      />
    );

    expect(container.textContent).toEqual(" ");
  });
});
