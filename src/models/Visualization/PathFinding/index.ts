import { IAlgorithm } from "../../../types/algorithm";
import { IView } from "../../../types/view";
import { IVisualization } from "../../../types/visualization";
import DijkstraAlgorithm from "./dijkstra";
import PathFindingGraph from "@models/DataStructure/Graph/PathFindingGraph";
import DijkstraGraphView from "./graphView";
import { Nullable } from "ts-wiz";
import { IDijkstraVisualizationOptions, PathFindingGraphVertex } from "../../../types/pathFindingGraph";
import { DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS } from "../../../constants/visualization/pathFinding";


class DijkstraVisualization implements IVisualization {
  private _graph: PathFindingGraph;
  private _mainView: DijkstraGraphView;
  algorithm: IAlgorithm;
  views: IView<unknown>[] = [];
  start = () => {};

  public width = 30;
  public height = 30;
  public entry: [number, number] = [0, 0];
  public targetPoints: Array<[number, number]> = [[5, 5]];

  private _entryPointRef : Nullable<PathFindingGraphVertex> = null;
  private _targetPointsRef : Array<PathFindingGraphVertex> = [];

  constructor(options:IDijkstraVisualizationOptions) {
    this.width = options.width || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.width
    this.height = options.height || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.height
    this.entry = options.entry || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.entry
    this.targetPoints = options.targetPoints || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.targetPoints
    this._graph = new PathFindingGraph("undirected");
    this._mainView = new DijkstraGraphView(this._graph);
    this.algorithm = new DijkstraAlgorithm(this._graph);
    this.views = [this._mainView];
    this._initProgram();
  }

  private _initProgram = () => {
    const GAP = 40;
    const mat: Array<Array<any>> = Array.from(Array(this.height).keys()).map((i) => new Array(this.width));

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const f = this._graph.addVertex(`${j}-${i}`, {
          x: GAP * j,
          y: GAP * i,
        });
        mat[i][j] = f;
        if (this.entry[0] === j && this.entry[1] === i) this._entryPointRef! = f;
        this.targetPoints.forEach((t,index)=>{
          if(t[0] === j && t[1] === i) this._targetPointsRef[index] =f;
        })
      }
    }

    for (let row = 0; row < mat.length; row++) {
      for (let col = 0; col < mat[row].length; col++) {
        const currentNode = mat[row][col];
        const bottomNode = mat?.[row + 1]?.[col];
        const nextNode = mat?.[row]?.[col + 1];
        const bottomNextNode = mat?.[row + 1]?.[col + 1];
        const topNextNode = mat?.[row - 1]?.[col + 1];
        if (nextNode) this._graph.connect(currentNode, nextNode, { wight: Math.random() * 10 > 2 ? 1 : Infinity });
        if (bottomNode) this._graph.connect(currentNode, bottomNode, { wight: Math.random() * 10 > 2 ? 1 : Infinity });
        // if (bottomNextNode)
        //   this._graph.connect(currentNode, bottomNextNode, { wight: Math.floor(Math.random() * 100) });
        // if (topNextNode)
        //   this._graph.connect(currentNode, topNextNode, { wight: Math.floor(Math.random() * 100) });
      }
    }
    this._graph.entry = this._entryPointRef!;

    this._targetPointsRef.forEach((targetRef)=>{
      this._graph.addTarget(targetRef)
    })
  };
};

export default DijkstraVisualization;