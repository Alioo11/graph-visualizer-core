import * as D3 from "d3";
import $ from "jquery";
import InfiniteCanvasView from "@models/View/InfiniteCanvasView";
import generateSnappedRange from "@utils/snappedValue";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "@constants/DOM";
import {
  INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE,
  INFINITE_CANVAS_DEFAULT_RULER_WIDTH,
  INFINITE_CANVAS_GRID_LAYER_Z_INDEX,
  INFINITE_CANVAS_RULER_LAYER_Z_INDEX,
  infiniteCanvasScaleMapToRulerGap,
} from "@constants/view";
import { grey } from "@mui/material/colors";

class InfiniteCanvasViewDOMHelper {
  private _rulerWidth: number = INFINITE_CANVAS_DEFAULT_RULER_WIDTH;
  private _rulerFontSize: number = INFINITE_CANVAS_DEFAULT_RULER_FONT_SIZE;
  private _view: InfiniteCanvasView<unknown>;

  constructor(infiniteCanvasView: InfiniteCanvasView<unknown>) {
    this._view = infiniteCanvasView;
  }

  renderVerticalRuler() {
    const D3HorizontalRulerSelection = D3.select(
      `#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.VERTICAL}`
    ) as D3.Selection<SVGRectElement, unknown, HTMLElement, any>;
    const D3LayerSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT} g`);

    if(!D3HorizontalRulerSelection) return;

    //@ts-ignore;
    const absoluteHeight = D3HorizontalRulerSelection.node().height.baseVal.value as number;

    const fromVal = (this._view._zoom.y * -1) / this._view._zoom.k;
    const toValue = fromVal + absoluteHeight / this._view._zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this._view._zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_VERTICAL_TICK}`).remove();

    rulerTickValues.forEach((tick) => {
      const [_, yOffset] = this._view.projectCoord(0, tick);
      D3LayerSelection.append("text")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_VERTICAL_TICK)
        .attr("x", 0)
        .attr("y", yOffset + this._rulerFontSize / 4)
        .attr("font-size", this._rulerFontSize)
        .attr("fill", grey["900"])
        .text(tick);

        
      D3LayerSelection.append("line")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_VERTICAL_TICK)
        .attr("x1", this._rulerWidth - 10)
        .attr("y1", yOffset)
        .attr("x2", this._rulerWidth)
        .attr("y2", yOffset)
        .attr("stroke", grey["900"])
        .attr("stroke-width", 0.5);
    });
  }

  renderHorizontalRuler() {
    const D3HorizontalRulerSelection = D3.select(
      `#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.HORIZONTAL}`
    ) as D3.Selection<SVGRectElement, unknown, HTMLElement, any>;
    const D3LayerSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT} g`);

    if (!D3HorizontalRulerSelection) return;

    //@ts-ignore;
    const absoluteWidth = D3HorizontalRulerSelection.node().width.baseVal.value as number;

    const fromVal = (this._view._zoom.x * -1) / this._view._zoom.k;
    const toValue = fromVal + absoluteWidth / this._view._zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this._view._zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_HORIZONTAL_TICK}`).remove();

    rulerTickValues.forEach((tick) => {
      const tickCharLength = tick.toString().length;
      const [xOffset] = this._view.projectCoord(tick, 0);
      D3LayerSelection.append("text")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_HORIZONTAL_TICK)
        .attr("x", xOffset - (this._rulerFontSize / 3) * tickCharLength)
        .attr("y", 15)
        .attr("font-size", this._rulerFontSize)
        .attr("fill", grey["900"])
        .text(tick);

      D3LayerSelection.append("line")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_HORIZONTAL_TICK)
        .attr("x1", xOffset)
        .attr("y1", this._rulerWidth - 10)
        .attr("x2", this._view._zoom.x + tick * this._view._zoom.k)
        .attr("y2", this._rulerWidth)
        .attr("stroke", grey["900"])
        .attr("stroke-width", 0.5);
    });
  }

  createLayer(documentId: string, zIndex: number, passive: boolean = false) {
    if (!this._view.documentRef)
      throw new Error(`unexpected documentRef value got ${this._view.documentRef} expected HTMLElement`);
    const D3LayerSelection = D3.select(this._view.documentRef)
      .append("svg")
      .attr("id", documentId)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("z-index", zIndex)
      .style("position", "absolute");

    passive && D3LayerSelection.style("pointer-events", "none");

    return D3LayerSelection;
  }

  removeLayer(documentId: string) {
    D3.select(`#${documentId}`).remove();
  }

  initVerticalRuler() {
    const D3LayerSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT} g`);
    D3LayerSelection.append("rect")
      .attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.VERTICAL)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this._rulerWidth)
      .attr("height", "100%")
      .attr("fill", grey["100"])
      .attr("boxShadow", "0px 2px 3px rgba(0,0,0,.1)");
  }

  initHorizontalRuler() {
    const D3LayerSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT} g`);
    D3LayerSelection.append("rect")
      .attr("id", DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.HORIZONTAL)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", this._rulerWidth)
      .attr("fill", grey["100"])
      .attr("boxShadow", "0px 2px 3px rgba(0,0,0,.1)");
  }

  renderRulerCap() {
    const D3LayerSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT} g`);

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP}`).remove();

    D3LayerSelection.append("rect")
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this._rulerWidth)
      .attr("height", this._rulerWidth)
      .attr("fill", grey["100"]);

    D3LayerSelection.append("line")
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP)
      .attr("x1", this._rulerWidth)
      .attr("y1", 0)
      .attr("x2", this._rulerWidth)
      .attr("y2", this._rulerWidth)
      .attr("stroke", grey["800"]);

    D3LayerSelection.append("line")
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP)
      .attr("x1", 0)
      .attr("y1", this._rulerWidth)
      .attr("x2", this._rulerWidth)
      .attr("y2", this._rulerWidth)
      .attr("stroke", grey["800"]);
  }

  renderRulers() {
    this.renderHorizontalRuler();
    this.renderVerticalRuler();
    this.renderRulerCap();
  }

  initRulers() {
    const D3LayerSelection = this.createLayer(
      DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.ROOT,
      INFINITE_CANVAS_RULER_LAYER_Z_INDEX,
      true
    );

    D3LayerSelection.append("g");
    this.initVerticalRuler();
    this.initHorizontalRuler();
    this.renderRulers();
  }

  renderVerticalGrid() {
    const D3GridSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.GRID.ROOT}`);

    if(!D3GridSelection) return;

    //@ts-ignore
    const absoluteHeight = D3GridSelection.node().height.baseVal.value as number;
    //@ts-ignore
    const absoluteWidth = D3GridSelection.node().width.baseVal.value as number;

    const fromVal = (this._view._zoom.y * -1) / this._view._zoom.k;
    const toValue = fromVal + absoluteHeight / this._view._zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this._view._zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_GRID}`).remove();
    rulerTickValues.forEach((tick) => {
      const [_, yOffset] = this._view.projectCoord(0, tick);
      D3GridSelection.append("line")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_GRID)
        .attr("x1", 0)
        .attr("y1", yOffset)
        .attr("x2", absoluteWidth)
        .attr("y2", yOffset)
        .attr("stroke", grey["200"]);
    });
  }


  renderHorizontalGrid() {
    const D3GridSelection = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.GRID.ROOT}`);

    if (!D3GridSelection) return;

    //@ts-ignore
    const absoluteHeight = D3GridSelection.node().height.baseVal.value as number;
    //@ts-ignore
    const absoluteWidth = D3GridSelection.node().width.baseVal.value as number;

    const fromVal = (this._view._zoom.x * -1) / this._view._zoom.k;
    const toValue = fromVal + absoluteWidth / this._view._zoom.k;
    const rulerGap = infiniteCanvasScaleMapToRulerGap(this._view._zoom.k)!;
    const rulerTickValues = generateSnappedRange(fromVal, toValue, rulerGap);

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_GRID}`).remove();

    rulerTickValues.forEach((tick) => {
      const [xOffset] = this._view.projectCoord(tick , 0);
      D3GridSelection.append("line")
        .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_GRID)
        .attr("x1", xOffset)
        .attr("y1", 0)
        .attr("x2", xOffset)
        .attr("y2", absoluteHeight)
        .attr("stroke", grey["200"]);
    });
  }

  renderGrid() {
    this.renderVerticalGrid();
    this.renderHorizontalGrid();
  }

  initGrid() {
    const D3LayerSelection = this.createLayer(
      DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.GRID.ROOT,
      INFINITE_CANVAS_GRID_LAYER_Z_INDEX,
      true
    );

    this.renderGrid();
  }

  removeGrid() {
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.VERTICAL_GRID}`).remove();
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.HORIZONTAL_GRID}`).remove();
  }

  removeRuler() {
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_CAP}`).remove();
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_HORIZONTAL_TICK}`).remove();
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.INFINITE_CANVAS.RULER_VERTICAL_TICK}`).remove();
    $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.VERTICAL}`).remove();
    $(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.RULER.HORIZONTAL}`).remove();
  }
}

export default InfiniteCanvasViewDOMHelper;
