import CoordinatedGraph from "../../Graph/Coordinated";
import Dijkstra from "./Algorithm";
import View from "../../View";
import DijkstraMainView from "./MainView";
import { PriorityQueue } from "../../PriorityQueue";

class DijkstraVisualization implements IVisualization {
  private _coordinatedGraph = new CoordinatedGraph("undirected");
  algorithm = new Dijkstra(this._coordinatedGraph);
  views: View<unknown>[] = [new DijkstraMainView(this._coordinatedGraph)];
  start = async () => {
    await this.algorithm.start();
  };

  constructor() {
    this.initProgram();
  }


  initProgram = () => {
    const WIDTH = 100;
    const HEIGHT = 60;
    const GAP = 7;

    const entryPoint = [50, 25];
    const targetPoint = [99, 222  ];

    const mat: Array<Array<any>> = Array.from(Array(HEIGHT).keys()).map(
      (i) => new Array(WIDTH)
    );

    let entryPointRef: any = null;
    let targetPointRef: any = null;

    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        const f = this._coordinatedGraph.addVertex(`${j}-${i}`, {
          x: GAP * j,
          y: GAP * i,
          state: "blank",
          cost: null,
          from: null,
        });
        mat[i][j] = f;
        if (entryPoint[0] === j && entryPoint[1] === i) entryPointRef = f;
        if (targetPoint[0] === j && targetPoint[1] === i) targetPointRef = f;
      }
    }

    for (let row = 0; row < mat.length; row++) {
      for (let col = 0; col < mat[row].length; col++) {
        const currentNode = mat[row][col];
        const bottomNode = mat?.[row + 1]?.[col];
        const nextNode = mat?.[row]?.[col + 1];
        const bottomNextNode = mat?.[row+1]?.[col + 1];
        const topNextNode = mat?.[row-1]?.[col + 1];
        if (nextNode)
          this._coordinatedGraph.connect(currentNode, nextNode, { wight: Math.floor(Math.random() * 10) });
        if (bottomNode)
          this._coordinatedGraph.connect(currentNode, bottomNode, { wight: Math.floor(Math.random() * 10) });
        // if (bottomNextNode)
        //   this._coordinatedGraph.connect(currentNode, bottomNextNode, { wight: 1 });
        // if (topNextNode)
        //   this._coordinatedGraph.connect(currentNode, topNextNode, { wight: 1 });
      }
    }
    this._coordinatedGraph.entryVertex = entryPointRef;
    this._coordinatedGraph.targetVertex = [targetPointRef];
  };
}

export default DijkstraVisualization;
