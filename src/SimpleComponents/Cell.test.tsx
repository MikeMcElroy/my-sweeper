import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
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
  
  it("should render nothing for revealed cells with no adjacent mines", () => {
    const { container } = render(
      <Cell
        neighboringMines={0}
        revealed={true}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={jest.fn()}
      />
    );

    expect(container.textContent).toEqual(" ");
  });

  it("should render number of mines for revealed cells with adjacent mines", () => {
    const { container } = render(
      <Cell
        neighboringMines={4}
        revealed={true}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={jest.fn()}
      />
    );

    expect(container.textContent).toEqual("4");
  });

  it("should render a flag for unrevealed cells with flag on them", () => {
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={true}
        onFlag={jest.fn()}
        onReveal={jest.fn()}
      />
    );

    expect(container.textContent).toEqual("🚩");
  });

  it("should render a mine for revealed cells with a mine in them", () => {
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={true}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={jest.fn()}
      />
    );

    expect(container.textContent).toEqual("✸");
  });

  it("should call the onFlag method when a context menu event happens", () => {
    const onFlag = jest.fn()
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={false}
        onFlag={onFlag}
        onReveal={jest.fn()}
      />
    );

    fireEvent.contextMenu(container.firstChild)
    expect(onFlag).toHaveBeenCalled()
  });

  it("should call the onFlag method when a meta+click event happens", () => {
    const onFlag = jest.fn()
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={false}
        onFlag={onFlag}
        onReveal={jest.fn()}
      />
    );

    userEvent.click(container.firstChild, { metaKey: true })
    expect(onFlag).toHaveBeenCalled()
  });

  it("should call the onReveal method when a click event happens", () => {
    const onReveal = jest.fn()
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={onReveal}
      />
    );

    userEvent.click(container.firstChild)
    expect(onReveal).toHaveBeenCalled()
  });

  it("should NOT call the onReveal method when flagged", () => {
    const onReveal = jest.fn()
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={true}
        onFlag={jest.fn()}
        onReveal={onReveal}
      />
    );

    userEvent.click(container.firstChild)
    expect(onReveal).not.toHaveBeenCalled()
  });

  it("should apply some special styles when clicking on a mine", () => {
    const onReveal = jest.fn()
    const { container } = render(
      <Cell
        neighboringMines={-1}
        revealed={false}
        flagged={false}
        onFlag={jest.fn()}
        onReveal={onReveal}
      />
    );

    expect(container.firstChild).toHaveStyle(``)
    act(() => userEvent.click(container.firstChild))

    expect(onReveal).toHaveBeenCalled()
    expect(container.firstChild).toHaveStyle(`background-color: red`)
  });
});
