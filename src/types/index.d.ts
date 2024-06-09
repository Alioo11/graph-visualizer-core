import type { Nullable , NoneToVoidFunction} from "ts-wiz";
type StageLayout = "layout-1" | "layout-2";

/**
 * @description a singleton object that gives DOM access to views
 */
interface Stage {
  documentRoot: HTMLDivElement;
  layout: StageLayout;
  fullScreenViewRef: Nullable<View>;
  visualization: Nullable<Visualization>;
  start: () => Promise<void>;
}

interface Algorithm {
  iter: () => Promise<void>;
  performFastForward: Nullable<NoneToVoidFunction>;
}

interface View {
  documentRef: HTMLDivElement;
  visible: boolean;
  dataStructure: DataStructure;
  toggleVisible: NoneToVoidFunction;
}

interface Visualization {
  algorithm: Algorithm;
  // a list of data-structures
  // a list of views
}

/**
 * @description the common interface between all data structures
 * the iter should return a iterator object " [Symbol.iter] "
 */
interface DataStructure<T> {
  size: number;
  iter: () => IterableIterator<T>;
}

//SECTION - Graph interface
type GraphIteratorTraverseStrategy = "DFS" | "BFS";
type GraphType = "directed" | "undirected"

interface GraphVertex<VERTEX, EDGE> {
  label: string;
  data: VERTEX;
  neighbors: Array<GraphEdge<VERTEX, EDGE>>;
}

interface GraphEdge<VERTEX, EDGE> {
  data: EDGE;
  from: GraphVertex<VERTEX, EDGE>;
  to: GraphVertex<VERTEX, EDGE>;
}

interface GraphEventsMap<VERTEX,EDGE>  {
    "add-vertex": GraphVertex<VERTEX, EDGE>;
    "connect": GraphEdge<VERTEX, EDGE>;
}

interface Graph<VERTEX, EDGE> extends DataStructure<GraphVertex<VERTEX, EDGE>> {
  traverseStrategy: GraphIteratorTraverseStrategy;
  type : GraphType
  addVertex : (data:VERTEX) => GraphVertex<VERTEX , EDGE>
  connect : (from: GraphVertex<VERTEX,EDGE> , to:GraphVertex<VERTEX,EDGE>) => void;
  on:<T extends keyof GraphEventsMap<VERTEX,EDGE>>(eventType:T,callback: (data:GraphEventsMap<VERTEX,EDGE>[T]) => void)=> {}
}
//SECTION - Graph interface

