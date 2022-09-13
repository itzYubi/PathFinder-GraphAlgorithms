export function dijkstra(grid, start, end) {
  if (start === end) {
    return false;
  }

  const visitedNodesInOrder = [];

  start.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodeByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    if (closestNode.isWall) continue;
    if (closestNode !== start && closestNode !== end)
      visitedNodesInOrder.push(closestNode);

    if (closestNode === end) return visitedNodesInOrder;
    updateNeighbours(closestNode, grid);
  }
}

function sortNodeByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbours(node, grid) {
  const neighbours = getNeighbours(node, grid);
  for (const neighbour of neighbours) {
    const wt = neighbour.isWeighted ? 10 : 1;
    if (neighbour.distance > node.distance + wt) {
      neighbour.distance = node.distance + wt;
      neighbour.previousNode = node;
    }
  }
}

function getNeighbours(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
