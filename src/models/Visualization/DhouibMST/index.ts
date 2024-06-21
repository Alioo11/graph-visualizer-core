import { IAlgorithm } from "../../../types/algorithm";
import { IVisualization } from "../../../types/visualization";
import { IView } from "../../../types/view";
import DhouibMST from "./Algorithm";
import NumberUtils from "@utils/Number";
import GraphView from "./graphView";
import DhouibAdjacencyMatrix from "@models/DataStructure/AdjacencyMatrix/DhouibAdjacencyMatrix";
import MatrixView from "./matrixView";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";

const GRAPH_SIZE = 9;
class DhouibMSTVisualization implements IVisualization {
  algorithm: IAlgorithm;
  private _graph = new DhouibGraph("undirected");
  private _adjacencyMatrix: DhouibAdjacencyMatrix;

  views: IView<unknown>[];

  start = () => {
    this._adjacencyMatrix.selectMinimumValueFromEachColumn();
  };

  constructor() {
    this.algorithm = new DhouibMST(this._graph);
    this.createRandomizedGraph();
    this._adjacencyMatrix = new DhouibAdjacencyMatrix(this._graph, {}, {}, (i) => i.distance);
    this.views = [new GraphView(this._graph), new MatrixView(this._adjacencyMatrix)];
  }

  private createRandomizedGraph() {
    for (let i = 0; i < GRAPH_SIZE; i++) {
      this._graph.addVertex(String.fromCharCode(65 + i), {
        x: NumberUtils.randomNumberBetween(0, 80) * 5,
        y: NumberUtils.randomNumberBetween(0, 80) * 5,
      });
    }

    for (const fromVertex of this._graph.iter()) {
      for (const toVertex of this._graph.iter()) {
        if (fromVertex === toVertex) continue;
        const DX = fromVertex.data.x - toVertex.data.x;
        const DY = fromVertex.data.y - toVertex.data.y;
        const distance = Math.round(Math.sqrt(DX ** 2 + DY ** 2));
        this._graph.connect(fromVertex, toVertex, { distance: distance, status: "blank" });
      }
    }
  }
}

export default DhouibMSTVisualization;
