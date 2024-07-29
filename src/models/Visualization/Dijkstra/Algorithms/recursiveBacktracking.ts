import DijkstraGraph from "@models/DataStructure/Graph/Dijkstra";
import Stack from "@models/DataStructure/Stack";
import NumberUtils from "@utils/Number";
import type { Nullable, NoneToVoidFunction } from "ts-wiz";
import type { IAlgorithm } from "@_types/algorithm";
import type { DijkstraGraphVertex } from "@_types/context/dijkstra";

class RecursiveBacktracking implements IAlgorithm {
  private _graph: DijkstraGraph;
  private _pathTrace = new Stack<DijkstraGraphVertex>();
  private _visitedVertices = new Set();
  private _currentVertex: Nullable<DijkstraGraphVertex> = null;
  private _step = 0;

  private goOn() {
    const unvisitedNeighbors = this._currentVertex!.neighborsVertexes.filter((v) => !this._visitedVertices.has(v.id));
    if (unvisitedNeighbors.length === 0) {
      this._currentVertex = this._pathTrace.pop()!;
      return;
    }
    const nextNode = unvisitedNeighbors[NumberUtils.randomNumberBetween(0, unvisitedNeighbors.length - 1)];
    const removeAbleEdge = this._graph.getEdgeBetween(nextNode, this._currentVertex!);

    this._graph.updateEdgeData(removeAbleEdge!.id, (e) => ({ ...e, blocked: false }));

    this._currentVertex = nextNode;
    this._pathTrace.push(nextNode);
    this._visitedVertices.add(nextNode.id);
  }

  reset() {
    this._step = 0;
    this._visitedVertices = new Set();
    this._pathTrace = new Stack<DijkstraGraphVertex>();
    this._currentVertex = this._graph.entry;
  }

  initializeFirstStepOfAlgorithm() {
    this._currentVertex = this._graph.entry;
    this._pathTrace.push(this._graph.entry);
    this._visitedVertices.add(this._graph.entry.id);

    for (const e of this._graph.EdgesIter()) {
      this._graph.updateEdgeData(e.id, (e) => ({ ...e, blocked: true }));
    }
  }

  iter = () => {
    if (this._step === 0) {
      this.initializeFirstStepOfAlgorithm();
      this._step += 1;
      return true;
    }
    if (this._pathTrace.length === 0) {
      return false;
    }
    this.goOn();
    return true;
  };

  performFastForward: NoneToVoidFunction = () => {
    let hasMoreSteps = true;
    while (hasMoreSteps) {
      hasMoreSteps = this.iter();
    }
  };

  constructor(graph: DijkstraGraph) {
    this._graph = graph;
  }
}

export default RecursiveBacktracking;
