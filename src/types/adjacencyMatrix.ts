import { Nullable } from "ts-wiz";
import { IGraphEdge, IGraphVertex } from "./graph";
import { IDataStructure } from "./dataStructure";

export type adjacencyMatrixHeaderCellType = "vertical" | "horizontal"

export interface IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION> {
  id: string;
  vertex: IGraphVertex<VERTEX, EDGE>;
  data: HEADER;
  cells: Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>;
  type: adjacencyMatrixHeaderCellType;
}

export interface IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION> {
  id: string;
  x: number;
  y: number;
  edge: Nullable<IGraphEdge<VERTEX, EDGE>>;
  data: RELATION;
  verticalVertexRef: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>;
  horizontalVertexRef: IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>;
}

export interface IAdjacencyMatrix<VERTEX, EDGE, HEADER, RELATION> extends IDataStructure<IGraphEdge<VERTEX, EDGE>> {
  verticalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>>;
  horizontalHeaders: Array<IAdjacencyMatrixHeader<VERTEX, EDGE, HEADER, RELATION>>;
  relations: Array<Array<IAdjacencyMatrixRelation<VERTEX, EDGE, HEADER, RELATION>>>;
}