import wait from "../../../utils/wait";
import CoordinatedGraph from "../../Graph/Coordinated";
import { PriorityQueue } from "../../PriorityQueue";

interface IDijkstraCandidateVertexesPQ {
  cost: number;
  vertex: CoordinatedGraphVertex;
}

class Dijkstra implements IAlgorithm {
  private graph: CoordinatedGraph;
  private vertexSourceMap = new Map<string,string>(); 
  private PQueue = new PriorityQueue<IDijkstraCandidateVertexesPQ>(
    (a, b) => a.cost > b.cost
  );

  private sortedList :Array<IDijkstraCandidateVertexesPQ> = [];

  private scannedNodes = new Set<string>();
  private foundTarget = false;

  iter = async () => {
    // this.graph.addVertex("A" , {x:0 , y:0 , state:"blank" , isTarget:true});
  };
  performFastForward = null;

  constructor(graph: CoordinatedGraph) {
    this.graph = graph;
  }

  visitVertex(vertex: CoordinatedGraphVertex, source: CoordinatedGraphVertex) {
    const undiscoveredVertexes = vertex.neighborsVertexes.filter(
      (vtx) => vtx.data.state !== "visited" && !this.scannedNodes.has(vtx.id)
    );

    const edgeFromSource = this.graph.getEdgeBetween(vertex, source);
    if (!edgeFromSource)
      throw new Error("there must be a connection between source and vertex");

    undiscoveredVertexes.forEach((vtx) => {
      this.scannedNodes.add(vtx.id);
      this.PQueue.push({
        vertex: vtx,
        cost: vertex.data.cost + edgeFromSource.data.wight ,
      });
    });
    this.graph.updateVertex(vertex, (vtx) => ({ ...vtx, state: "visited" }));
  }

  async start() {
    if (this.graph.entryVertex === null) return;
    if (this.graph.targetVertex.length === 0) return;

    // init
    this.graph.updateVertex(this.graph.entryVertex, (vtx) => ({...vtx,state: "visited",}));
    this.graph.entryVertex.data.cost = 1

    this.graph.entryVertex.neighborsVertexes.forEach(vertex =>{
      this.vertexSourceMap.set(vertex.id , this.graph.entryVertex!.id);
      const edgeBetween = this.graph.getEdgeBetween(this.graph.entryVertex!, vertex);
      const cost = edgeBetween?.data.wight || 1;
      this.sortedList.push({vertex,cost});
      vertex.data.cost = cost;
    })

    while(!this.foundTarget){
      await wait(5);
      this.sortedList.sort((a, b) => b.cost - a.cost);
      console.log(this.sortedList.map(i => i.cost))
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
      const neighborsFromSelectedVertex = selectedVertex.vertex.neighborsVertexes.filter(neigh => neigh.data.state !== "visited" && !this.vertexSourceMap.has(neigh.id));
      neighborsFromSelectedVertex.forEach((vertex)=>{
        this.vertexSourceMap.set(vertex.id , selectedVertex.vertex.id);
        const edgeBetween = this.graph.getEdgeBetween(vertex , selectedVertex.vertex);
        if(!edgeBetween) throw new Error("err3");
        const cost = edgeBetween.data.wight + selectedVertexSource.data.cost;
        vertex.data.cost = cost;
        this.sortedList.push({vertex ,cost })
      })
      this.graph.updateVertex(selectedVertex.vertex , (vtx) => ({...vtx , state:"visited"}));
    }
  }
}

export default Dijkstra;