import type { Nullable , NoneToVoidFunction} from "ts-wiz";
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

interface IAlgorithm {
  iter: () => Promise<void>;
  performFastForward: Nullable<NoneToVoidFunction>;
}

interface IView<T> {
  documentRef: HTMLDivElement;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
}

interface IVisualization {
  algorithm: IAlgorithm;
  // a list of data-structures
  // a list of views
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

