import { Nullable } from "ts-wiz";
import { IDataStructure } from "./dataStructure";
import { IGraphEdge, IGraphVertex } from "./graph";

export type adjacencyMatrixHeaderCellType = "vertical" | "horizontal";

export interface IAdjacencyMatrixHeaderCell<VERTEX, EDGE> {
  vertex: IGraphVertex<VERTEX, EDGE>;
  cells: Array<IAdjacencyMatrixCell<VERTEX, EDGE>>;
  type: adjacencyMatrixHeaderCellType;
}

export interface IAdjacencyMatrixCell<VERTEX, EDGE> {
  x: number;
  y: number;
  edge: Nullable<IGraphEdge<VERTEX, EDGE>>;
  verticalVertexRef: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>;
  horizontalVertexRef: IAdjacencyMatrixHeaderCell<VERTEX, EDGE>;
}

export interface IAdjacencyMatrix<VERTEX, EDGE>
  extends IDataStructure<IGraphEdge<VERTEX, EDGE>> {
  verticalHeaders: Array<IAdjacencyMatrixHeaderCell<VERTEX, EDGE>>;
  horizontalHeaders: Array<IAdjacencyMatrixHeaderCell<VERTEX, EDGE>>;
  relations: Array<Array<IAdjacencyMatrixCell<VERTEX, EDGE>>>;
}
