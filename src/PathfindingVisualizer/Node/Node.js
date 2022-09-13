import React, { Component } from "react";
import "./Node1.css";

export class Node extends Component {
  render() {
    const {
      col,
      row,
      isStart,
      isEnd,
      isWall,
      isWeighted,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    const extraClassName = isEnd
      ? "node-end"
      : isStart
      ? "node-start"
      : isWeighted
      ? "node-weighted"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

export default Node;
