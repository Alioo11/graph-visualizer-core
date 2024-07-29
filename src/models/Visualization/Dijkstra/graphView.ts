import $ from "jquery";
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
} from "@_types/context/dijkstra";

class DijkstraGraphView extends InfiniteCanvasView<unknown> {
  dataStructure: DijkstraGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  private _dijkstraEvents = new Map<keyof IDijkstraGraphViewEventsMap, Array<(data: any) => void>>();
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

  constructor(graph: DijkstraGraph) {
    super();
    this.dataStructure = graph;
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
    this.onDijkstra("vertex-click", (e) => e.button === 2 && (this.focusedVertex = e.vertex));
    this.onInfiniteCanvas("zoom", () => this.focusedVertex && (this.focusedVertex = null));
  }

  private _registerVertexDocumentEvents() {
    const verticesSelector = $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.VERTEX}`);

    verticesSelector.on("mousedown", (e) => {
      const vertex = this.dataStructure.getVertexById(e.target.id);
      if (!vertex) throw new Error(`Vertex with ID ${e.target.id} not found.`);
      //@ts-ignore passing event as a reference
      const eventObject: IDijkstraGraphViewEventsMap["vertex-click"] = e;
      eventObject.vertex = vertex;
      this._dijkstraEvents.get("vertex-click")?.forEach((cb) => cb(eventObject));
    });
  }

  private _registerEdgeDocumentEvents() {
    const edgeSelector = $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.EDGE}`);

    edgeSelector.on("mousedown", (e) => {
      const edge = this.dataStructure.getEdgeById(e.target.id);
      if (!edge) throw new Error(`Edge with ID ${e.target.id} not found.`);
      //@ts-ignore passing event as a reference
      const eventObject: IDijkstraGraphViewEventsMap["edge-click"] = e;
      eventObject.edge = edge;
      this._dijkstraEvents.get("edge-click")?.forEach((cb) => cb(eventObject));
    });
  }

  private _registerDocumentEvents() {
    const rootSVGSelector = $(`#${this.documentRootId} #${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`);
    rootSVGSelector.on("click", (e) => this._dijkstraEvents.get("container-click")?.forEach((cb) => cb(e)));
    this._registerVertexDocumentEvents();
    this._registerEdgeDocumentEvents();
  }

  private _registerDataStructureEvents() {
    this.dataStructure.onDijkstra("visit", (v) => this._renderVisitEvent(v));
    this.dataStructure.onDijkstra("trace-to-source", (v) => this.DijkstraDOMHelper.renderTraceToSourceEvent(v));
    this.dataStructure.onDijkstra("entry-point-change", (v) => this.DijkstraDOMHelper.renderNewEntryPoint(v));
    this.dataStructure.onDijkstra("targets-update", (v) => this.DijkstraDOMHelper.renderUpdatedTargets(v));
    this.dataStructure.onDijkstra("edge-change", (e) => this.DijkstraDOMHelper.updateEdge(e));
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

  onDijkstra = <T extends keyof IDijkstraGraphViewEventsMap>(
    eventType: T,
    callback: (data: IDijkstraGraphViewEventsMap[T]) => void
  ) => {
    const events = this._dijkstraEvents.get(eventType) || [];
    this._dijkstraEvents.set(eventType, [...events, callback]);
  };
}

export default DijkstraGraphView;
