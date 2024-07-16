import NumberUtils from "@utils/Number";
import PathFindingGraph from ".";
import { GraphTopology, IGraphFactory } from "../../../../types/graph";
import {
  IPathFindingGraphEdge,
  IPathFindingGraphVertex,
  PathFindingGraphVertex,
} from "../../../../types/pathFindingGraph";

class PathfindingGraphFactory
  implements IGraphFactory<IPathFindingGraphVertex, IPathFindingGraphEdge, PathFindingGraph>
{
  size: number;
  topology: GraphTopology = "mesh";
  public gap = 60;
  public radius = 1000;
  private _createGridTopologyGraph() {
    const mat: Array<Array<any>> = Array.from(Array(this.size).keys()).map((i) => new Array(this.size));
    const graph = new PathFindingGraph("undirected");

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const f = graph.addVertex(`${j}-${i}`, {
          x: this.gap * j,
          y: this.gap * i,
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

    graph.entry = mat[0][0];
    return graph;
  }

  get portion() {
    return (2 * Math.PI) / this.size;
  }

  private _createMeshTopologyGraph() {
    const graph = new PathFindingGraph("undirected");
    const vertices: Array<PathFindingGraphVertex> = new Array(this.size);

    for (let i = 0; i < this.size; i++) {
      const vertexRef = graph.addVertex(`${i}`, {
        x: Math.sin(i * this.portion) * this.radius + (Math.random() * 5000),
        y: Math.cos(i * this.portion) * this.radius + (Math.random() * 5000),
      });
      vertices[i] = vertexRef;
    }

    for (let i = 0; i < vertices.length; i++) {
      for (let j = i; j < vertices.length; j++) {
        const fromV = vertices[i];
        const toV = vertices[j];
        if(NumberUtils.maybe(.5)) continue  
        graph.connect(fromV, toV, { wight: 1, blocked: false });
      }
    }

    graph.entry = vertices[0];

    return graph;
  }

  create = () => {
    switch (this.topology) {
      case "grid":
        return this._createGridTopologyGraph();
      case "mesh":
        return this._createMeshTopologyGraph();
      default:
        return this._createGridTopologyGraph();
    }
  };

  constructor(size: number) {
    this.size = size;
  }
}

export default PathfindingGraphFactory;
