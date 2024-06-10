import type { Nullable , NoneToVoidFunction} from "ts-wiz";
import View from "../models/View";
type StageLayout = "layout-1" | "layout-2";

/**
 * @description a singleton object that gives DOM access to views
 */
interface IStage {
  documentRoot: HTMLDivElement;
  layout: StageLayout;
  fullScreenViewRef: Nullable<IView>;
  visualization: Nullable<IVisualization>;
  start: () => Promise<void>;
}

interface IStageLayoutStrategy {
  initLayout: (documentRef:HTMLDivElement , count:number) => Array<HTMLDivElement>;
}

interface IAlgorithm {
  iter: () => Promise<void>;
  performFastForward: Nullable<NoneToVoidFunction>;
}

interface IView<T> {
  documentRef: Nullable<HTMLDivElement>;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
  init: (documentRef:HTMLDivElement)=> void
}

interface IVisualization {
  algorithm: IAlgorithm;
  start: NoneToVoidFunction;
  views: Array<View<unknown>>;
}

/**
 * @description the common interface between all data structures
 * the iter should return a iterator object " [Symbol.iter] "
 */
interface IDataStructure<T> {
  size: number;
  iter: () => IterableIterator<T>;
}

//SECTION - Graph interface
type GraphIteratorTraverseStrategy = "DFS" | "BFS";
type GraphType = "directed" | "undirected"

interface IGraphVertex<VERTEX, EDGE> {
  label: string;
  data: VERTEX;
  neighbors: Array<IGraphEdge<VERTEX, EDGE>>;
}

interface IGraphEdge<VERTEX, EDGE> {
  data: EDGE;
  from: IGraphVertex<VERTEX, EDGE>;
  to: IGraphVertex<VERTEX, EDGE>;
}

interface IAlgorithmGraphEventsMap<VERTEX,EDGE>  {
    "add-vertex": IGraphVertex<VERTEX, EDGE>;
    "connect": IGraphEdge<VERTEX, EDGE>;
}

interface IGraph<VERTEX, EDGE> extends IDataStructure<IGraphVertex<VERTEX, EDGE>> {
  traverseStrategy: GraphIteratorTraverseStrategy;
  type : GraphType
  addVertex : (label:string,data:VERTEX) => IGraphVertex<VERTEX , EDGE>
  connect : (from: IGraphVertex<VERTEX,EDGE> , to:IGraphVertex<VERTEX,EDGE>,data:EDGE) => IGraphEdge<VERTEX, EDGE>;
}
//SECTION - Graph interface

