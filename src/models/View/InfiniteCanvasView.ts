import * as D3 from "d3";
import $ from "jquery";
import View from ".";
import shadows from "@mui/material/styles/shadows";
import InfiniteCanvasViewDOMHelper from "@helpers/DOM/infiniteCanvasView";
import { DOCUMENT_ID_CONSTANTS } from "@constants/DOM";
import {
  DEFAULT_ZOOM,
  INFINITE_CANVAS_CONTENT_LAYER_Z_INDEX,
  INFINITE_CANVAS_DEFAULT_GRID_VISIBILITY,
  INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY,
  INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY,
  INFINITE_CANVAS_SCALE_BOUNDARY,
  INFINITE_CANVAS_TOOLTIP,
  INFINITE_CANVAS_TRANSITION_BOUNDARY,
} from "@constants/view";
import type { Nullable } from "ts-wiz";
import type { IInfiniteCanvasEventsMap, infiniteCanvasZoomType } from "@_types/view/infiniteCanvas";

abstract class InfiniteCanvasView<T> extends View<T> {
  private _showRuler: boolean = INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY;
  private _showNav: boolean = INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY;
  private _showGrid: boolean = INFINITE_CANVAS_DEFAULT_GRID_VISIBILITY;
  private _infiniteCanvasEvents = new Map<keyof IInfiniteCanvasEventsMap, Array<(data: any) => void>>();
  private _zoomBehavior: Nullable<D3.ZoomBehavior<Element, unknown>> = null;
  private DOMHelper:InfiniteCanvasViewDOMHelper;
  _zoom = DEFAULT_ZOOM;

  constructor(){
    super();
    this.DOMHelper = new InfiniteCanvasViewDOMHelper(this);
  }

  get showGrid(){
    return this._showGrid;
  }

  set showGrid(show:boolean){
    this._showGrid = show;
    if (this._showGrid) this.DOMHelper.renderGrid();
    else this.DOMHelper.removeGrid();
  }

  get showNav() {
    return this._showNav;
  }

  set showNav(newValue: boolean) {
    this._showNav = newValue;
  }

  get showRuler() {
    return this._showRuler;
  }

  set showRuler(newValue: boolean) {
    this._showRuler = newValue;
    if (this._showRuler && this.documentRef) {
      this.DOMHelper.initRulers();
      this.DOMHelper.renderRulers();
    } else this.DOMHelper.removeRuler();
  }

  private set zoom(state: infiniteCanvasZoomType) {
    this._zoom = state;
    this.updateZoom(this._zoom);
    if(this.showGrid) this.DOMHelper.renderGrid();
    if (this.showRuler)  this.DOMHelper.renderRulers();

    this._infiniteCanvasEvents.get("zoom")?.forEach((cb) => cb(this._zoom));
  }

  private get zoom() {
    if (!this._zoom) throw new Error("can't read zoom value");
    return this._zoom;
  }

  private updateZoom(zoomEvent: infiniteCanvasZoomType) {
    D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`).attr("transform", zoomEvent as any);
  }

  private _initInfiniteCanvas() {
    const layer = this.DOMHelper.createLayer(
      DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT,
      INFINITE_CANVAS_CONTENT_LAYER_Z_INDEX
    );
    layer.append("g");
    layer.on("contextmenu", (e)=>e.preventDefault());
    this._zoomBehavior = D3.zoom()
      .scaleExtent(INFINITE_CANVAS_SCALE_BOUNDARY)
      .translateExtent(INFINITE_CANVAS_TRANSITION_BOUNDARY)
      .on("zoom", (event: D3.D3ZoomEvent<SVGElement, unknown>) => {
        this.zoom = event.transform;
      });
    const applyZoom = (selection: D3.Selection<any, any, any, any>) => selection.call(this._zoomBehavior!);
    D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`).call(applyZoom);
  }

  private _initNavigationButtons() {
    if (!this.documentRef) throw new Error();
    const docRef = $(this.documentRef);
    docRef.css("position", "relative");

    const navButtonContainer = $("<div></div>").css({
      borderRadius: 8,
      boxShadow: shadows[5],
      position: "absolute",
      bottom: 10,
      left: 50,
      zIndex:INFINITE_CANVAS_TOOLTIP,
      backgroundColor: "white",
    });

    const zoomInBtn = $("<button></button>").addClass("btn").text("+");
    const zoomOutBtn = $("<button></button>").addClass("btn").text("-");
    const reCenterBtn = $("<button></button>")
      .addClass("btn")
      .append('<box-icon class="pt-2" size="sm" name="current-location"></box-icon>');

    zoomInBtn.on("click", () => this.zoomIn());
    zoomOutBtn.on("click", () => this.zoomOut());
    reCenterBtn.on("click", () => this.translateTo(0, 0));

    navButtonContainer.append(zoomInBtn);
    navButtonContainer.append(zoomOutBtn);
    navButtonContainer.append(reCenterBtn);

    docRef.append(navButtonContainer);
  }

  projectCoord(x: number, y: number) {
    if (!this._zoom) return [];
    return [this._zoom.x + x * this._zoom.k, this._zoom.y + y * this._zoom.k];
  }

  private _zoomBy(value: number) {
    D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`)
      .transition()
      .call((selection: D3.Transition<any, any, any, any>) => selection.call(this._zoomBehavior!.scaleBy, value));
  }

  public translateTo(x: number, y: number) {
    D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`)
      .transition()
      .duration(2000)
      .call((selection: D3.Transition<any, any, any, any>) => selection.call(this._zoomBehavior!.translateTo, x, y));
  }

  public zoomIn() {
    this._zoomBy(2);
  }

  public zoomOut() {
    this._zoomBy(0.5);
  }
  public init = (rootHTMLElement: HTMLDivElement) => {
    this.createWrapperElement(rootHTMLElement);
    if (!this.documentRef) throw new Error("infinite canvas document ref is not initialized");
    $(this.documentRef).css("position", "relative");
    this._initInfiniteCanvas();
    this.DOMHelper.initRulers();
    this.DOMHelper.initGrid();
    this._initNavigationButtons();
    this.onReady?.();
    this._events.get("ready")?.forEach((cb) => cb(this.documentRef));
  };

  public onInfiniteCanvas = <T extends keyof IInfiniteCanvasEventsMap>(
    eventType: T,
    callback: (data: IInfiniteCanvasEventsMap[T]) => void
  ) => {
    const events = this._infiniteCanvasEvents.get(eventType) || [];
    this._infiniteCanvasEvents.set(eventType, [...events, callback]);
  };
}

export default InfiniteCanvasView;
