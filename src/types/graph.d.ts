
type GraphIteratorTraverseStrategy = "DFS" | "BFS";
type GraphType = "directed" | "undirected"

interface IGraphVertex<VERTEX, EDGE> {
  id:string;
  label: string;
  data: VERTEX;
  neighborsEdges: Array<IGraphEdge<VERTEX, EDGE>>;
  neighborsVertexes: Array<IGraphVertex<VERTEX, EDGE>>;
}

interface IGraphEdge<VERTEX, EDGE> {
  id:string;
  data: EDGE;
  from: IGraphVertex<VERTEX, EDGE>;
  to: IGraphVertex<VERTEX, EDGE>;
}

interface IAlgorithmGraphEventsMap<VERTEX,EDGE>  {
    "add-vertex": IGraphVertex<VERTEX, EDGE>;
    "connect": IGraphEdge<VERTEX, EDGE>;
}

interface IGraph<VERTEX, EDGE> extends IDataStructure<IGraphVertex<VERTEX, EDGE>> {
  traverseStrategy: GraphIteratorTraverseStrategy;
  type : GraphType
  addVertex : (label:string,data:VERTEX) => IGraphVertex<VERTEX , EDGE>
  connect : (from: IGraphVertex<VERTEX,EDGE> , to:IGraphVertex<VERTEX,EDGE>,data:EDGE) => IGraphEdge<VERTEX, EDGE>;
}

type CoordinatedGraphVertex = IGraphVertex<ICoordinatedGraphVertex ,ICoordinatedGraphEdge >
type CoordinatedGraphEdge = IGraphEdge<ICoordinatedGraphVertex ,ICoordinatedGraphEdge >


type CoordinatedGraphVertexState = "blank" | "visited";

interface ICoordinatedGraphVertex {
  state: CoordinatedGraphVertexState;
  from: Nullable<CoordinatedGraphVertex>
  cost:nullable<number>
  x: number;
  y: number;
}

interface ICoordinatedGraphEdge {
  wight: number;
}


interface CoordinatedVertexEvents {
  "state-change": CoordinatedGraphVertex;
  "position-change": CoordinatedGraphVertex;
}
