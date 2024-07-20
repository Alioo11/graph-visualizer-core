import NumberUtils from "@utils/Number";
import PathFindingGraph from ".";
import { GraphTopology, gridGraphOptions, IGraphFactory, randomizedGraphOptions } from "../../../../types/graph";
import {
  IPathFindingGraphEdge,
  IPathFindingGraphVertex,
  PathFindingGraphVertex,
} from "../../../../types/pathFindingGraph";

class PathfindingGraphFactory
  implements IGraphFactory<IPathFindingGraphVertex, IPathFindingGraphEdge, PathFindingGraph>
{
  size: number = 10;
  topology: GraphTopology = "mesh";

  public radius = 4000;
  createGrid(options:gridGraphOptions) {
    const { gap, width, height, entry, targets } = options;
    const mat: Array<Array<any>> = Array.from(Array(width).keys()).map(() => new Array(height));
    const graph = new PathFindingGraph("undirected");


    const isValidEntry = entry[0] < width && entry[1] < height;
    const isValidTarget = targets.every(([x,y]) => x < width && y < height);

    if(!isValidEntry) throw new Error("entry point out of grid")

    if(!isValidTarget) throw new Error("one or more target is out of entry grid range")

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const f = graph.addVertex(`${j}-${i}`, {
          x: gap * j,
          y: gap * i,
        });
        mat[i][j] = f;
      }
    }

    for (let row = 0; row < mat.length; row++) {
      for (let col = 0; col < mat[row].length; col++) {
        const currentNode = mat[row][col];
        const bottomNode = mat?.[row + 1]?.[col];
        const nextNode = mat?.[row]?.[col + 1];
        if (nextNode) graph.connect(currentNode, nextNode, { wight: 1, blocked: false });
        if (bottomNode) graph.connect(currentNode, bottomNode, { wight: 1, blocked: false });
      }
    }

    graph.entry = mat[entry[0]][entry[1]];
    targets.forEach(([x,y]) => graph.addTarget(mat[y][x]))
    return graph;
  }

  get portion() {
    return (2 * Math.PI) / this.size;
  }

  randomizedGraph(options:randomizedGraphOptions) {
    const {size} = options;

    const PICK_PORTION = .1;
    const graph = new PathFindingGraph("undirected");
    const vertices: Array<PathFindingGraphVertex> = new Array(size);


    for (let i = 0; i < size; i++) {
      const vertexRef = graph.addVertex(`${i}`, {
        x: NumberUtils.randomNumberBetween(-size * 10 , size * 10),
        y: NumberUtils.randomNumberBetween(-size * 10 , size * 10),
      });
      vertices[i] = vertexRef;
    }

    const getDistance = (v1:PathFindingGraphVertex,v2:PathFindingGraphVertex)=>{
      const DX = v2.data.x - v1.data.x;
      const DY = v2.data.y - v1.data.y;
      return Math.sqrt(DX ** 2 + DY **2)
    }

    for(const v of vertices){
      const nearestVertices = vertices.sort((a , b) => getDistance(a , v) - getDistance(b,v) )
      const bestOnes = nearestVertices.slice(0 , nearestVertices.length * PICK_PORTION);


      bestOnes.forEach(b => {
        graph.connect(b, v, { wight: getDistance(v, b), blocked: false });
      })
      
      
    }

    graph.entry = vertices[0];

    return graph;
  }

  create = () => {
    return this.randomizedGraph({ size: 10 });
  };
}

export default PathfindingGraphFactory;
