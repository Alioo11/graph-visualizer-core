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

    $(`.${DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE}`).remove();

    for (let i = 0; i < HorizontalRulerTickValues.length; i++) {
      for (let j = 0; j < VerticalRulerTickValues.length; j++) {
        const coordinate = { x: HorizontalRulerTickValues[i], y: VerticalRulerTickValues[j] };
        const angle = this.cityView.field.get(coordinate);

        const verticalAngle = angle + Math.PI / 2;

        const DXV = length * Math.cos(angle);
        const DYV = length * Math.sin(angle);

        const X1V = coordinate.x - DXV;
        const X2V = coordinate.x + DXV;
        const Y1V = coordinate.y - DYV;
        const Y2V = coordinate.y + DYV;

        const DXX = length * Math.cos(verticalAngle);
        const DYX = length * Math.sin(verticalAngle);

        const X1X = coordinate.x - DXX;
        const X2X = coordinate.x + DXX;
        const Y1X = coordinate.y - DYX;
        const Y2X = coordinate.y + DYX;

        this.D3InfiniteCanvasGSelection.append("line")
          .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE)
          .attr("x1", X1V)
          .attr("x2", X2V)
          .attr("y1", Y1V)
          .attr("y2", Y2V)
          .attr("stroke", ColorHelper.angleToColor(angle))
          .attr("stroke-width", strokeWidth);

        this.D3InfiniteCanvasGSelection.append("line")
          .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.TENSOR_FIELD.VECTOR_LINE)
          .attr("x1", X1X)
          .attr("x2", X2X)
          .attr("y1", Y1X)
          .attr("y2", Y2X)
          .attr("stroke", ColorHelper.angleToColor(angle))
          .attr("stroke-width", strokeWidth);
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
