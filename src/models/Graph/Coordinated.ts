import type { Nullable } from "ts-wiz";
import Graph from ".";
import { CoordinatedGraphVertex, CoordinatedVertexEvents, ICoordinatedGraphEdge, ICoordinatedGraphVertex } from "../../types/graph";

class CoordinatedGraph extends Graph<
  ICoordinatedGraphVertex,
  ICoordinatedGraphEdge
> {
  private _coordinatedVertexEventMap = new Map<
    keyof CoordinatedVertexEvents,
    Array<(data: any) => void>
  >();

  entryVertex: Nullable<CoordinatedGraphVertex> = null;
  targetVertex: Array<CoordinatedGraphVertex> = [];

  updateVertex(
    vertex: CoordinatedGraphVertex,
    cb: (data: CoordinatedGraphVertex["data"]) => CoordinatedGraphVertex["data"]
  ) {
    const newData = cb(vertex.data);

    const didPositionChange =
      newData.x !== vertex.data.x || newData.y !== vertex.data.y;
    const didStateChange = newData.state !== vertex.data.state;

    vertex.data = newData;

    if (didPositionChange)
      this._coordinatedVertexEventMap
        .get("position-change")
        ?.forEach((cb) => cb(vertex));
    if (didStateChange)
      this._coordinatedVertexEventMap
        .get("state-change")
        ?.forEach((cb) => cb(vertex));
  }

  onVertex = <T extends keyof CoordinatedVertexEvents>(
    eventType: T,
    callback: (data: CoordinatedVertexEvents[T]) => void
  ) => {
    const events = this._coordinatedVertexEventMap.get(eventType) || [];
    this._coordinatedVertexEventMap.set(eventType, [...events, callback]);
  };
}

export default CoordinatedGraph;
