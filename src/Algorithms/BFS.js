export function BFS(grid,start,end) {

    if(start === end)
       { return false;
       }
    
    const visitedNodesInOrder=[];

    start.distance=0;
    const visitedQueue=[];
    visitedQueue.push(start); 
    

    while(!!visitedQueue.length){
        const closestNode=visitedQueue.shift();

        closestNode.isVisited = true;
        if(closestNode.isWall)
            continue;
        if(closestNode !== start && closestNode !== end)
            visitedNodesInOrder.push(closestNode);

        if(closestNode === end)
            return visitedNodesInOrder;
        
        const neighbours=updateNeighbours(closestNode,grid);
        for(const neighbour of neighbours)
        {
            visitedQueue.push(neighbour);
        }
    }
    return visitedNodesInOrder;
}

function updateNeighbours(node,grid){
    const neighbours=getNeighbours(node,grid);
    for(const neighbour of neighbours)
    {
        neighbour.distance=node.distance+1;
        neighbour.previousNode=node;
        neighbour.isVisited=true;
    }
    return neighbours;

}

function getNeighbours(node,grid){
    const neighbours = [];
    const {col, row} = node;
    
    if (row > 0) neighbours.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    return neighbours.filter(neighbour => !neighbour.isVisited);
}



