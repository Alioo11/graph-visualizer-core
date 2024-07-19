import DijkstraAlgorithm from "./Algorithms/dijkstra";
import DijkstraGraphView from "./graphView";
import RecursiveBacktracking from "@models/Visualization/PathFinding/Algorithms/recursiveBacktracking";
import PathFindingGraph from "@models/DataStructure/Graph/PathFinding";
import PathfindingGraphFactory from "@models/DataStructure/Graph/PathFinding/factory";
import ExecutionPhase from "@models/ExecutionPhase";
import getWaiterFn from "../../../helpers/getWaiter";
import type { IAlgorithm } from "../../../types/algorithm";
import type { IView } from "../../../types/view";
import type { IVisualization, VisualizationSpeed } from "../../../types/visualization";

class DijkstraVisualization implements IVisualization {
  private _graph: PathFindingGraph;
  private _status = ExecutionPhase.instance();
  private _isAlgorithmRunning = false;
  private _visualizationSpeed: VisualizationSpeed = "fast";
  graphFactory = new PathfindingGraphFactory();
  mainView: DijkstraGraphView;
  algorithm: IAlgorithm;
  recursiveBacktrackingMazeGenerationAlgorithm: IAlgorithm;
  views: IView<unknown>[] = [];

  private get _isValidToRunAlgorithm() {
    return this._status.phase === "prepared" || this._status.phase === "visualization-in-progress";
  }

  start = async () => {
    const waiterFn = getWaiterFn(this._visualizationSpeed);
    if (!this._isValidToRunAlgorithm) throw new Error(`can't start algorithm while program state is at ${this._status.phase}`);
    this._isAlgorithmRunning = true;
    let thereIsMoreSteps = true;
    this._status.update("visualization-in-progress");
    while (this._isAlgorithmRunning && thereIsMoreSteps) {
      await waiterFn();
      const hasNextStep = this.algorithm.iter();
      thereIsMoreSteps = hasNextStep;
      if (!hasNextStep) this._status.update("visualization-done");
    }
  };

  generateRecursiveBacktrackingMaze = async () => {
    const waiterFn = getWaiterFn(this._visualizationSpeed);
    if (this._status.phase !== "prepared" && this._status.phase !== "preparing") throw new Error(`can't start algorithm while program state is at ${this._status.phase}`);
    this._status.update("preparing");
    let thereIsMoreSteps = true;
    while (thereIsMoreSteps) {
      await waiterFn();
      const hasNextStep = this.recursiveBacktrackingMazeGenerationAlgorithm.iter();
      thereIsMoreSteps = hasNextStep;
      if (!hasNextStep) this._status.update("prepared");
    }
  };

  pause = () => {
    if (!this._isValidToRunAlgorithm) return;
    this._isAlgorithmRunning = false;
  };

  step = () => {
    if (!this._isValidToRunAlgorithm) return;
    if(this._status.phase !== "visualization-in-progress") this._status.update("visualization-in-progress");
    const hasNextStep = this.algorithm.iter();
    if (!hasNextStep) this._status.update("visualization-done");
  };

  constructor() {
    this._graph = this.graphFactory.createGrid({size:20 , gap:100});
    this.mainView = new DijkstraGraphView(this._graph);
    this.algorithm = new DijkstraAlgorithm(this._graph);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
    this.views = [this.mainView ];
  }
}

export default DijkstraVisualization;
