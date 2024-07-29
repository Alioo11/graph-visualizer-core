import { v4 as uuidv4 } from "uuid";
import type { IGraph, IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";
import type { Nullable } from "ts-wiz";
import type {
  IAdjacencyMatrix,
  IAdjacencyMatrixHeader,
  IAdjacencyMatrixRelation,
  adjacencyMatrixHeaderCellType,
} from "@_types/dataStructure/adjacencyMatrix";
import type { IAdjacencyMatrixCellStatus } from "@_types/context/dhouib";

class AdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>
  implements IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>
{
  vertex: IGraphVertex<VERTEX, EDGE>;
  type: adjacencyMatrixHeaderCellType;
  id: string;
  data: HEADER;
  private matrixRef: IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION>;
  constructor(
    vertexRef: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>["vertex"],
    matrixRef: IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION>,
    type: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>["type"],
    data: HEADER
  ) {
    this.vertex = vertexRef;
    this.matrixRef = matrixRef;
    this.type = type;
    this.data = data;
    this.id = uuidv4();
  }

  get cells(): Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>> {
    const relations = this.matrixRef.relations.flat();
    if (this.type === "vertical") return relations.filter((rel) => rel.verticalVertexRef === this);
    return relations.filter((rel) => rel.horizontalVertexRef === this);
  }
}

class AdjacencyMatrixCell<VERTEX, EDGE, HEADER, RELATION>
  implements IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>
{
  private matrixRef: IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION>;

  x: number;
  y: number;
  edge: Nullable<IGraphEdge<VERTEX, EDGE>>;
  id: string;
  status: IAdjacencyMatrixCellStatus = "blank";
  data: RELATION;
  peer: Nullable<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>> = null;

  constructor(
    x: IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>["x"],
    y: IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>["y"],
    edge: IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>["edge"],
    matrixRef: IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION>,
    data: RELATION
  ) {
    this.x = x;
    this.y = y;
    this.matrixRef = matrixRef;
    this.edge = edge;
    this.data = data;
    this.id = uuidv4();
  }

  get verticalVertexRef() {
    const verticalCellRef = this.matrixRef.verticalHeaders[this.y];
    if (!verticalCellRef)
      throw new Error(
        `Error in method 'verticalVertexRef': Expected to find a vertical header at index ${this.x}, but received a falsy value (${verticalCellRef}). Please ensure that the matrix configuration is correct and that the provided index is within the bounds of the available headers.`
      );
    return verticalCellRef;
  }

  get horizontalVertexRef() {
    const horizontalCellRef = this.matrixRef.horizontalHeaders[this.x];
    if (!horizontalCellRef)
      throw new Error(
        `Error in method 'horizontalVertexRef': Expected to find a horizontal header at index ${this.y}, but received a falsy value (${horizontalCellRef}). Please ensure that the matrix configuration is correct and that the provided index is within the bounds of the available headers.`
      );
    return horizontalCellRef;
  }
}

class AdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION> implements IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION> {
  graph: IGraph<VERTEX, EDGE>;

  verticalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>> = [];
  horizontalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>> = [];
  relations: Array<Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>> = [];

  relationIdMap = new Map<string, IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>();

  protected _edgeValueGetter: (edge: EDGE) => number;

  constructor(
    graph: IGraph<VERTEX, EDGE>,
    defaultHeader: HEADER,
    defaultRelation: RELATION,
    edgeValueGetter: (edge: EDGE) => number
  ) {
    this.graph = graph;
    this._edgeValueGetter = edgeValueGetter;
    this.initHeaderCells(defaultHeader);
    this.initMatrixBody(defaultRelation);
    this.initPeers();
  }

  private initHeaderCells(defaultHeader: HEADER) {
    for (const vertex of this.graph.iter()) {
      const vertexHeaderCellInstance = new AdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>(
        vertex,
        this,
        "vertical",
        defaultHeader
      );
      const horizontalHeaderCellInstance = new AdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>(
        vertex,
        this,
        "horizontal",
        defaultHeader
      );
      this.verticalHeaders.push(vertexHeaderCellInstance);
      this.horizontalHeaders.push(horizontalHeaderCellInstance);
    }
  }

  private initPeers() {
    const flatRelations = this.relations.flat();
    for (let i = 0; i < flatRelations.length; i++) {
      const currentRelation = flatRelations[i];
      const peerValue = this.relations[currentRelation.x][currentRelation.y];
      if (!peerValue)
        throw new Error(
          `something wen't wrong while getting peer relation at ${{ x: currentRelation.x, y: currentRelation.y }}`
        );
      currentRelation.peer = peerValue;
      peerValue.peer = currentRelation;
    }
  }

  private initMatrixBody(defaultRelation: RELATION) {
    this.relations = Array.from(Array(this.size).keys()).map(() => new Array(this.size));

    for (let x = 0; x < this.horizontalHeaders.length; x++) {
      for (let y = 0; y < this.verticalHeaders.length; y++) {
        const fromVertex = this.verticalHeaders[y].vertex;
        const toVertex = this.horizontalHeaders[x].vertex;
        const edge = this.graph.getEdgeBetween(fromVertex, toVertex);
        const connection = new AdjacencyMatrixCell(x, y, edge, this, defaultRelation);
        this.relationIdMap.set(connection.id, connection);
        this.relations[y][x] = connection;
      }
    }
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
