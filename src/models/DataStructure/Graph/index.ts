import { v4 as uuidv4 } from "uuid";
import TextUtil from "@utils/Text";
import {
  GraphIteratorTraverseStrategy,
  GraphType,
  IAlgorithmGraphEventsMap,
  IGraph,
  IGraphEdge,
  IGraphVertex,
} from "@_types/graph";

class GraphVertex<VERTEX, EDGE> implements IGraphVertex<VERTEX, EDGE> {
  label: string;
  data: VERTEX;
  neighborsEdges: IGraphEdge<VERTEX, EDGE>[] = [];
  id: string;

  constructor(label: string, data: VERTEX) {
    this.label = label;
    this.data = data;
    this.id = uuidv4();
  }
  get neighborsVertexes() {
    const neighborVertexes: Array<IGraphVertex<VERTEX, EDGE>> =
      this.neighborsEdges.map((edge) => {
        return edge.from.id === this.id ? edge.to : edge.from;
      });
    return neighborVertexes;
  }
}

class GraphEdge<VERTEX, EDGE> implements IGraphEdge<VERTEX, EDGE> {
  from: IGraphVertex<VERTEX, EDGE>;
  to: IGraphVertex<VERTEX, EDGE>;
  data: EDGE;
  id: string;

  constructor(
    from: IGraphVertex<VERTEX, EDGE>,
    to: IGraphVertex<VERTEX, EDGE>,
    data: EDGE,
    id:string
  ) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.id = id;
  }
}

class Graph<VERTEX, EDGE> implements IGraph<VERTEX, EDGE> {
  traverseStrategy: GraphIteratorTraverseStrategy = "DFS";
  private _type: GraphType;

  protected _vertexes = new Map<string, GraphVertex<VERTEX, EDGE>>();
  protected _edges = new Map<string, IGraphEdge<VERTEX, EDGE>>();

  private _events = new Map<
    keyof IAlgorithmGraphEventsMap<VERTEX, EDGE>,
    Array<(data: any) => void>
  >();

  constructor(type: GraphType) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  private getConnectionHash = (strA: string, strB: string) => {
    if (this._type === "undirected")
      return TextUtil.bidirectionalHash(strA, strB);
    return TextUtil.directionalHash(strA, strB);
  };

  addVertex = (label: string, data: VERTEX) => {
    const vertexInstance = new GraphVertex<VERTEX, EDGE>(label, data);
    this._vertexes.set(vertexInstance.id, vertexInstance);
    this._events.get("add-vertex")?.forEach((cb) => cb(vertexInstance));
    return vertexInstance;
  };

  connect = (
    from: IGraphVertex<VERTEX, EDGE>,
    to: IGraphVertex<VERTEX, EDGE>,
    data: EDGE
  ) => {
    const connectionHash = this.getConnectionHash(from.id, to.id);
    const connection = this._edges.get(connectionHash);
    if (connection) {
      console.warn(
        `there already is a connection between ${from.label} and ${to.label}`
      );
      return connection;
    }

    const edgeInstance = new GraphEdge<VERTEX, EDGE>(from, to, data , connectionHash);

    from.neighborsEdges.push(edgeInstance);
    if (this.type === "undirected") to.neighborsEdges.push(edgeInstance);

    this._edges.set(connectionHash, edgeInstance);

    this._events.get("connect")?.forEach((cb) => cb(edgeInstance));
    return edgeInstance;
  };

  getEdgeBetween = (
    from: IGraphVertex<VERTEX, EDGE>,
    to: IGraphVertex<VERTEX, EDGE>
  ) => {
    const connectionHash = this.getConnectionHash(from.id, to.id);
    const connection = this._edges.get(connectionHash);
    return connection || null;
  };

  getVertexById(id: string) {
    return this._vertexes.get(id) || null;
  }


  getEdgeById(id: string) {
    return this._edges.get(id) || null;
  }
  
  get size() {
    return this._vertexes.size;
  }

  on = <T extends keyof IAlgorithmGraphEventsMap<VERTEX, EDGE>>(
    eventType: T,
    callback: (data: IAlgorithmGraphEventsMap<VERTEX, EDGE>[T]) => void
  ) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, callback]);
  };

  *iter() {
    for (const item of this._vertexes.values()) {
      yield item;
    }
  }

  
  *EdgesIter() {
    for (const item of this._edges.values()) {
      yield item;
    }
  }
}

export default Graph;
