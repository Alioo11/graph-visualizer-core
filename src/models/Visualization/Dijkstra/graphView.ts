import $ from "jquery";
import D3 from 'd3';
import InfiniteCanvasView from "@models/View/InfiniteCanvasView";
import DijkstraGraph from "@models/DataStructure/Graph/Dijkstra";
import ExecutionPhase from "@models/ExecutionPhase";
import DijkstraVisualizerDOMHelper from "@helpers/DOM/dijkstraVisualizer";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "@constants/DOM";
import type { Nullable } from "ts-wiz";
import type {
  IDijkstraGraphViewEventsMap,
  DijkstraDropdownMenuButtonType,
  DijkstraGraphVertex,
  DijkstraGraphVertexNodeType,
  dijkstraPQueue,
} from "@_types/context/dijkstra";
import Heap from "@models/DataStructure/Heap";

class DijkstraGraphView extends InfiniteCanvasView<unknown, IDijkstraGraphViewEventsMap> {
  dataStructure: DijkstraGraph;
  heap: Heap<dijkstraPQueue>;
  documentRef: Nullable<HTMLDivElement> = null;
  private _focusedVertex: Nullable<DijkstraGraphVertex> = null;
  private DijkstraDOMHelper: DijkstraVisualizerDOMHelper;

  private _renderVertexDropdownMenu() {
    $(`#${DOCUMENT_ID_CONSTANTS.VIEW.PATH_FINDING.TOOLTIP_CONTAINER}`).remove();
    if (this.focusedVertex === null) return;
    const infiniteCanvasRoot = $(`#${this.documentRootId}`);
    const [x, y] = this.projectCoord(this.focusedVertex.data.x, this.focusedVertex.data.y);
    if (!x || !y) return;

    const focusedBtnIsATargetVertex = this.dataStructure.targets.find((v) => v.id === this.focusedVertex!.id);
    const isEntryPoint = this.dataStructure.entry === this.focusedVertex;

    const setAsEntryCB: DijkstraDropdownMenuButtonType = {
      label: "Set As Starting Point",
      callback: () => {
        this.dataStructure.entry = this.focusedVertex!;
        this.focusedVertex = null;
      },
    };

    const addToTargetCB: DijkstraDropdownMenuButtonType = {
      label: "Add As Target",
      callback: () => {
        this.dataStructure.addTarget(this.focusedVertex!);
        this.focusedVertex = null;
      },
    };

    const removeFromTargetCB: DijkstraDropdownMenuButtonType = {
      label: "Remove From Target List",
      callback: () => {
        this.dataStructure.removeTarget(this.focusedVertex!.id);
        this.focusedVertex = null;
      },
    };

    const targetBtn = focusedBtnIsATargetVertex ? removeFromTargetCB : addToTargetCB;
    const entryP = isEntryPoint ? [] : [setAsEntryCB];

    const buttons: Array<DijkstraDropdownMenuButtonType> = [...entryP, targetBtn];

    const tooltipElement = this.DijkstraDOMHelper.createDropDownContainer(x, y, buttons);
    infiniteCanvasRoot.append(tooltipElement);
  }

  set focusedVertex(v: Nullable<DijkstraGraphVertex>) {
    this._focusedVertex = v;
    this._renderVertexDropdownMenu();
  }

  get focusedVertex() {
    return this._focusedVertex;
  }

  constructor(graph: DijkstraGraph, heap: Heap<dijkstraPQueue>) {
    super();
    this.dataStructure = graph;
    this.heap = heap;
    this.DijkstraDOMHelper = new DijkstraVisualizerDOMHelper(this);
  }

  onReady = () => {
    this.initialize();
  };

  reInit(graph: DijkstraGraph) {
    if (!this.documentRef) throw new Error("inconsistent state can't call reInit while document reference is invalid");
    this.dataStructure = graph;
    this.DijkstraDOMHelper = new DijkstraVisualizerDOMHelper(this);
    this.initialize();
    ExecutionPhase.instance().update("prepared");
  }

