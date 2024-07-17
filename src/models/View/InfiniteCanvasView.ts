import * as D3 from "d3";
import $ from "jquery";
import View from ".";
import generateSnappedRange from "@utils/snappedValue";
import { grey } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";
import { DOCUMENT_ID_CONSTANTS } from "../../constants/DOM";
import {
  INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE,
  INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY,
  INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY,
  INFINITE_CANVAS_DEFAULT_RULER_WIDTH,
  INFINITE_CANVAS_SCALE_BOUNDARY,
  INFINITE_CANVAS_TRANSITION_BOUNDARY,
  infiniteCanvasScaleMapToRulerGap,
} from "../../constants/view";
import type { Nullable } from "ts-wiz";
import type { IInfiniteCanvasEventsMap, infiniteCanvasZoomType } from "../../types/view/infiniteCanvas";

abstract class InfiniteCanvasView<T> extends View<T> {
  private _rulerWidth: number = INFINITE_CANVAS_DEFAULT_RULER_WIDTH;
  private _rulerFontSize: number = INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE;
  private _showRuler: boolean = INFINITE_CANVAS_DEFAULT_RULER_VISIBILITY;
  private _showNav: boolean = INFINITE_CANVAS_DEFAULT_RULER_NAVIGATION_BUTTONS_VISIBILITY;
  private _zoom: Nullable<infiniteCanvasZoomType> = null;
  private _infiniteCanvasEvents = new Map<keyof IInfiniteCanvasEventsMap, Array<(data: any) => void>>();
  private _zoomBehavior: Nullable<D3.ZoomBehavior<Element, unknown>> = null;

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
    if (this._showRuler) this._initRulers();
    else {
      $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_RULER}`).remove();
      $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_RULER}`).remove();
    }
  }

  private set zoom(state: infiniteCanvasZoomType) {
    this._zoom = state;
    this.updateZoom(this._zoom);
    this._renderVerticalRuler(); // TODO move to events
    this._renderHorizontalRuler(); // TODO move to events
    this._infiniteCanvasEvents.get("zoom")?.forEach((cb) => cb(this._zoom));
  }

  private get zoom() {
    if (!this._zoom) throw new Error("can't read zoom value");
    return this._zoom;
  }

  private updateZoom(zoomEvent: infiniteCanvasZoomType) {
    D3.select("svg g").attr("transform", zoomEvent as any);
  }

  private _renderVerticalRuler() {
    if (!this._showRuler) return;
    const rulerElement = $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_RULER}`);
    if (rulerElement.length === 0) throw new Error("vertical ruler element does not exist in DOM.");
    const absoluteHeight = rulerElement.height()!;
    const fromVal = (this.zoom.y * -1) / this.zoom.k;
    const toValue = fromVal + absoluteHeight / this.zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this.zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(".infinite-canvas-vertical-tick").remove();

    rulerTickValues.forEach((el) => {
      const tickElement = $("<div></div>")
        .attr("class", "infinite-canvas-vertical-tick")
        .addClass("d-flex justify-content-around align-items-center")
        .css({
          position: "absolute",
          top: this.zoom.y + el * this.zoom.k - this._rulerFontSize,
          color: "grey",
          width: this._rulerWidth,
          fontSize: this._rulerFontSize,
        })
        .text(el);

      const tickLine = $("<div></div>").css({
        width: this._rulerWidth / 5,
        height: "1px",
        backgroundColor: grey["500"],
      });
      tickElement.append(tickLine);
      rulerElement.append(tickElement);
    });
  }

  private _renderHorizontalRuler() {
    if (!this._showRuler) return;
    const rulerElement = $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_RULER}`);
    if (rulerElement.length === 0) throw new Error("horizontal ruler element does not exist in DOM.");
    const absoluteWidth = rulerElement.width()!;
    const fromVal = (this.zoom.x * -1) / this.zoom.k;
    const toValue = fromVal + absoluteWidth / this.zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this.zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(".infinite-canvas-horizontal-tick").remove();

    rulerTickValues.forEach((el) => {
      const tickElement = $("<div></div>")
        .attr("class", "infinite-canvas-horizontal-tick")
        .addClass("d-flex flex-column justify-content-around align-items-center")
        .css({
          position: "absolute",
          left: this.zoom.x + el * this.zoom.k - this._rulerFontSize,
          color: "grey",
          width: this._rulerWidth,
          fontSize: this._rulerFontSize,
        })
        .text(el);

      const tickLine = $("<div></div>").css({
        height: this._rulerWidth / 5,
        width: "1px",
        backgroundColor: grey["500"],
      });
      tickElement.append(tickLine);
      rulerElement.append(tickElement);
    });
  }

  private _initVerticalRuler(docRef: JQuery<HTMLDivElement>) {
    if (!this._showRuler) return;
    const rulerElement = $("<div></div>").attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_RULER).css({
      position: "absolute",
      top: 0,
      left: 0,
      width: this._rulerWidth,
      height: "100%",
      overflow: "hidden",
      backgroundColor: "white",
      boxShadow: "2px 0px 3px rgba(0,0,0,.1)",
    });

    docRef.append(rulerElement);
  }
  private _initHorizontalRuler(docRef: JQuery<HTMLDivElement>) {
    if (!this._showRuler) return;
    const rulerElement = $("<div></div>").attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_RULER).css({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: this._rulerWidth,
      overflow: "hidden",
      backgroundColor: "white",
      boxShadow: "0px 2px 3px rgba(0,0,0,.1)",
    });

    docRef.append(rulerElement);
  }
  private _renderRulerCap(docRef: JQuery<HTMLDivElement>) {
    if (!this._showRuler) return;
    const element = $("<div></div>").attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP).css({
      position: "absolute",
      top: 0,
      left: 0,
      width: this._rulerWidth,
      height: this._rulerWidth,
      overflow: "hidden",
      backgroundColor: "white",
      border: "solid 1px grey",
      borderLeft: "none",
      borderTop: "none",
    });

    docRef.append(element);
  }

  private _initRulers() {
    if (!this.documentRef) throw new Error(`can't init ruler element is not valid got : ${this.documentRef}`);
    const JQDocumentRef = $(this.documentRef);
    JQDocumentRef.css("position", "relative");
    this._initVerticalRuler(JQDocumentRef);
    this._initHorizontalRuler(JQDocumentRef);
    this._renderRulerCap(JQDocumentRef);
  }

  private _initInfiniteCanvas() {
    if (!this.documentRef) throw new Error(`unexpected documentRef value got ${this.documentRef} expected HTMLElement`);
    this.documentRef.oncontextmenu = (e) => e.preventDefault();
    D3.select(this.documentRef)
      .append("svg")
      .attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT)
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g");
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

  protected projectCoord(x: number, y: number) {
    if (!this._zoom) return [];
    return [this._zoom.x + x * this._zoom.k, this._zoom.y + y * this._zoom.k];
  }

  private _zoomBy(value: number) {
    D3.select("svg")
      .transition()
      .call((selection: D3.Transition<any, any, any, any>) => selection.call(this._zoomBehavior!.scaleBy, value));
  }

  public translateTo(x: number, y: number) {
    D3.select("svg")
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
    this._initInfiniteCanvas();
    this._initRulers();
    this._initNavigationButtons();
    this.onReady?.();
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
