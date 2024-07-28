import { IGraphEdge, IGraphVertex } from "@_types/graph";

export interface IPathFindingGraphVertex {
  x: number;
  y: number;
}

export interface IPathFindingGraphEdge {
  wight: number;
  blocked: boolean;
}

export type PathFindingGraphVertex = IGraphVertex<IPathFindingGraphVertex, IPathFindingGraphEdge>;
export type PathFindingGraphEdge = IGraphEdge<IPathFindingGraphVertex, IPathFindingGraphEdge>;

export interface PathFindingVertexEvents {
  "entry-point-change": PathFindingGraphVertex;
  "state-change": PathFindingGraphVertex;
  "position-change": PathFindingGraphVertex;
  visit: PathFindingGraphVertex;
  "trace-to-source": Array<PathFindingGraphVertex>;
  "targets-update": Array<PathFindingGraphVertex>;
  "edge-change": PathFindingGraphEdge;
}

export type IPathFindingSourceMap = Map<PathFindingGraphVertex["id"], PathFindingGraphVertex["id"]>;

export type IPathFindingTargetSourceMap = Map<PathFindingGraphVertex["id"], IPathFindingSourceMap>;

export interface IPathFindingGraphViewEventsMap {
  "edge-click": JQuery.MouseDownEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {
    edge: PathFindingGraphEdge;
  };
  "vertex-click": JQuery.MouseDownEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {
    vertex: PathFindingGraphVertex;
  };
  "container-click": JQuery.MouseDownEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {};
}

export interface IDijkstraVisualizationOptions {
  width?: number;
  height?: number;
  entry?: [number, number];
  targetPoints?: Array<[number, number]>;
}

export type pathFindingGraphVertexNodeType = "blank" | "target" | "entry";

export interface pathFindingDropdownMenuButtonType {
  label: string;
  callback: () => void;
  props?: any;
}
