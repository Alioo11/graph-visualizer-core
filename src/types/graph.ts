import { Nullable } from "ts-wiz";
import { IDataStructure } from "./dataStructure";

export type GraphIteratorTraverseStrategy = "DFS" | "BFS";
export type GraphType = "directed" | "undirected";

export interface IGraphVertex<VERTEX, EDGE> {
  id: string;
  label: string;
  data: VERTEX;
  neighborsEdges: Array<IGraphEdge<VERTEX, EDGE>>;
  neighborsVertexes: Array<IGraphVertex<VERTEX, EDGE>>;
}

export interface IGraphEdge<VERTEX, EDGE> {
  id: string;
  data: EDGE;
  from: IGraphVertex<VERTEX, EDGE>;
  to: IGraphVertex<VERTEX, EDGE>;
}

export interface IAlgorithmGraphEventsMap<VERTEX, EDGE> {
  "add-vertex": IGraphVertex<VERTEX, EDGE>;
  connect: IGraphEdge<VERTEX, EDGE>;
}

export interface IGraph<VERTEX, EDGE> extends IDataStructure<IGraphVertex<VERTEX, EDGE>> {
  traverseStrategy: GraphIteratorTraverseStrategy;
  type: GraphType;
  addVertex: (label: string, data: VERTEX) => IGraphVertex<VERTEX, EDGE>;
  connect: (from: IGraphVertex<VERTEX, EDGE>, to: IGraphVertex<VERTEX, EDGE>, data: EDGE) => IGraphEdge<VERTEX, EDGE>;
  getEdgeBetween: (
    from: IGraphVertex<VERTEX, EDGE>,
    to: IGraphVertex<VERTEX, EDGE>
  ) => Nullable<IGraphEdge<VERTEX, EDGE>>;
  getVertexById(id: string): IGraphVertex<VERTEX, EDGE> | null;
  EdgesIter: () => IterableIterator<IGraphEdge<VERTEX, EDGE>>;
  on: <T extends keyof IAlgorithmGraphEventsMap<VERTEX, EDGE>>(
    eventType: T,
    callback: (data: IAlgorithmGraphEventsMap<VERTEX, EDGE>[T]) => void
  ) => void;
}

export type GraphTopology = "mesh" | "grid"

export interface IGraphFactory<VERTEX, EDGE, G extends IGraph<VERTEX, EDGE>> {
  topology: GraphTopology;
  size: number;
  create: () => G;
}

export type randomizedGraphOptions = {size:number}
export type gridGraphOptions = {
  width: number;
  height: number;
  gap: number;
  entry: [number, number];
  targets: Array<[number, number]>;
};



export interface graphFactoryOptionMap {
  grid: gridGraphOptions;
  randomized: randomizedGraphOptions;
}