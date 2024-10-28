import * as D3 from "d3";
import $ from "jquery";
import { infiniteCanvasZoomType } from "@_types/view/infiniteCanvas";
import type CityView from "@models/Visualization/City/view";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "@constants/DOM";
import { tensorFieldScaleMapToFieldsCount, tensorFieldScaleMapToFieldsLength } from "@constants/view";
import generateSnappedRange from "@utils/snappedValue";
import ColorHelper from "@helpers/color";
import { IGraphEdge } from "@_types/dataStructure/graph";
import { ICityRoadGraphEdge, ICityRoadGraphVertex } from "@_types/context/city";
import { grey, yellow } from "@mui/material/colors";

function radiansToArcLength(radian: number): number {
  return radian * (180 / Math.PI);
}

class CityVisualizerDOMHelper {
  cityView: CityView;

  get D3InfiniteCanvasRootSelection() {
    return D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT}`) as D3.Selection<
      SVGRectElement,
      unknown,
      HTMLElement,
      any
    >;
  }

  get D3InfiniteCanvasGSelection() {
    return D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`) as D3.Selection<
      SVGRectElement,
      unknown,
      HTMLElement,
      any
    >;
  }

  get viewWidth() {
    //@ts-ignore
    return this.D3InfiniteCanvasRootSelection.node().width.baseVal.value as number;
  }

  get viewHeight() {
    //@ts-ignore
    return this.D3InfiniteCanvasRootSelection.node().height.baseVal.value as number;
  }

  constructor(cityView: CityView) {
    this.cityView = cityView;
  }

  removeTensorFields() {
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE}`).remove();
  }

  private _renderTensorField(event: infiniteCanvasZoomType) {
    if (!this.D3InfiniteCanvasRootSelection) return;

    const [width, height] = [this.viewWidth, this.viewHeight];
    const rulerGap = tensorFieldScaleMapToFieldsCount(event.k)!;
    const [length, strokeWidth] = tensorFieldScaleMapToFieldsLength(event.k)!;

    /** HORIZONTAl */
    const HorizontalFromVal = (event.x * -1) / event.k;
    const HorizontalToValue = HorizontalFromVal + width / event.k;
    const HorizontalRulerTickValues = generateSnappedRange(HorizontalFromVal, HorizontalToValue, rulerGap);

    /** VERTICAL */
    const VerticalFromVal = (event.y * -1) / event.k;
    const VerticalToValue = VerticalFromVal + height / event.k;
    const VerticalRulerTickValues = generateSnappedRange(VerticalFromVal, VerticalToValue, rulerGap);

    /** remove the rendered fields from the  */
    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE}`).remove();

    for (let i = 0; i < HorizontalRulerTickValues.length; i++) {
      for (let j = 0; j < VerticalRulerTickValues.length; j++) {
        const coordinate = { x: HorizontalRulerTickValues[i], y: VerticalRulerTickValues[j] };
        const angle = this.cityView.field.get(coordinate) - Math.PI / 2;

        this.D3InfiniteCanvasGSelection.append("svg:image")
          .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE)
          .attr("href", "assets/arrow.svg")
          .attr("width", 20 / this.cityView._zoom.k)
          .attr("height", 20 / this.cityView._zoom.k)
          .attr("x", coordinate.x)
          .attr("y", coordinate.y)
          .attr("transform", `rotate(${radiansToArcLength(angle)} ${coordinate.x} ${coordinate.y})`);

      }
    }
  }

  private _renderTensorFieldCenters(event: infiniteCanvasZoomType) {}

  private _renderMajorEdge(edge: IGraphEdge<ICityRoadGraphVertex, ICityRoadGraphEdge>) {
    const { x: x1, y: y1 } = edge.from.data;
    const { x: x2, y: y2 } = edge.to.data;
    const t = D3.transition();

    this.D3InfiniteCanvasGSelection.append("line")
      .attr("x1", x1)
      .attr("x2", x1)
      .attr("y1", y1)
      .attr("y2", y1)
      .attr("stroke", yellow["400"])
      .attr("stroke-width", 9)
      .transition(t)
      .attr("x2", x2)
      .attr("y2", y2);
  }

  private _renderMinorEdge(edge: IGraphEdge<ICityRoadGraphVertex, ICityRoadGraphEdge>) {
    const { x: x1, y: y1 } = edge.from.data;
    const { x: x2, y: y2 } = edge.to.data;
    const t = D3.transition();

    this.D3InfiniteCanvasGSelection.append("line")
      .attr("x1", x1)
      .attr("x2", x1)
      .attr("y1", y1)
      .attr("y2", y1)
      .attr("stroke", grey["300"])
      .attr("stroke-width", 3)
      .transition(t)
      .attr("x2", x2)
      .attr("y2", y2);
  }

  private _renderLocalEdge(edge: IGraphEdge<ICityRoadGraphVertex, ICityRoadGraphEdge>) {
    const { x: x1, y: y1 } = edge.from.data;
    const { x: x2, y: y2 } = edge.to.data;
    const t = D3.transition();

    this.D3InfiniteCanvasGSelection.append("line")
      .attr("x1", x1)
      .attr("x2", x1)
      .attr("y1", y1)
      .attr("y2", y1)
      .attr("stroke", grey["300"])
      .attr("stroke-width", 3)
      .transition(t)
      .attr("x2", x2)
      .attr("y2", y2);
  }

  renderEdge(edge: IGraphEdge<ICityRoadGraphVertex, ICityRoadGraphEdge>) {
    console.log(edge.data.type);
    switch (edge.data.type) {
      case "major":
        return this._renderMajorEdge(edge);
      case "minor":
        return this._renderMinorEdge(edge);
      case "local":
        return this._renderLocalEdge(edge);
    }
  }

  renderTensorField(event: infiniteCanvasZoomType) {
    if (!this.cityView.showTenserField) return;
    this._renderTensorField(event);
    this._renderTensorFieldCenters(event);
  }
}

export default CityVisualizerDOMHelper;
