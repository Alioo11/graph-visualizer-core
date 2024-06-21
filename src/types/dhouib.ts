import { Nullable } from "ts-wiz";
import { IGraphEdge, IGraphVertex } from "./graph";
import { IAdjacencyMatrix, IAdjacencyMatrixHeader, IAdjacencyMatrixRelation } from "./adjacencyMatrix";

export type IAdjacencyMatrixCellStatus = "blank" | "candidate" | "selected";

export interface IDhouibGraphVertex {
  x: number;
  y: number;
}

export interface IDhouibGraphEdge {
  distance: number;
  status: "connected" | "blank";
}

export interface IDhouibAdjacencyMatrixHeader {}

export interface IDhouibAdjacencyMatrixRelation {}


export type DhouibAdjacencyMatrixRelation = IAdjacencyMatrixRelation<
  IDhouibGraphVertex,
  IDhouibGraphEdge,
  IDhouibAdjacencyMatrixHeader,
  IDhouibAdjacencyMatrixRelation
>;


export type DhouibAdjacencyMatrixHeader = IAdjacencyMatrixHeader<
  IDhouibGraphVertex,
  IDhouibGraphEdge,
  IDhouibAdjacencyMatrixHeader,
  IDhouibAdjacencyMatrixRelation
>;


export type DhouibAdjacencyMatrix = IAdjacencyMatrix<
  IDhouibGraphVertex,
  IDhouibGraphEdge,
  IDhouibAdjacencyMatrixHeader,
  IDhouibAdjacencyMatrixRelation
>;

export type DhouibGraphVertex = IGraphVertex<IDhouibGraphVertex, IDhouibGraphEdge>;
export type DhouibGraphEdge = IGraphEdge<IDhouibGraphVertex, IDhouibGraphEdge>;



export interface IDhouibAdjacencyMatrixEventMap {
  "columns-minimum-cell-select": Array<Nullable<DhouibAdjacencyMatrixRelation>>;
  // "cell-change-status": IAdjacencyMatrixCell<VERTEX, EDGE>;
}