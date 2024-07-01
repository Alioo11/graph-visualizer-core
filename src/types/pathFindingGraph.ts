import { Nullable } from "ts-wiz";
import { IGraphEdge, IGraphVertex } from "./graph";

type PathFindingGraphVertexState = "blank" | "visited" | "scanned";

export interface IPathFindingGraphVertex {
  state: PathFindingGraphVertexState;
  from: Nullable<PathFindingGraphVertex>;
  cost: Nullable<number>;
  x: number;
  y: number;
}

export interface IPathFindingGraphEdge {
  wight: number;
}

export interface PathFindingVertexEvents {
  "state-change": PathFindingGraphVertex;
  "position-change": PathFindingGraphVertex;
}


export type PathFindingGraphVertex = IGraphVertex<IPathFindingGraphVertex, IPathFindingGraphEdge>;
export type PathFindingGraphEdge = IGraphEdge<IPathFindingGraphVertex, IPathFindingGraphEdge>;
