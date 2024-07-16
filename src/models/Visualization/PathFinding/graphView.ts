import $ from "jquery";
import InfiniteCanvasView from "@models/View/InfiniteCanvasView";
import { Nullable } from "ts-wiz";
import PathFindingGraph from "@models/DataStructure/Graph/PathFinding";
import {
  IPathFindingGraphViewEventsMap,
  pathFindingDropdownMenuButtonType,
  PathFindingGraphVertex,
  pathFindingGraphVertexNodeType,
} from "../../../types/pathFindingGraph";
import PathfindingVisualizerDOMHelper from "../../../helpers/DOM/pathFindingVisualizer";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "../../../constants/DOM";

class DijkstraGraphView extends InfiniteCanvasView<unknown> {
  dataStructure: PathFindingGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  private _pathFindingEvents = new Map<keyof IPathFindingGraphViewEventsMap, Array<(data: any) => void>>();
  private _focusedVertex: Nullable<PathFindingGraphVertex> = null;

  private _setFocusedVertexAsEntryPoint() {
    if (!this.focusedVertex) throw new Error("");
  }

  private _renderVertexDropdownMenu() {
    $(`#${DOCUMENT_ID_CONSTANTS.VIEW.PATH_FINDING.TOOLTIP_CONTAINER}`).remove();
    if (this.focusedVertex === null) return;
    const infiniteCanvasRoot = $(`#${DOCUMENT_ID_CONSTANTS.VIEW.ROOT}`);
    const [x, y] = this.projectCoord(this.focusedVertex.data.x, this.focusedVertex.data.y);
    if (!x || !y) return;

    const focusedBtnIsATargetVertex = this.dataStructure.targets.find(v => v.id === this.focusedVertex!.id);
    const isEntryPoint = this.dataStructure.entry === this.focusedVertex

    const setAsEntryCB: pathFindingDropdownMenuButtonType = {
      label: "Set As Starting Point",
      callback: () => {
        this.dataStructure.entry = this.focusedVertex!;
        this.focusedVertex = null;
      },
    }; 

    const addToTargetCB: pathFindingDropdownMenuButtonType = {
      label: "Add As Target",
      callback: () => {
        this.dataStructure.addTarget(this.focusedVertex!);
        this.focusedVertex = null;
      },
    }; 

    const removeFromTargetCB: pathFindingDropdownMenuButtonType = {
      label: "Remove From Target List",
      callback: () => {
        this.dataStructure.removeTarget(this.focusedVertex!.id);
        this.focusedVertex = null;
      },
    }; 


    const targetBtn = focusedBtnIsATargetVertex ? removeFromTargetCB : addToTargetCB;
    const entryP = isEntryPoint ? [] : [setAsEntryCB] ;

    const buttons: Array<pathFindingDropdownMenuButtonType> = [...entryP, targetBtn];

    const tooltipElement = PathfindingVisualizerDOMHelper.createDropDownContainer(x, y, buttons);
    infiniteCanvasRoot.append(tooltipElement);
  }

  set focusedVertex(v: Nullable<PathFindingGraphVertex>) {
    this._focusedVertex = v;
    this._renderVertexDropdownMenu();
  }

  get focusedVertex() {
    return this._focusedVertex;
  }

  constructor(graph: PathFindingGraph) {
    super();
    this.dataStructure = graph;
  }

  onReady = () => {
    if (!this.documentRef) throw new Error("inconsistent state can't call onReady while document reference is invalid");
    this._initialRender();
    this._registerDataStructureEvents();
    this._registerDocumentEvents();
    this._registerDropdownMenus();
  };

  private _registerDropdownMenus() {
    this.onPathFinding("vertex-click", (e) => e.button === 2 && (this.focusedVertex = e.vertex));
    this.onInfiniteCanvas("zoom", () => this.focusedVertex && (this.focusedVertex = null));
  }

  private _registerDocumentEvents() {
    const rootSVGSelector = $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`);
    const verticesSelector = $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.VERTEX}`);
    rootSVGSelector.on("mousedown", (e) => this._pathFindingEvents.get("container-click")?.forEach((cb) => cb(e)));
    verticesSelector.on("mousedown", (e) => {
      const vertex = this.dataStructure.getVertexById(e.target.id);
      if (!vertex) throw new Error(`Vertex with ID ${e.target.id} not found.`);
      //@ts-ignore passing event as a reference
      const eventObject: IPathFindingGraphViewEventsMap["vertex-click"] = e;
      eventObject.vertex = vertex;
      this._pathFindingEvents.get("vertex-click")?.forEach((cb) => cb(eventObject));
    });
  }

  private _registerDataStructureEvents() {
    this.dataStructure.onPathFinding("visit", (v) => this._renderVisitEvent(v));
    this.dataStructure.onPathFinding("trace-to-source", (v) =>PathfindingVisualizerDOMHelper.renderTraceToSourceEvent(v));
    this.dataStructure.onPathFinding("entry-point-change", (v) =>PathfindingVisualizerDOMHelper.renderNewEntryPoint(v));
    this.dataStructure.onPathFinding("targets-update", (v) => PathfindingVisualizerDOMHelper.renderUpdatedTargets(v));
    this.dataStructure.onPathFinding("edge-change" , (e) => PathfindingVisualizerDOMHelper.updateEdge(e));
  }

  private _renderVisitEvent(v: PathFindingGraphVertex) {
    const isVertexATarget = this.dataStructure.targets.find((i) => i.id === v.id);
    if (isVertexATarget) return;
    PathfindingVisualizerDOMHelper.renderVisitEvent(v, this.dataStructure.currentTarget.id);
  }

  private _getVertexType = (vertex: PathFindingGraphVertex): pathFindingGraphVertexNodeType => {
    const isEntry = vertex === this.dataStructure.entry;
    const isATarget = vertex === this.dataStructure.targets.find((t) => t === vertex);
    if (isEntry) return "entry";
    if (isATarget) return "target";
    return "blank";
  };

  private _renderVertex(vertex: PathFindingGraphVertex) {
    const vertexType = this._getVertexType(vertex);
    PathfindingVisualizerDOMHelper.renderPathfindingVertex(vertex, vertexType);
  }

  private _initialRender() {
    for (const edge of this.dataStructure.EdgesIter()) PathfindingVisualizerDOMHelper.renderPathfindingEdge(edge);
    for (const vertex of this.dataStructure.iter()) this._renderVertex(vertex);
  }

  onPathFinding = <T extends keyof IPathFindingGraphViewEventsMap>(
    eventType: T,
    callback: (data: IPathFindingGraphViewEventsMap[T]) => void
  ) => {
    const events = this._pathFindingEvents.get(eventType) || [];
    this._pathFindingEvents.set(eventType, [...events, callback]);
  };
}

export default DijkstraGraphView;
