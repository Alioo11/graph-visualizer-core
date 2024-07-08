import { IGraphEdge, IGraphVertex } from "./graph";

export interface IPathFindingGraphVertex {
  x: number;
  y: number;
}

export interface IPathFindingGraphEdge {
  wight: number;
}


export type PathFindingGraphVertex = IGraphVertex<IPathFindingGraphVertex, IPathFindingGraphEdge>;
export type PathFindingGraphEdge = IGraphEdge<IPathFindingGraphVertex, IPathFindingGraphEdge>;



export interface PathFindingVertexEvents {
  "state-change": PathFindingGraphVertex;
  "position-change": PathFindingGraphVertex;
  "visit": PathFindingGraphVertex;
  "trace-to-source": Array<PathFindingGraphVertex>;
}

export type IPathFindingSourceMap = Map<PathFindingGraphVertex["id"], PathFindingGraphVertex["id"]>;

export type IPathFindingTargetSourceMap = Map<PathFindingGraphVertex["id"], IPathFindingSourceMap>;


export interface IDijkstraVisualizationOptions {
  width?: number;
  height?: number;
  entry?: [number, number];
  targetPoints?: Array<[number, number]>;
}