  initialize() {
    if (!this.documentRef) throw new Error("inconsistent state can't call onReady while document reference is invalid");
    $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`).children().remove();
    this._initialRender();
    this._registerDataStructureEvents();
    this._registerDocumentEvents();
    this._registerDropdownMenus();
  }

  private _registerDropdownMenus() {
    this.on("vertex-click", (e) => e.button === 2 && (this.focusedVertex = e.vertex));
    this.on("zoom", () => this.focusedVertex && (this.focusedVertex = null));
  }

  private _triggerVertexEvent = (event:JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
    const vertex = this.dataStructure.getVertexById(event.target.id);
    if (!vertex) throw new Error(`Vertex with ID ${event.target.id} not found.`);
    //@ts-ignore passing event as a reference
    const eventObject: IDijkstraGraphViewEventsMap["vertex-click"] = event;
    eventObject.vertex = vertex;
    this._events.emit("vertex-click", eventObject);
  }

  private _triggerEdgeEvent = (event:JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
    const edge = this.dataStructure.getEdgeById(event.target.id);
    if (!edge) throw new Error(`Edge with ID ${event.target.id} not found.`);
    //@ts-ignore passing event as a reference
    const eventObject: IDijkstraGraphViewEventsMap["edge-click"] = event;
    eventObject.edge = edge;
    this._events.emit("edge-click", eventObject);
  }

  private _registerDocumentEvents() {
    const rootSVGSelector = $(`#${this.documentRootId} #${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`)
    //@ts-ignore
    rootSVGSelector.on("mousedown", (e: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
      const isClickOnAVertex = e.target.classList.contains(DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.VERTEX);
      const isClickOnAEdge = e.target.classList.contains(DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.EDGE);
      if(isClickOnAVertex) return this._triggerVertexEvent(e);
      if(isClickOnAEdge) return this._triggerEdgeEvent(e);
      this._events.emit("container-click" , e);
    });
  }

  private _registerDataStructureEvents() {
    this.dataStructure.onDijkstra("visit", (v) => this._renderVisitEvent(v));
    this.dataStructure.onDijkstra("trace-to-source", (v) => this.DijkstraDOMHelper.renderTraceToSourceEvent(v));
    this.dataStructure.onDijkstra("entry-point-change", (v) => this.DijkstraDOMHelper.renderNewEntryPoint(v));
    this.dataStructure.onDijkstra("targets-update", (v) => this.DijkstraDOMHelper.renderUpdatedTargets(v));
    this.dataStructure.onDijkstra("edge-change", (e) => this.DijkstraDOMHelper.updateEdge(e));
    this.heap.on("push", (e) => this.DijkstraDOMHelper.pushToHeap(e[0].vertex));
  }

  private _renderVisitEvent(v: DijkstraGraphVertex) {
    const isVertexATarget = this.dataStructure.targets.find((i) => i.id === v.id);
    if (isVertexATarget) return;
    this.DijkstraDOMHelper.renderVisitEvent(v, this.dataStructure.currentTarget.id);
  }

  private _getVertexType = (vertex: DijkstraGraphVertex): DijkstraGraphVertexNodeType => {
    const isEntry = vertex === this.dataStructure.entry;
    const isATarget = vertex === this.dataStructure.targets.find((t) => t === vertex);
    if (isEntry) return "entry";
    if (isATarget) return "target";
    return "blank";
  };

  private _renderVertex(vertex: DijkstraGraphVertex) {
    const vertexType = this._getVertexType(vertex);
    this.DijkstraDOMHelper.renderDijkstraVertex(vertex, vertexType);
  }

  private _initialRender() {
    for (const edge of this.dataStructure.EdgesIter()) this.DijkstraDOMHelper.renderDijkstraEdge(edge);
    for (const vertex of this.dataStructure.iter()) this._renderVertex(vertex);
  }
}

export default DijkstraGraphView;
