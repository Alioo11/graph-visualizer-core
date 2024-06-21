import type { Nullable } from "ts-wiz";
import Graph from ".";
import { DijkstraGraphVertex, DijkstraVertexEvents, IDijkstraGraphEdge, IDijkstraGraphVertex } from "../../../types/dijkstra";
import { GraphType } from "../../../types/graph";

class DijkstraGraph extends Graph<
  IDijkstraGraphVertex,
  IDijkstraGraphEdge
> {
  private _dijkstraVertexEventMap = new Map<
    keyof DijkstraVertexEvents,
    Array<(data: any) => void>
  >();

  entryVertex: Nullable<DijkstraGraphVertex> = null;
  targetVertex: Array<DijkstraGraphVertex> = [];

  constructor(type:GraphType){
    super(type);
  }

  updateVertex(
    vertex: DijkstraGraphVertex,
    cb: (data: DijkstraGraphVertex["data"]) => DijkstraGraphVertex["data"]
  ) {
    const newData = cb(vertex.data);

    const didPositionChange =
      newData.x !== vertex.data.x || newData.y !== vertex.data.y;
    const didStateChange = newData.state !== vertex.data.state;

    vertex.data = newData;

    if (didPositionChange)
      this._dijkstraVertexEventMap
        .get("position-change")
        ?.forEach((cb) => cb(vertex));
    if (didStateChange)
      this._dijkstraVertexEventMap
        .get("state-change")
        ?.forEach((cb) => cb(vertex));
  }

  onVertex = <T extends keyof DijkstraVertexEvents>(
    eventType: T,
    callback: (data: DijkstraVertexEvents[T]) => void
  ) => {
    const events = this._dijkstraVertexEventMap.get(eventType) || [];
    this._dijkstraVertexEventMap.set(eventType, [...events, callback]);
  };
}

export default DijkstraGraph;
