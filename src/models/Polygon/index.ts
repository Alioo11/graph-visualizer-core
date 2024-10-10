import Graph from "@models/DataStructure/Graph";
import EventManager from "@models/EventManager";
import type { IGraph } from "@_types/dataStructure/graph";
import type {
  IPolygon,
  IPolygonEventMap,
  IPolygonGraphEdge,
  IPolygonGraphVertex,
  PolygonAsArray,
} from "@_types/polygon";
import type { coordinate } from "@_types/coordinate";

class Polygon implements IPolygon {
  private _graph: IGraph<IPolygonGraphVertex, IPolygonGraphEdge>;
  private _eventManager: EventManager<IPolygonEventMap>;
  public on: EventManager<IPolygonEventMap>["on"] = (eventType, cb) => this._eventManager.on(eventType, cb);

  constructor(points: PolygonAsArray = []) {
    this._graph = new Graph<coordinate, {}>("undirected");
    this._eventManager = new EventManager();
    this._initiatePolygonFromPoints(points);
  }

  private _initiatePolygonFromPoints = (points: PolygonAsArray) => {
    let prevVertex = null;
    let startingVertex = null;
    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i];
      const isFirstIter = i === 0;
      const isLastIter = i === points.length - 1;

      const [x, y] = currentPoint;
      const vertex = this._graph.addVertex(`${x}-${y}`, { x, y });

      if (isFirstIter) {
        startingVertex = vertex;
        prevVertex = vertex;
      } else if (isLastIter) {
        this._graph.connect(vertex, startingVertex!, {});
        this._graph.connect(vertex, prevVertex!, {});
      } else {
        this._graph.connect(vertex, prevVertex!, {});
      }
    }
  };

  get vertexes(){
    return this._graph.iter;
  }

  isInside: IPolygon["isInside"] = (x, y) => {
    return true;
  };
}

export default Polygon;

const tensorFieldArea = new Polygon([
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
]);
