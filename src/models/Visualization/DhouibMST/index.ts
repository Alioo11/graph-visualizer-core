import DhouibMST from "./Algorithm";
import GraphView from "./graphView";
import DhouibAdjacencyMatrix from "@models/DataStructure/AdjacencyMatrix/DhouibAdjacencyMatrix";
import MatrixView from "./matrixView";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";
import NumberUtils from "@utils/Number";
import type { DhouibGraphVertex } from "@_types/context/dhouib";
import type { IAlgorithm } from "@_types/algorithm";
import type { IVisualization } from "@_types/visualization";
import type { IView, viewEventMap } from "@_types/view";

const GRAPH_SIZE = 6;


const getDistance = (a:DhouibGraphVertex,b:DhouibGraphVertex)=>{
  const DX = a.data.x - b.data.x;
  const DY = a.data.y - b.data.y;
  return Math.sqrt(DX ** 2 + DY ** 2);
}

class DhouibMSTVisualization implements IVisualization {
  algorithm: IAlgorithm;
  private _graph = new DhouibGraph("undirected");
  private _adjacencyMatrix: DhouibAdjacencyMatrix;

  views: IView<unknown , viewEventMap>[];

  start = async () => {};

  constructor() {
    this.createRandomizedGraph();
    // this.createTraceableSample3();
    this._adjacencyMatrix = new DhouibAdjacencyMatrix(this._graph, {}, { status: "blank" }, (i) => i.distance);
    this.views = [new GraphView(this._graph), new MatrixView(this._adjacencyMatrix)];
    this.algorithm = new DhouibMST(this._graph, this._adjacencyMatrix);
  }

  private createTraceableSample() {
    const A = this._graph.addVertex("A", { x: 10, y: 10 });
    const B = this._graph.addVertex("B", { x: 510, y: 10 });
    const C = this._graph.addVertex("C", { x: 230, y: 110 });
    const D = this._graph.addVertex("D", { x: 510, y: 510 });

    const E = this._graph.addVertex("E", { x: 210, y: 250 });
    const F = this._graph.addVertex("F", { x: 280, y: 250 });

    this._graph.connect(A, B, { distance: 6, status: "stale" });
    this._graph.connect(A, C, { distance: 1, status: "stale" });
    this._graph.connect(A, D, { distance: 5, status: "stale" });

    this._graph.connect(C, B, { distance: 5, status: "stale" });
    this._graph.connect(B, E, { distance: 3, status: "stale" });

    this._graph.connect(C, D, { distance: 5, status: "stale" });
    this._graph.connect(C, E, { distance: 6, status: "stale" });
    this._graph.connect(C, F, { distance: 4, status: "stale" });

    this._graph.connect(F, D, { distance: 2, status: "stale" });
    this._graph.connect(F, E, { distance: 6, status: "stale" });
  }


  private createTraceableSample2() {
    const A = this._graph.addVertex("A", { x: 10, y: 10 });
    const B = this._graph.addVertex("B", { x: 510, y: 10 });
    const C = this._graph.addVertex("C", { x: 230, y: 110 });
    const D = this._graph.addVertex("D", { x: 510, y: 510 });
    const E = this._graph.addVertex("E", { x: 210, y: 250 });

    this._graph.connect(A, B, { distance: 359, status: "stale" });
    this._graph.connect(A, C, { distance: 50, status: "stale" });
    this._graph.connect(A, D, { distance: 233, status: "stale" });
    this._graph.connect(A, E, { distance: 456, status: "stale" });

    this._graph.connect(B, C, { distance: 309, status: "stale" });
    this._graph.connect(B, D, { distance: 125, status: "stale" });
    this._graph.connect(B, E, { distance: 110, status: "stale" });

    this._graph.connect(C, D, { distance: 184, status: "stale" });
    this._graph.connect(C, E, { distance: 408, status: "stale" });

    this._graph.connect(D, E, { distance: 225, status: "stale" });

  }


  private createTraceableSample3() {
    const A = this._graph.addVertex("A", { x: 10, y: 10 });
    const B = this._graph.addVertex("B", { x: 510, y: 10 });
    const C = this._graph.addVertex("C", { x: 250, y: 110 });
    const D = this._graph.addVertex("D", { x: 250, y: 510 });
    const E = this._graph.addVertex("E", { x: 210, y: 250 });
    const F = this._graph.addVertex("F", { x: 290, y: 250 });

    this._graph.connect(A, B, { distance: 136, status: "stale" });
    this._graph.connect(A, C, { distance: 318, status: "stale" });
    this._graph.connect(A, D, { distance: 365, status: "stale" });
    this._graph.connect(A, E, { distance: 179, status: "stale" });
    this._graph.connect(A, F, { distance: 25, status: "stale" });

    this._graph.connect(B, C, { distance: 197, status: "stale" });
    this._graph.connect(B, D, { distance: 252, status: "stale" });
    this._graph.connect(B, E, { distance: 168, status: "stale" });
    this._graph.connect(B, F, { distance: 130, status: "stale" });

    this._graph.connect(C, D, { distance: 61, status: "stale" });
    this._graph.connect(C, E, { distance: 218, status: "stale" });
    this._graph.connect(C, F, { distance: 319, status: "stale" });

    this._graph.connect(D, E, { distance: 241, status: "stale" });
    this._graph.connect(D, F, { distance: 370, status: "stale" });

    this._graph.connect(E, F, { distance: 197, status: "stale" });
  }



  private createRandomizedGraph() {
    for (let i = 0; i < GRAPH_SIZE; i++) {
      this._graph.addVertex(String.fromCharCode(65 + i), {
        x: NumberUtils.randomNumberBetween(0, 60) * 5,
        y: NumberUtils.randomNumberBetween(0, 90) * 5,
      });
    }

    for (const fromVertex of this._graph.iter()) {
      for (const toVertex of this._graph.iter()) {
        if (fromVertex === toVertex) continue;
        const DX = fromVertex.data.x - toVertex.data.x;
        const DY = fromVertex.data.y - toVertex.data.y;
        const distance = Math.round(Math.sqrt(DX ** 2 + DY ** 2));
        this._graph.connect(fromVertex, toVertex, { distance: distance, status: "stale" });
      }
    }
  }
}

export default DhouibMSTVisualization;
