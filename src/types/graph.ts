import { Nullable } from "ts-wiz";
import { IDataStructure } from "./dataStructure";

export type GraphIteratorTraverseStrategy = "DFS" | "BFS";
export type GraphType = "directed" | "undirected"

export interface IGraphVertex<VERTEX, EDGE> {
  id:string;
  label: string;
  data: VERTEX;
  neighborsEdges: Array<IGraphEdge<VERTEX, EDGE>>;
  neighborsVertexes: Array<IGraphVertex<VERTEX, EDGE>>;
}

export interface IGraphEdge<VERTEX, EDGE> {
  id:string;
  data: EDGE;
  from: IGraphVertex<VERTEX, EDGE>;
  to: IGraphVertex<VERTEX, EDGE>;
}

export interface IAlgorithmGraphEventsMap<VERTEX,EDGE>  {
    "add-vertex": IGraphVertex<VERTEX, EDGE>;
    "connect": IGraphEdge<VERTEX, EDGE>;
}

export interface IGraph<VERTEX, EDGE> extends IDataStructure<IGraphVertex<VERTEX, EDGE>> {
  traverseStrategy: GraphIteratorTraverseStrategy;
  type : GraphType
  addVertex : (label:string,data:VERTEX) => IGraphVertex<VERTEX , EDGE>
  connect : (from: IGraphVertex<VERTEX,EDGE> , to:IGraphVertex<VERTEX,EDGE>,data:EDGE) => IGraphEdge<VERTEX, EDGE>;
  getEdgeBetween: (from: IGraphVertex<VERTEX, EDGE>, to: IGraphVertex<VERTEX, EDGE>)=> Nullable<IGraphEdge<VERTEX,EDGE>>
}

export type CoordinatedGraphVertex = IGraphVertex<ICoordinatedGraphVertex ,ICoordinatedGraphEdge >
export type CoordinatedGraphEdge = IGraphEdge<ICoordinatedGraphVertex ,ICoordinatedGraphEdge >


type CoordinatedGraphVertexState = "blank" | "visited";

export interface ICoordinatedGraphVertex {
  state: CoordinatedGraphVertexState;
  from: Nullable<CoordinatedGraphVertex>
  cost:Nullable<number>
  x: number;
  y: number;
}

export interface ICoordinatedGraphEdge {
  wight: number;
}


export interface CoordinatedVertexEvents {
  "state-change": CoordinatedGraphVertex;
  "position-change": CoordinatedGraphVertex;
}
