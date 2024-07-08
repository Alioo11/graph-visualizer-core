import { Nullable } from "ts-wiz";
import Graph from ".";
import {
  IPathFindingGraphEdge,
  IPathFindingGraphVertex,
  IPathFindingSourceMap,
  IPathFindingTargetSourceMap,
  PathFindingGraphVertex,
  PathFindingVertexEvents,
} from "../../../types/pathFindingGraph";

class PathFindingGraph extends Graph<IPathFindingGraphVertex, IPathFindingGraphEdge> {
  private _targets: Array<PathFindingGraphVertex> = [];
  private _currentTargetIndex: number = 0;
  private _pathFindingEvents = new Map<keyof PathFindingVertexEvents, Array<(data: any) => void>>();

  private _targetSourceMap: IPathFindingTargetSourceMap = new Map<
    PathFindingGraphVertex["id"],
    IPathFindingSourceMap
  >();

  private _entry: Nullable<PathFindingGraphVertex> = null;

  set entry(vertex: PathFindingGraphVertex) {
    if (this._entry !== null) throw new Error("can't reassign entry point");
    this._entry = vertex;
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
    console.log(this._targets , this._currentTargetIndex)
    return this._targets.length === this._currentTargetIndex;
  }

  public tracePathToSource (vertex:PathFindingGraphVertex, target?:PathFindingGraphVertex){
    const targetNode = target || this.currentTarget;
    const mp = this._targetSourceMap.get(targetNode.id);
    if(!mp) throw new Error(`could not find source map for ${targetNode.label}`);
    const pathVertexId = [];
    let currentVertexId: Nullable<PathFindingGraphVertex["id"]> = vertex.id;
    while(currentVertexId){
      pathVertexId.push(currentVertexId)
      currentVertexId = mp.get(currentVertexId) || null;
    }
    const path = pathVertexId.reverse().map(vertexId => this.getVertexById(vertexId));

    this._pathFindingEvents.get("trace-to-source")?.forEach(cb=> cb(path));
  }

  moveToNextTarget() {
    if(this.foundAllTargets) return ;
    this._currentTargetIndex += 1;
  }

  visitVertex = (vertex: PathFindingGraphVertex, source: PathFindingGraphVertex) => {
    if (!this._targetSourceMap.get(this.currentTarget.id)) this._targetSourceMap.set(this.currentTarget.id, new Map());
    const tSourceMap = this._targetSourceMap.get(this.currentTarget.id)!;
    tSourceMap.set(vertex.id, source.id);
    this._pathFindingEvents.get("visit")?.forEach(cb=> cb(vertex));
  };

  get targets() {
    return this._targets;
  }

  addTarget(vertex: PathFindingGraphVertex) {
    this._targets.push(vertex);
  }

  onPathFinding = <T extends keyof PathFindingVertexEvents>(
    eventType: T,
    callback: (data: PathFindingVertexEvents[T]) => void
  ) => {
    const events = this._pathFindingEvents.get(eventType) || [];
    this._pathFindingEvents.set(eventType, [...events, callback]);
  };
}

export default PathFindingGraph;
