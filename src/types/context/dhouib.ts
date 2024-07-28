import { IGraphEdge, IGraphVertex } from "@_types/graph";
import { IAdjacencyMatrix, IAdjacencyMatrixHeader, IAdjacencyMatrixRelation } from "@_types/adjacencyMatrix";

export type IAdjacencyMatrixCellStatus = "blank" | "candidate" | "selected";

export interface IDhouibGraphVertex {
  x: number;
  y: number;
}

export interface IDhouibGraphEdge {
  distance: number;
  status: "connected" | "candidate" | "stale";
}

export interface IDhouibAdjacencyMatrixHeader {}

export interface IDhouibAdjacencyMatrixRelation {
  status: "selected" | "blank" | "candidate";
}

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
  "create-min-columns-list": Array<DhouibAdjacencyMatrixRelation>;
  "min-columns-list-max-value-select": DhouibAdjacencyMatrixRelation;
  "relation-change-status": DhouibAdjacencyMatrixRelation;
  "relation-edge-change": DhouibAdjacencyMatrixRelation;

  "add-to-min-column-list": DhouibAdjacencyMatrixRelation;
  "remove-from-min-column-list": DhouibAdjacencyMatrixRelation;

  "add-to-mst-path": DhouibAdjacencyMatrixRelation;
  "add-to-candidate-relations": DhouibAdjacencyMatrixRelation;
}

export interface DhouibVertexEventMap {
  "state-change": DhouibGraphVertex;
  "position-change": DhouibGraphVertex;
}

export interface IDhouibGraphEdgeEventMap {
  "state-change": DhouibGraphEdge;
}
