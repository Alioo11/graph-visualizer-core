import Heap from "@models/DataStructure/Heap";
import DijkstraGraph from "@models/DataStructure/Graph/Dijkstra";
import type { IAlgorithm } from "@_types/algorithm";
import type { DijkstraGraphVertex } from "@_types/context/dijkstra";

type dijkstraPQueue = { cost: number; vertex: DijkstraGraphVertex; source: DijkstraGraphVertex };

class DijkstraAlgorithm implements IAlgorithm {
  private _candidateNodesPQueue = new Heap<dijkstraPQueue>((a, b) => a.cost - b.cost);

  private _visitSet = new Set();

  private _graph: DijkstraGraph;
  private _step = 0;

  constructor(graph: DijkstraGraph) {
    this._graph = graph;
  }

  get isFinished() {
    return this._graph.foundAllTargets;
  }

  reset() {}

  private handleToGoNextTarget() {
    this._initializeHeap(this._graph.currentTarget);
    this._graph.moveToNextTarget();
    return !this.isFinished;
  }

  private _pickNextVertex() {
    const nextNode = this._candidateNodesPQueue.pop();
    if (!nextNode) return false; // searched all vertexes
    const { vertex, source, cost: costSoFar } = nextNode;

    this._graph.visitVertex(vertex, source);

    if (vertex === this._graph.currentTarget) {
      this._graph.tracePathToSource(this._graph.currentTarget);
      return this.handleToGoNextTarget();
    }

    const newNeighbors = vertex.neighborsVertexes.filter((neigh) => !this._visitSet.has(neigh.id));
    newNeighbors.forEach((neigh) => {
      const connection = this._graph.getEdgeBetween(neigh, vertex);
      if (!connection) throw new Error();
      if (connection.data.blocked) return;
      this._candidateNodesPQueue.push({ vertex: neigh, source: vertex, cost: connection.data.wight + costSoFar });
      this._visitSet.add(neigh.id);
    });

    return true;
  }

  private _initializeHeap(startingVertex: DijkstraGraphVertex) {
    this._candidateNodesPQueue = new Heap<dijkstraPQueue>((a, b) => a.cost - b.cost);
    this._visitSet = new Set();

    this._visitSet.add(startingVertex.id);
    startingVertex.neighborsVertexes.forEach((neigh) => {
      const connection = this._graph.getEdgeBetween(neigh, startingVertex);
      if (!connection) throw new Error("could not find a connection ");
      if (connection.data.blocked) return;
      this._candidateNodesPQueue.push({ cost: connection.data.wight, vertex: neigh, source: startingVertex });
      this._visitSet.add(neigh.id);
    });
  }

  iter = () => {
    if (!this._graph.entry) throw new Error("Graph entry is missing.");
    if (this._graph.targets.length === 0) throw new Error("No targets found in the graph.");

    if (this.isFinished) {
      console.warn("the algorithm operations has been finished ");
      return false;
    }

    if (this._step === 0) {
      this._initializeHeap(this._graph.entry);
      this._step += 1;
      return true;
    }
    return this._pickNextVertex();
  };
  performFastForward = () => {};
}

export default DijkstraAlgorithm;
