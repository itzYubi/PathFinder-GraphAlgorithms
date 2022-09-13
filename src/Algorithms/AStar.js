export function AStar(grid, start, end) {
  if (start === end) {
    return false;
  }

  const visitedNodesInOrder = [];

  start.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  setHeuristics(start, end);

  while (!!unvisitedNodes.length) {
    sortNodeByHeuristics(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    if (closestNode.isWall) continue;
    if (closestNode !== start && closestNode !== end)
      visitedNodesInOrder.push(closestNode);

    if (closestNode === end) return visitedNodesInOrder;
    updateNeighbours(closestNode, grid, end);
  }
}

/*function setHeuristics(currentNode,endNode)
{
    currentNode.heuristics=Math.abs(currentNode.row - endNode.row) + Math.abs(currentNode.col - endNode.col);
}

function abs(x){
    if(x<0)
        return (x*(-1));
    else
        return x;
}*/

function setHeuristics(currentNode, endNode) {
  currentNode.heuristics =
    Math.abs(currentNode.row - endNode.row) +
    Math.abs(currentNode.col - endNode.col);
}

function abs(x) {
  if (x < 0) return x * -1;
  else return x;
}

function sortNodeByHeuristics(unvisitedNodes) {
  unvisitedNodes.sort(
    (nodeA, nodeB) =>
      nodeA.distance + nodeA.heuristics - (nodeB.distance + nodeB.heuristics)
  );
}

/*function updateNeighbours(node,grid,end){
    const neighbours=getNeighbours(node,grid);
    for(const neighbour of neighbours)
    {
        const tmp=neighbour.distance;
        if(neighbour.isWeighted)
            neighbour.distance=node.distance+50;
        else
            neighbour.distance=node.distance+1;
        setHeuristics(neighbour,end);
        if(tmp>neighbour.distance)
            neighbour.previousNode=node;
        else
            neighbour.distance=tmp;
    }

}

function sortNodeByHeuristics(unvisitedNodes)
{
    unvisitedNodes.sort((nodeA,nodeB) => ((nodeA.distance - nodeB.distance) ));//| (nodeA.distance+nodeA.heuristics)-(nodeB.distance+nodeB.heuristics)));
}*/

function updateNeighbours(node, grid, endNode) {
  const neighbours = getNeighbours(node, grid);
  for (const neighbour of neighbours) {
    setHeuristics(neighbour, endNode);
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
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
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
