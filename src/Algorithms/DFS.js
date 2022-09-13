export function DFS(grid, start, end)
{
    if(start === end)
    {
        return false;
    }

    start.distance=0;
    const visitedNodesInOrder=[];
    
    const visitedStack=[];
    visitedStack.push(start);

    while(!!visitedStack.length)
    {
        const presentNode=visitedStack.pop();
        presentNode.isVisited=true;

        if(presentNode.isWall)
            continue;
        
        if(presentNode !== start && presentNode !== end)
            visitedNodesInOrder.push(presentNode);

        if(presentNode === end)
            return visitedNodesInOrder;
        
        const neighbours=updateNeighbours(presentNode,grid);
        for(const neighbour of neighbours)
        {
            visitedStack.push(neighbour);
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
