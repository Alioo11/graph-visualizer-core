import { v4 as uuidv4 } from "uuid";
import TextUtil from "../../utils/Text";

class GraphVertex<VERTEX, EDGE> implements IGraphVertex<VERTEX, EDGE> {
  label: string;
  data: VERTEX;
  neighbors: IGraphEdge<VERTEX, EDGE>[] = [];
  id: string;

  constructor(label: string, data: VERTEX) {
    this.label = label;
    this.data = data;
    this.id = uuidv4();
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
    data: EDGE
  ) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.id = uuidv4();
  }
}

class Graph<VERTEX, EDGE> implements IGraph<VERTEX, EDGE> {
  traverseStrategy: GraphIteratorTraverseStrategy = "DFS";
  private _type: GraphType;

  private _vertexes: Array<GraphVertex<VERTEX, EDGE>> = [];
  private _edges = new Map<string, IGraphEdge<VERTEX, EDGE>>();

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

  addVertex = (label: string, data: VERTEX) => {
    const vertexInstance = new GraphVertex<VERTEX, EDGE>(label, data);
    this._vertexes.push(vertexInstance);
    this._events.get("add-vertex")?.forEach((cb) => cb(vertexInstance));
    return vertexInstance;
  };

  connect = (
    from: IGraphVertex<VERTEX, EDGE>,
    to: IGraphVertex<VERTEX, EDGE>,
    data: EDGE
  ) => {
    const connectionHash = TextUtil.verticalAdd(from.id, to.id);
    const connection = this._edges.get(connectionHash);
    if (connection) {
      console.warn(
        `there already is a connection between ${from.label} and ${to.label}`
      );
      return connection;
    }

    const edgeInstance = new GraphEdge<VERTEX, EDGE>(from, to, data);

    from.neighbors.push(edgeInstance);
    if (this.type === "undirected") to.neighbors.push(edgeInstance);

    this._edges.set(connectionHash, edgeInstance);

    this._events.get("connect")?.forEach((cb) => cb(edgeInstance));
    return edgeInstance;
  };

  get size() {
    return this._vertexes.length;
  }

  on = <T extends keyof IAlgorithmGraphEventsMap<VERTEX, EDGE>>(
    eventType: T,
    callback: (data: IAlgorithmGraphEventsMap<VERTEX, EDGE>[T]) => void
  ) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, callback]);
  };

  *iter() {
    for (const item of this._vertexes) {
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
