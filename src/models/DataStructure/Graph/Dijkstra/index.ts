import Graph from "..";
import type { Nullable } from "ts-wiz";
import type {
  IDijkstraGraphEdge,
  IDijkstraGraphVertex,
  IDijkstraSourceMap,
  IDijkstraTargetSourceMap,
  DijkstraGraphEdge,
  DijkstraGraphVertex,
  DijkstraVertexEvents,
} from "@_types/context/dijkstra";

class DijkstraGraph extends Graph<IDijkstraGraphVertex, IDijkstraGraphEdge> {
  private _targets: Array<DijkstraGraphVertex> = [];
  private _currentTargetIndex: number = 0;
  private _dijkstraEvents = new Map<keyof DijkstraVertexEvents, Array<(data: any) => void>>();

  private _targetSourceMap: IDijkstraTargetSourceMap = new Map<
    DijkstraGraphVertex["id"],
    IDijkstraSourceMap
  >();

  private _entry: Nullable<DijkstraGraphVertex> = null;

  set entry(vertex: DijkstraGraphVertex) {
    this._entry = vertex;
    this._dijkstraEvents.get("entry-point-change")?.forEach((cb) => cb(this._entry));
  }

  get entry() {
    if (this._entry === null) throw new Error("entry point has not been initialized yet");
    return this._entry;
  }

  get currentTarget() {
    const currentTarget = this._targets[this._currentTargetIndex];
    if (!currentTarget) throw new Error(`could not find current target at ${this._currentTargetIndex}`);
    return currentTarget;
  }

  get foundAllTargets() {
    return this._targets.length === this._currentTargetIndex;
  }

  public tracePathToSource(vertex: DijkstraGraphVertex, target?: DijkstraGraphVertex) {
    const targetNode = target || this.currentTarget;
    const mp = this._targetSourceMap.get(targetNode.id);
    if (!mp) throw new Error(`could not find source map for ${targetNode.label}`);
    const pathVertexId = [];
    let currentVertexId: Nullable<DijkstraGraphVertex["id"]> = vertex.id;
    while (currentVertexId) {
      pathVertexId.push(currentVertexId);
      currentVertexId = mp.get(currentVertexId) || null;
    }
    const path = pathVertexId.reverse().map((vertexId) => this.getVertexById(vertexId));

    this._dijkstraEvents.get("trace-to-source")?.forEach((cb) => cb(path));
  }

  moveToNextTarget() {
    if (this.foundAllTargets) return;
    this._currentTargetIndex += 1;
  }

  visitVertex = (vertex: DijkstraGraphVertex, source: DijkstraGraphVertex) => {
    if (!this._targetSourceMap.get(this.currentTarget.id)) this._targetSourceMap.set(this.currentTarget.id, new Map());
    const tSourceMap = this._targetSourceMap.get(this.currentTarget.id)!;
    tSourceMap.set(vertex.id, source.id);
    this._dijkstraEvents.get("visit")?.forEach((cb) => cb(vertex));
  };

  get targets() {
    return this._targets;
  }

  addTarget(vertex: DijkstraGraphVertex) {
    this._targets.push(vertex);
    this._dijkstraEvents.get("targets-update")?.forEach((cb) => cb(this.targets));
  }

  removeTarget(vertexId: DijkstraGraphVertex["id"]) {
    const vertex = this.targets.find((v) => v.id === vertexId);
    if (!vertex) throw new Error(`Could not find a vertex with given ID: ${vertexId} in target list`);
    this._targets = this.targets.filter((v) => v.id !== vertexId);
    this._dijkstraEvents.get("targets-update")?.forEach((cb) => cb(this.targets));
  }

  updateEdgeData(
    edgeId: DijkstraGraphEdge["id"],
    updateCallback: (e: DijkstraGraphEdge["data"]) => DijkstraGraphEdge["data"]
  ) {
    const edge = this._edges.get(edgeId);
    if (!edge) throw new Error(`could not find a edge with ID: ${edgeId}`);
    const newData = updateCallback(edge.data);

    edge.data = newData;

    this._dijkstraEvents.get("edge-change")?.forEach((cb) => cb(edge));
  }

  onDijkstra = <T extends keyof DijkstraVertexEvents>(
    eventType: T,
    callback: (data: DijkstraVertexEvents[T]) => void
  ) => {
    const events = this._dijkstraEvents.get(eventType) || [];
    this._dijkstraEvents.set(eventType, [...events, callback]);
  };
}

export default DijkstraGraph;
