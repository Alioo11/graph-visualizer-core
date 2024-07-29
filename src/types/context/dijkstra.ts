import { Nullable } from "ts-wiz";
import { IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";

export type DijkstraGraphVertex = IGraphVertex<IDijkstraGraphVertex, IDijkstraGraphEdge>;
export type DijkstraGraphEdge = IGraphEdge<IDijkstraGraphVertex, IDijkstraGraphEdge>;

type DijkstraGraphVertexState = "blank" | "visited";

export interface IDijkstraGraphVertex {
  state: DijkstraGraphVertexState;
  from: Nullable<DijkstraGraphVertex>;
  cost: Nullable<number>;
  x: number;
  y: number;
}

export interface IDijkstraGraphEdge {
  wight: number;
}

export interface DijkstraVertexEvents {
  "state-change": DijkstraGraphVertex;
  "position-change": DijkstraGraphVertex;
}
