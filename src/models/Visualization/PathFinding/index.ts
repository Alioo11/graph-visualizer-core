import DijkstraAlgorithm from "./Algorithms/dijkstra";
import DijkstraGraphView from "./graphView";
import RecursiveBacktracking from "@models/Visualization/PathFinding/Algorithms/recursiveBacktracking";
import PathFindingGraph from "@models/DataStructure/Graph/PathFinding";
import PathfindingGraphFactory from "@models/DataStructure/Graph/PathFinding/factory";
import ExecutionPhase from "@models/ExecutionPhase";
import getWaiterFn from "@helpers/getWaiter";
import type { IAlgorithm } from "@_types/algorithm";
import type { IView } from "@_types/view";
import type { IVisualization, VisualizationSpeed } from "@_types/visualization";
import type { graphFactoryOptionMap, gridGraphOptions, randomizedGraphOptions } from "@_types/graph";

class DijkstraVisualization<T extends keyof graphFactoryOptionMap> implements IVisualization {
  private _graph: PathFindingGraph;
  private _status = ExecutionPhase.instance();
  private _isAlgorithmRunning = false;
  speed: VisualizationSpeed = "fast";
  graphFactory = new PathfindingGraphFactory();
  mainView: DijkstraGraphView;
  algorithm: IAlgorithm;
  recursiveBacktrackingMazeGenerationAlgorithm: IAlgorithm;
  views: IView<unknown>[] = [];

  private get _isValidToRunAlgorithm() {
    return this._status.phase === "prepared" || this._status.phase === "visualization-in-progress";
  }

  start = async () => {
    const waiterFn = getWaiterFn(this.speed);
    if (!this._isValidToRunAlgorithm)
      throw new Error(`can't start algorithm while program state is at ${this._status.phase}`);
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
    const waiterFn = getWaiterFn(this.speed);
    if (this._status.phase !== "prepared" && this._status.phase !== "preparing")
      throw new Error(`can't start algorithm while program state is at ${this._status.phase}`);
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
    if (this._status.phase !== "visualization-in-progress") this._status.update("visualization-in-progress");
    const hasNextStep = this.algorithm.iter();
    if (!hasNextStep) this._status.update("visualization-done");
  };

  createGraph(graphType: T, options: graphFactoryOptionMap[T]) {
    this._graph =
      graphType === "grid"
        ? this.graphFactory.createGrid(options as gridGraphOptions)
        : this.graphFactory.randomizedGraph(options as randomizedGraphOptions);
    this.mainView.reInit(this._graph)
    this.algorithm = new DijkstraAlgorithm(this._graph);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
  }

  constructor() {
    this._graph = this.graphFactory.createGrid({ width: 10, height: 10, entry: [0, 0], targets: [[9, 9]], gap: 55 });
    this.mainView = new DijkstraGraphView(this._graph);
    this.algorithm = new DijkstraAlgorithm(this._graph);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
    this.views = [this.mainView];
  }
}

export default DijkstraVisualization;
