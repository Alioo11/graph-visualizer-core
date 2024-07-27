import DijkstraGraph from "@models/DataStructure/Graph/Dijkstra";
import wait from "@utils/wait";
import type { IAlgorithm } from "@_types/algorithm";
import type { DijkstraGraphVertex } from "@_types/dijkstra";

interface IDijkstraCandidateVertexesPQ {
  cost: number;
  vertex: DijkstraGraphVertex;
}

class DijkstraAlgorithm implements IAlgorithm {
  private graph: DijkstraGraph;
  private vertexSourceMap = new Map<string, string>();

  private sortedList: Array<IDijkstraCandidateVertexesPQ> = [];

  private scannedNodes = new Set<string>();
  private foundTarget = false;

  reset = () => {};

  iter = () => {
    // this.graph.addVertex("A" , {x:0 , y:0 , state:"blank" , isTarget:true});
    return false;
  };
  performFastForward = null;

  constructor(graph: DijkstraGraph) {
    this.graph = graph;
  }

  visitVertex(vertex: DijkstraGraphVertex, source: DijkstraGraphVertex) {
    const undiscoveredVertexes = vertex.neighborsVertexes.filter(
      (vtx) => vtx.data.state !== "visited" && !this.scannedNodes.has(vtx.id)
    );

    const edgeFromSource = this.graph.getEdgeBetween(vertex, source);
    if (!edgeFromSource) throw new Error("there must be a connection between source and vertex");

    undiscoveredVertexes.forEach((vtx) => {
      this.scannedNodes.add(vtx.id);
    });
    this.graph.updateVertex(vertex, (vtx) => ({ ...vtx, state: "visited" }));
  }

  async start() {
    if (this.graph.entryVertex === null) return;
    if (this.graph.targetVertex.length === 0) return;

    // init
    this.graph.updateVertex(this.graph.entryVertex, (vtx) => ({
      ...vtx,
      state: "visited",
    }));
    this.graph.entryVertex.data.cost = 1;

    this.graph.entryVertex.neighborsVertexes.forEach((vertex) => {
      this.vertexSourceMap.set(vertex.id, this.graph.entryVertex!.id);
      const edgeBetween = this.graph.getEdgeBetween(this.graph.entryVertex!, vertex);
      const cost = edgeBetween?.data.wight || 1;
      this.sortedList.push({ vertex, cost });
      vertex.data.cost = cost;
    });

    while (!this.foundTarget) {
      await wait(5);
      this.sortedList.sort((a, b) => b.cost - a.cost);
      const selectedVertex = this.sortedList.pop();
      if (!selectedVertex) break; // the whole graph has been traversed and yet target not found
      if (selectedVertex.vertex === this.graph.targetVertex[0]) {
        this.foundTarget = true;
        break;
      } // found target
      const selectedVertexSourceId = this.vertexSourceMap.get(selectedVertex.vertex.id);
      if (!selectedVertexSourceId) throw new Error("err1");
      const selectedVertexSource = this.graph.getVertexById(selectedVertexSourceId);
      if (!selectedVertexSource) throw new Error("err2");
      const neighborsFromSelectedVertex = selectedVertex.vertex.neighborsVertexes.filter(
        (neigh) => neigh.data.state !== "visited" && !this.vertexSourceMap.has(neigh.id)
      );
      neighborsFromSelectedVertex.forEach((vertex) => {
        this.vertexSourceMap.set(vertex.id, selectedVertex.vertex.id);
        const edgeBetween = this.graph.getEdgeBetween(vertex, selectedVertex.vertex);
        if (!edgeBetween) throw new Error("err3");
        const cost = edgeBetween.data.wight + selectedVertexSource.data.cost!;
        vertex.data.cost = cost;
        this.sortedList.push({ vertex, cost });
      });
      this.graph.updateVertex(selectedVertex.vertex, (vtx) => ({
        ...vtx,
        state: "visited",
      }));
    }
  }
}

export default DijkstraAlgorithm;
