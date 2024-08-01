import DijkstraAlgorithm from "./Algorithms/dijkstra";
import DijkstraGraphView from "./graphView";
import RecursiveBacktracking from "@models/Visualization/Dijkstra/Algorithms/recursiveBacktracking";
import DijkstraGraph from "@models/DataStructure/Graph/Dijkstra";
import DijkstraGraphFactory from "@models/DataStructure/Graph/Dijkstra/factory";
import Heap from "@models/DataStructure/Heap";
import ExecutionPhase from "@models/ExecutionPhase";
import getWaiterFn from "@helpers/getWaiter";
import type { IAlgorithm } from "@_types/algorithm";
import type { IView } from "@_types/view";
import type { IVisualization, VisualizationSpeed } from "@_types/visualization";
import type { graphFactoryOptionMap, gridGraphOptions, randomizedGraphOptions } from "@_types/dataStructure/graph";
import type { dijkstraPQueue } from "@_types/context/dijkstra";

class DijkstraVisualization<T extends keyof graphFactoryOptionMap> implements IVisualization {
  private _graph: DijkstraGraph;
  private _heap: Heap<dijkstraPQueue>;
  private _status = ExecutionPhase.instance();
  private _isAlgorithmRunning = false;
  speed: VisualizationSpeed = "fast";
  graphFactory = new DijkstraGraphFactory();
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
    this._heap = new Heap((a, b) => a.cost - b.cost);
    this._graph =
      graphType === "grid"
        ? this.graphFactory.createGrid(options as gridGraphOptions)
        : this.graphFactory.randomizedGraph(options as randomizedGraphOptions);
    this.mainView.reInit(this._graph);
    this.algorithm = new DijkstraAlgorithm(this._graph, this._heap);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
  }

  constructor() {
    this._graph = this.graphFactory.createGrid({ width: 30, height: 30, entry: [0, 0], targets: [[9, 9]], gap: 55 });
    this._heap = new Heap((a, b) => a.cost - b.cost);
    this.mainView = new DijkstraGraphView(this._graph , this._heap);
    this.algorithm = new DijkstraAlgorithm(this._graph, this._heap);
    this.recursiveBacktrackingMazeGenerationAlgorithm = new RecursiveBacktracking(this._graph);
    this.views = [this.mainView];
  }
}

export default DijkstraVisualization;
