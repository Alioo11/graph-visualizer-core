import { IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";
import { infiniteCanvasEventMap } from "@_types/view/infiniteCanvas";

export interface IDijkstraGraphVertex {
  x: number;
  y: number;
}

export interface IDijkstraGraphEdge {
  wight: number;
  blocked: boolean;
}

export type DijkstraGraphVertex = IGraphVertex<IDijkstraGraphVertex, IDijkstraGraphEdge>;
export type DijkstraGraphEdge = IGraphEdge<IDijkstraGraphVertex, IDijkstraGraphEdge>;

export interface DijkstraVertexEvents {
  "entry-point-change": DijkstraGraphVertex;
  "state-change": DijkstraGraphVertex;
  "position-change": DijkstraGraphVertex;
  visit: DijkstraGraphVertex;
  "trace-to-source": Array<DijkstraGraphVertex>;
  "targets-update": Array<DijkstraGraphVertex>;
  "edge-change": DijkstraGraphEdge;
}

export type IDijkstraSourceMap = Map<DijkstraGraphVertex["id"], DijkstraGraphVertex["id"]>;

export type IDijkstraTargetSourceMap = Map<DijkstraGraphVertex["id"], IDijkstraSourceMap>;

export interface IDijkstraGraphViewEventsMap extends infiniteCanvasEventMap {
  "edge-click": JQuery.MouseDownEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {
    edge: DijkstraGraphEdge;
  };
  "vertex-click": JQuery.MouseDownEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {
    vertex: DijkstraGraphVertex;
  };
  "container-click": JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement> & {};
}

export interface IDijkstraVisualizationOptions {
  width?: number;
  height?: number;
  entry?: [number, number];
  targetPoints?: Array<[number, number]>;
}

export type DijkstraGraphVertexNodeType = "blank" | "target" | "entry";

export interface DijkstraDropdownMenuButtonType {
  label: string;
  callback: () => void;
  props?: any;
}

export type dijkstraPQueue = { cost: number; vertex: DijkstraGraphVertex; source: DijkstraGraphVertex };
