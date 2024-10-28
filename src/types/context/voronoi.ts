import type { coordinate } from "@_types/coordinate";
import type { IGraph, IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";

type VoronoiEdgeType = "bounding-box" | "inner-segmentation";

export interface IVoronoiVertex {
  coordinate: coordinate;
}

export interface IVoronoiEdge {
  distanceFromSites: number;
  type: VoronoiEdgeType;
}

export type IVoronoiGraph = IGraph<IVoronoiVertex, IVoronoiEdge>;
export type IVoronoiGraphVertex = IGraphVertex<IVoronoiVertex, IVoronoiEdge>;
export type IVoronoiGraphEdge = IGraphEdge<IVoronoiVertex, IVoronoiEdge>;
