import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer1.css";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../Algorithms/DijkstrasAlgorithm";
import { BFS } from "../Algorithms/BFS";
import { DFS } from "../Algorithms/DFS";
import { AStar } from "../Algorithms/AStar";

//Start and End positions

let StartRow = 10;
let StartCol = 5;
let EndRow = 15;
let EndCol = 25;

export class PathfindingVisualizer extends Component {
  constructor(props) {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      st: "Wall",
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    document.addEventListener("keypress", (event) => {
      if (event.key === "W" || event.key === "w") {
        if (this.state.st === "Wall") {
          this.setState({ st: "Weighted" });
        } else {
          this.setState({ st: "Wall" });
        }
      }
    });

    let st = this.state.st;
    if (row === StartRow && col === StartCol) {
      st = "Start";
    } else if (row === EndRow && col === EndCol) {
      st = "End";
    }
    console.log(st);
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, st);
    this.setState({ grid: newGrid, mouseIsPressed: true, st: st });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    const newGrid = getNewGridWithWallToggled(
      this.state.grid,
      row,
      col,
      this.state.st
    );
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    if (this.state.st !== "Weighted")
      this.setState({ mouseIsPressed: false, st: "Wall" });
    else this.setState({ mouseIsPressed: false, st: "Weighted" });
  }

  showFinalPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        if (node.isWeighted)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weighted node-final";
        else
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-final";
      }, 50 * i);
    }
    setTimeout(() => {
      document.getElementById("blocked").style.visibility = "hidden";
    }, 50 * nodesInShortestPathOrder.length);
  }

  showVisited(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.showFinalPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      } else {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          if (node.isWeighted)
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-weighted node-visited";
          else
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
        }, 10 * i);
      }
    }
  }

  visualizeDijkstra() {
    document.getElementById("blocked").style.visibility = "visible";

    this.setState({ grid: clearVisited(this.state.grid, true) });
    const { grid } = this.state;
    const start = grid[StartRow][StartCol];

    const end = grid[EndRow][EndCol];
    const visitedNodesInOrder = dijkstra(grid, start, end);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end, start);
    this.showVisited(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    document.getElementById("blocked").style.visibility = "visible";
    this.setState({ grid: clearVisited(this.state.grid, false) });
    const { grid } = this.state;
    const start = grid[StartRow][StartCol];
    console.log("bfs");
    const end = grid[EndRow][EndCol];
    const visitedNodesInOrder = BFS(grid, start, end);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
    this.showVisited(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS() {
    document.getElementById("blocked").style.visibility = "visible";
    this.setState({ grid: clearVisited(this.state.grid, false) });
    const { grid } = this.state;
    const start = grid[StartRow][StartCol];
    console.log("dfs");
    const end = grid[EndRow][EndCol];
    const visitedNodesInOrder = DFS(grid, start, end);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
    this.showVisited(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    document.getElementById("blocked").style.visibility = "visible";
    this.setState({ grid: clearVisited(this.state.grid, true) });
    const { grid } = this.state;
    const start = grid[StartRow][StartCol];
    console.log("A*");
    const end = grid[EndRow][EndCol];
    const visitedNodesInOrder = AStar(grid, start, end);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
    this.showVisited(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetGrid() {
    StartRow = 10;
    StartCol = 5;
    EndRow = 15;
    EndCol = 25;

    const newGrid = getResetGrid(this.state.grid);
    this.setState({ grid: newGrid, st: "Wall" });
  }

  render() {
    const { grid } = this.state;
    const w = window.innerWidth;
    console.log(w);

    return (
      <div className="parent">
        <div className="blocked" id="blocked"></div>

        <div className="header">
          <h1>Pathfinding Visualizer</h1>
        </div>
        <div className="InfoBox">
          <button className="algoName" onClick={() => this.visualizeDijkstra()}>
            Dijkstra
          </button>
          <button className="algoName" onClick={() => this.visualizeAStar()}>
            A*
          </button>
          <button className="algoName" onClick={() => this.visualizeBFS()}>
            BFS
          </button>
          <button className="algoName" onClick={() => this.visualizeDFS()}>
            DFS
          </button>
          <button onClick={() => this.resetGrid()}> Reset </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { col, row, isStart, isEnd, isWall, isWeighted } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isStart={isStart}
                      isEnd={isEnd}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      mouseIsPressed={this.mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 35; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const clearVisited = (grid, wt) => {
  const newGrid = grid.slice();
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 35; col++) {
      const node = newGrid[row][col];
      if (!node.isStart && !node.isEnd && !node.isWall && !node.isWeighted) {
        document.getElementById(`node-${row}-${col}`).className = "node";
      }
      if (!node.isStart && !node.isEnd && node.isWeighted) {
        document.getElementById(`node-${row}-${col}`).className =
          "node node-weighted";
      }
      const newNode = {
        ...node,
        isWeighted: node.isWeighted && wt,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
        heuristics: Infinity,
      };
      newGrid[row][col] = newNode;
    }
  }
  return newGrid;
};

const getResetGrid = (grid) => {
  const newGrid = grid.slice();
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 35; col++) {
      const node = newGrid[row][col];
      document.getElementById(`node-${row}-${col}`).className = "node";
      const newNode = {
        ...node,
        isStart: row === StartRow && col === StartCol,
        isEnd: row === EndRow && col === EndCol,
        isWall: false,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
        isWeighted: false,
        heuristics: Infinity,
      };
      if (newNode.isStart)
        document.getElementById(`node-${row}-${col}`).className =
          "node node-start";
      else if (newNode.isEnd)
        document.getElementById(`node-${row}-${col}`).className =
          "node node-end";
      newGrid[row][col] = newNode;
    }
  }
  return newGrid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === StartRow && col === StartCol,
    isEnd: row === EndRow && col === EndCol,
    isWall: false,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    isWeighted: false,
    heuristics: Infinity,
  };
};

const getNewGridWithWallToggled = (grid, row, col, st) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];

  if (st === "Start") {
    const start = newGrid[StartRow][StartCol];
    const oldStart = {
      ...start,
      isStart: false,
      previousNode: null,
      distance: Infinity,
      heuristics: Infinity,
    };
    newGrid[StartRow][StartCol] = oldStart;
    const newStart = {
      ...node,
      isStart: true,
      previousNode: null,
      distance: Infinity,
      heuristics: Infinity,
    };
    StartRow = row;
    StartCol = col;
    newGrid[row][col] = newStart;
  } else if (st === "End") {
    const end = newGrid[EndRow][EndCol];
    const oldEnd = {
      ...end,
      isEnd: false,
    };
    newGrid[EndRow][EndCol] = oldEnd;
    const newEnd = {
      ...node,
      isEnd: true,
    };
    EndRow = row;
    EndCol = col;
    newGrid[row][col] = newEnd;
  } else if (st === "Weighted") {
    const newNode = {
      ...node,
      isWall: false,
      isWeighted: !node.isWeighted,
    };
    newGrid[row][col] = newNode;
  } else {
    const newNode = {
      ...node,
      isWeighted: false,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
  }

  return newGrid;
};

export default PathfindingVisualizer;
