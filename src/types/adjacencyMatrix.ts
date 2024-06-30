import type { IGraphEdge, IGraphVertex } from "./graph";
import type { IDataStructure } from "./dataStructure";
import type { Nullable } from "ts-wiz";

export type adjacencyMatrixHeaderCellType = "vertical" | "horizontal"

export interface IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION> {
  id: string;
  data: HEADER;
  vertex: IGraphVertex<VERTEX, EDGE>;
  type: adjacencyMatrixHeaderCellType;
  cells: Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>;
}

export interface IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION> {
  id: string;
  x: number;
  y: number;
  data: RELATION;
  edge: Nullable<IGraphEdge<VERTEX, EDGE>>;
  peer: Nullable<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>
  verticalVertexRef: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>;
  horizontalVertexRef: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>;
}

export interface IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION> extends IDataStructure<IGraphEdge<VERTEX, EDGE>> {
  verticalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>>;
  horizontalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>>;
  relations: Array<Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>>;
}