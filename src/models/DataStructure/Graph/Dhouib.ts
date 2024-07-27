import Graph from ".";
import type { Nullable } from "ts-wiz";
import type { GraphType } from "@_types/graph";
import type {
  DhouibGraphEdge,
  DhouibGraphVertex,
  DhouibVertexEventMap,
  IDhouibGraphEdge,
  IDhouibGraphEdgeEventMap,
  IDhouibGraphVertex,
} from "@_types/dhouib";

class DhouibGraph extends Graph<IDhouibGraphVertex, IDhouibGraphEdge> {
  private _dhouibVertexEventMap = new Map<keyof DhouibVertexEventMap, Array<(data: any) => void>>();
  private _dhouibEdgeEventMap = new Map<keyof DhouibVertexEventMap, Array<(data: any) => void>>();

  entryVertex: Nullable<DhouibGraphVertex> = null;
  targetVertex: Array<DhouibGraphVertex> = [];

  constructor(type: GraphType) {
    super(type);
  }

  updateEdge(edgeId: DhouibGraphEdge["id"], updateCb: (e: DhouibGraphEdge["data"]) => DhouibGraphEdge["data"]) {
    const edge = this._edges.get(edgeId);
    if (!edge) throw new Error(`could not find graph edge with id ${edgeId}`);
    const updatedGraphEdgeData = updateCb(edge["data"]);
    const didStateChange = updatedGraphEdgeData.status !== edge.data.status;
    edge.data = updatedGraphEdgeData;
    if (didStateChange) this._dhouibEdgeEventMap.get("state-change")?.forEach((cb) => cb(edge));
  }

  onEdge = <T extends keyof IDhouibGraphEdgeEventMap>(
    eventType: T,
    callback: (data: IDhouibGraphEdgeEventMap[T]) => void
  ) => {
    const events = this._dhouibEdgeEventMap.get(eventType) || [];
    this._dhouibEdgeEventMap.set(eventType, [...events, callback]);
  };

  onVertex = <T extends keyof DhouibVertexEventMap>(
    eventType: T,
    callback: (data: DhouibVertexEventMap[T]) => void
  ) => {
    const events = this._dhouibVertexEventMap.get(eventType) || [];
    this._dhouibVertexEventMap.set(eventType, [...events, callback]);
  };
}

export default DhouibGraph;
