import {
  IAdjacencyMatrix,
  IAdjacencyMatrixCell,
  IAdjacencyMatrixHeaderCell,
  adjacencyMatrixHeaderCellType,
} from "../../../types/adjactanctMatrix";
import type { IGraph, IGraphEdge, IGraphVertex } from "../../../types/graph";
import type { Nullable } from "ts-wiz";

class AdjacencyMatrixHeaderCell<VERTEX, EDGE> implements IAdjacencyMatrixHeaderCell<VERTEX, EDGE> {
  vertex: IGraphVertex<VERTEX, EDGE>;
  type: adjacencyMatrixHeaderCellType;
  private matrixRef: IAdjacencyMatrix<VERTEX, EDGE>;
  constructor(
    vertexRef: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>["vertex"],
    matrixRef: IAdjacencyMatrix<VERTEX, EDGE>,
    type: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>["type"]
  ) {
    this.vertex = vertexRef;
    this.matrixRef = matrixRef;
    this.type = type;
  }

  get cells(): Array<IAdjacencyMatrixCell<VERTEX, EDGE>> {
    const relations = this.matrixRef.relations.flat();
    if (this.type === "vertical") return relations.filter((rel) => rel.verticalVertexRef === this);
    else return relations.filter((rel) => rel.verticalVertexRef === this);
  }
}

class AdjacencyMatrixCell<VERTEX, EDGE> implements IAdjacencyMatrixCell<VERTEX, EDGE> {
  private matrixRef: IAdjacencyMatrix<VERTEX, EDGE>;

  x: number;
  y: number;
  edge: Nullable<IGraphEdge<VERTEX, EDGE>>;

  constructor(
    x: IAdjacencyMatrixCell<VERTEX, EDGE>["x"],
    y: IAdjacencyMatrixCell<VERTEX, EDGE>["y"],
    edge: IAdjacencyMatrixCell<VERTEX, EDGE>["edge"],
    matrixRef: IAdjacencyMatrix<VERTEX, EDGE>
  ) {
    this.matrixRef = matrixRef;
    this.x = x;
    this.y = y;
    this.edge = edge;
  }

  get verticalVertexRef() {
    const verticalCellRef = this.matrixRef.verticalHeaders[this.x];
    if (!verticalCellRef)
      throw new Error(
        `Error in method 'verticalVertexRef': Expected to find a vertical header at index ${this.x}, but received a falsy value (${verticalCellRef}). Please ensure that the matrix configuration is correct and that the provided index is within the bounds of the available headers.`
      );
    return verticalCellRef;
  }

  get horizontalVertexRef() {
    const horizontalCellRef = this.matrixRef.verticalHeaders[this.y];
    if (!horizontalCellRef)
      throw new Error(
        `Error in method 'horizontalVertexRef': Expected to find a horizontal header at index ${this.y}, but received a falsy value (${horizontalCellRef}). Please ensure that the matrix configuration is correct and that the provided index is within the bounds of the available headers.`
      );
    return horizontalCellRef;
  }
}
class AdjacencyMatrix<VERTEX, EDGE> implements IAdjacencyMatrix<VERTEX, EDGE> {
  private graph: IGraph<VERTEX, EDGE>;

  verticalHeaders: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>[] = [];
  horizontalHeaders: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>[] = [];
  relations: IAdjacencyMatrixCell<VERTEX, EDGE>[][] = [];

  constructor(graph: IGraph<VERTEX, EDGE>) {
    this.graph = graph;
    this.init();
  }

  private initHeaderCells() {
    for (const vertex of this.graph.iter()) {
      const vertexHeaderCellInstance = new AdjacencyMatrixHeaderCell<VERTEX, EDGE>(vertex, this, "vertical");
      const horizontalHeaderCellInstance = new AdjacencyMatrixHeaderCell<VERTEX, EDGE>(vertex, this, "horizontal");
      this.verticalHeaders.push(vertexHeaderCellInstance);
      this.horizontalHeaders.push(horizontalHeaderCellInstance);
    }
  }

  private initMatrixBody() {
    this.relations = Array.from(Array(this.size).keys()).map(() => new Array(this.size));
    for (let i = 0; i < this.verticalHeaders.length; i++) {
      for (let j = 0; j < this.horizontalHeaders.length; j++) {
        const fromVertex = this.verticalHeaders[i].vertex;
        const toVertex = this.horizontalHeaders[j].vertex;
        const edge = this.graph.getEdgeBetween(fromVertex,toVertex);
        const connection = new AdjacencyMatrixCell(j , i , edge , this);
        this.relations[j][i] = connection;
      }
    }
  }

  private init() {
    this.initHeaderCells();
    this.initMatrixBody();
  }

  get size() {
    return this.graph.size;
  }

  // !TODO implement
  *iter() {
    for (const item of []) {
      yield item;
    }
  }
}

export default AdjacencyMatrix;
