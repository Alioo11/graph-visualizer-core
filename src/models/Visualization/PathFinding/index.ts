import { IAlgorithm } from "../../../types/algorithm";
import { IView } from "../../../types/view";
import { IVisualization } from "../../../types/visualization";
import DijkstraAlgorithm from "./Algorithms/dijkstra";
import PathFindingGraph from "@models/DataStructure/Graph/PathFinding";
import DijkstraGraphView from "./graphView";
import { IDijkstraVisualizationOptions } from "../../../types/pathFindingGraph";
import { DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS } from "../../../constants/visualization/pathFinding";
import RecursiveBacktracking from "./Algorithms/recursiveBacktracking";
import PathfindingGraphFactory from "@models/DataStructure/Graph/PathFinding/factory";

class DijkstraVisualization implements IVisualization {
  private _graph: PathFindingGraph;
  graphFactory = new PathfindingGraphFactory(200);
  mainView: DijkstraGraphView;
  algorithm: IAlgorithm;
  recursiveBacktrackingMazeGenerationAlgorithm: IAlgorithm;
  views: IView<unknown>[] = [];
  start = () => {};

  public width = 30;
  public height = 30;
  public entry: [number, number] = [0, 0];
  public targetPoints: Array<[number, number]> = [[5, 5]];

  constructor(options: IDijkstraVisualizationOptions) {
    this.width = options.width || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.width;
    this.height = options.height || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.height;
    this.entry = options.entry || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.entry;
    this.targetPoints = options.targetPoints || DIJKSTRA_VISUALIZATION_DEFAULT_OPTIONS.targetPoints;
    this._graph = this.graphFactory.create();
    this.mainView = new DijkstraGraphView(this._graph);
    this.algorithm = new DijkstraAlgorithm(this._graph);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
    this.views = [this.mainView];

  }
}

export default DijkstraVisualization;
