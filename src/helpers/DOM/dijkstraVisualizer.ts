import * as D3 from "d3";
import { green, grey } from "@mui/material/colors";
import $ from "jquery";
import DijkstraGraphView from "@models/Visualization/Dijkstra/graphView";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "@constants/DOM";
import {
  BLANK_COLOR,
  DEFAULT_VERTEX_RADIUS,
  DEFAULT_VERTEX_STROKE_WIDTH,
  ENTRY_COLOR,
  TARGET_COLOR_LIST,
} from "@constants/visualization/dijkstra";
import { INFINITE_CANVAS_TOOLTIP } from "@constants/view";
import type { Nullable } from "ts-wiz";
import type { coordinate } from "@_types/coordinate";
import type {
  DijkstraDropdownMenuButtonType,
  DijkstraGraphEdge,
  DijkstraGraphVertex,
  DijkstraGraphVertexNodeType,
} from "@_types/context/dijkstra";

class DijkstraVisualizerDOMHelper {
  tooltip_x_shift = 20;
  tooltip_y_shift = 0;
  vertexRadius = DEFAULT_VERTEX_RADIUS;
  vertexStrokeWidth = DEFAULT_VERTEX_STROKE_WIDTH;
  wallHeight = DEFAULT_VERTEX_RADIUS;
  targetsColor = new Map<DijkstraGraphVertex["id"], string>();

  _vertexDocumentIdMap = new Map<
    DijkstraGraphVertex["id"],
    D3.Selection<SVGCircleElement, unknown, HTMLElement, any>
  >();
  _edgeDocumentIdMap = new Map<
    DijkstraGraphVertex["id"],
    [D3.Selection<SVGLineElement, unknown, HTMLElement, any>, D3.Selection<SVGLineElement, unknown, HTMLElement, any>]
  >();

  _entryPoint: Nullable<D3.Selection<SVGCircleElement, unknown, HTMLElement, any>> = null;
  _targetPoints: Array<D3.Selection<SVGCircleElement, unknown, HTMLElement, any>> = [];

  _view: DijkstraGraphView;

  constructor(graphView: DijkstraGraphView) {
    this._view = graphView;
  }

  public renderTooltip = (x: number, y: number, vertex: DijkstraGraphVertex) => {
    const tooltipElement = $("<div></div>")
      .attr("id", "infinite-canvas-tooltip")
      .css({
        position: "absolute",
        left: x + this.tooltip_x_shift,
        top: y + this.tooltip_y_shift,
        backgroundColor: grey["900"],
        opacity: "80%",
        color: "white",
        borderRadius: 4,
        padding: "4px",
      });

    tooltipElement.append(this._tooltipContent(vertex));
    return tooltipElement;
  };

  mapVertexToD3Selection(vertex: DijkstraGraphVertex) {
    const vertexD3Selection = this._vertexDocumentIdMap.get(vertex.id);
    if (!vertexD3Selection) throw new Error(`could not find vertex with ID ${vertex.id}`);
    return vertexD3Selection;
  }

  mapEdgeToD3Selection(edge: DijkstraGraphEdge) {
    const edgeD3Selection = this._edgeDocumentIdMap.get(edge.id);
    if (!edgeD3Selection) throw new Error(`could not find vertex with ID ${edge.id}`);
    return edgeD3Selection;
  }

  private _tooltipContent = (vertex: DijkstraGraphVertex) => {
    const tooltipContentContainer = $("<div></div>").css({ display: "flex" });
    const coordinateText = `Coordinate: [${vertex.data.x}, ${vertex.data.y}]`;
    tooltipContentContainer.text(coordinateText);
    return tooltipContentContainer;
  };

  private _createDropdownButton(btnAttributes: DijkstraDropdownMenuButtonType) {
    return $("<button></button>")
      .addClass("btn btn-sm custom-btn")
      .text(btnAttributes.label)
      .click(btnAttributes.callback);
  }

  public createDropDownContainer(
    x: coordinate["x"],
    y: coordinate["y"],
    buttons: Array<DijkstraDropdownMenuButtonType>
  ) {
    const dropdownContainerElement = $("<div></div>")
      .attr("id", DOCUMENT_ID_CONSTANTS.VIEW.PATH_FINDING.TOOLTIP_CONTAINER)
      .css({
        position: "absolute",
        left: x + this.tooltip_x_shift,
        top: y + this.tooltip_y_shift,
        zIndex: INFINITE_CANVAS_TOOLTIP,
      })
      .addClass("btn-group-vertical");

    buttons.forEach((btn) => {
      dropdownContainerElement.append(this._createDropdownButton(btn));
    });

    return dropdownContainerElement;
  }

  public renderVertexBlank(vertexSVG: D3.Selection<SVGCircleElement, unknown, HTMLElement, any>) {
    return vertexSVG.attr("fill", grey["100"]);
  }

  public renderVertexEntry(vertexSVG: D3.Selection<SVGCircleElement, unknown, HTMLElement, any>) {
    return vertexSVG.attr("fill", grey["100"]);
  }

  public renderVertexTarget(vertexSVG: D3.Selection<SVGCircleElement, unknown, HTMLElement, any>) {
    return vertexSVG.attr("fill", grey["100"]);
  }

  public renderDijkstraBlankVertex(vertex: DijkstraGraphVertex) {
    const root = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`);

    const vertexSVG = root
      .append("circle")
      .attr("id", vertex.id)
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.VERTEX)
      .attr("cx", vertex.data.x)
      .attr("cy", vertex.data.y)
      .attr("r", this.vertexRadius)
      .attr("stroke-width", this.vertexStrokeWidth)
      .attr("stroke", grey["500"])
      .attr("fill", grey["100"]);

    return this.renderVertexBlank(vertexSVG);
  }

  updateVertexAppearance(
    vertex: D3.Selection<SVGCircleElement, unknown, HTMLElement, any>,
    vertexType: DijkstraGraphVertexNodeType
  ) {
    // const color = vertexType === "blank" ? BLANK_COLOR : vertexType === "entry" ? ENTRY_COLOR : this.getColorForTarget(vertex);

    if (vertexType === "blank") vertex.attr("fill", BLANK_COLOR);
    else if (vertexType === "entry") vertex.attr("fill", ENTRY_COLOR);
    else {
      // color =
    }
  }

  getColorForTarget(vertex: DijkstraGraphVertex) {
    const color = TARGET_COLOR_LIST[this.targetsColor.size % TARGET_COLOR_LIST.length];
    this.targetsColor.set(vertex.id, color);
    return color;
  }

  renderNewEntryPoint(v: DijkstraGraphVertex) {
    this._entryPoint?.attr("fill", BLANK_COLOR);
    const vertexDocumentRef = this.mapVertexToD3Selection(v);
    vertexDocumentRef.transition().attr("fill", ENTRY_COLOR);
    this._entryPoint = vertexDocumentRef;
  }

  renderUpdatedTargets(vertices: Array<DijkstraGraphVertex>) {
    this._targetPoints.forEach((t) => t.attr("fill", BLANK_COLOR));
    this._targetPoints = [];
    this.targetsColor = new Map<DijkstraGraphVertex["id"], string>();

    vertices.forEach((v) => {
      const documentNode = this.mapVertexToD3Selection(v);
      this._targetPoints.push(documentNode);
      documentNode.transition().attr("fill", this.getColorForTarget(v));
    });
  }

  renderTraceToSourceEvent(vertices: Array<DijkstraGraphVertex>) {
    vertices.forEach((v) => {
      const docElementReference = this._vertexDocumentIdMap.get(v.id);
      docElementReference?.attr("stroke-width", 7).attr("stroke", "yellow");
    });
  }

  renderVisitEvent(v: DijkstraGraphVertex, currentTargetId: DijkstraGraphVertex["id"]) {
    const vertexD3Selection = this.mapVertexToD3Selection(v);
    const transition = D3.transition().duration(800).ease(D3.easeBack);
    const color = this.targetsColor.get(currentTargetId)!;
    vertexD3Selection.transition(transition).attr("fill", color);
  }

  public renderDijkstraVertex(vertex: DijkstraGraphVertex, vertexType: DijkstraGraphVertexNodeType) {
    const root = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`);

    const color =
      vertexType === "blank" ? BLANK_COLOR : vertexType === "entry" ? ENTRY_COLOR : this.getColorForTarget(vertex);

    const vertexSVG = root
      .append("circle")
      .attr("id", vertex.id)
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.VERTEX)
      .attr("cx", vertex.data.x)
      .attr("cy", vertex.data.y)
      .attr("r", this.vertexRadius)
      .attr("stroke-width", this.vertexStrokeWidth)
      .attr("stroke", grey[300])
      .attr("fill", color);

    if (vertexType === "entry") this._entryPoint = vertexSVG;
    if (vertexType === "target") this._targetPoints.push(vertexSVG);
    this._vertexDocumentIdMap.set(vertex.id, vertexSVG);

    return vertexSVG;
  }

  private _calculateVerticalIntersectingLine(edge: DijkstraGraphEdge): [coordinate, coordinate] {
    const DX = edge.from.data.x - edge.to.data.x;
    const DY = edge.from.data.y - edge.to.data.y;

    const CX = (edge.from.data.x + edge.to.data.x) / 2;
    const CY = (edge.from.data.y + edge.to.data.y) / 2;
    const CR = Math.atan2(DY, DX) * -1;

    const DXC = Math.sin(CR) * (this.wallHeight * 2);
    const DYC = Math.cos(CR) * (this.wallHeight * 2);

    return [
      { x: CX - DXC, y: CY - DYC },
      { x: CX + DXC, y: CY + DYC },
    ];
  }

  public renderDijkstraEdge(edge: DijkstraGraphEdge) {
    const rootSVGElement = D3.select(`#${DOCUMENT_ID_CONSTANTS.VIEW.INFINITE_CANVAS.ROOT} g`);

    const isWall = edge.data.blocked;
    const verticalIntersectingLine = this._calculateVerticalIntersectingLine(edge);

    const edgeConnectorLine = rootSVGElement
      .append("line")
      .attr("id", edge.id)
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.EDGE)
      .attr("x1", edge.from.data.x)
      .attr("y1", edge.from.data.y)
      .attr("x2", edge.to.data.x)
      .attr("y2", edge.to.data.y)
      .attr("stroke-width", 4)
      .attr("stroke", grey[200]);

    const edgeWallLine = rootSVGElement
      .append("line")
      .attr("id", edge.id)
      .attr("class", DOCUMENT_CLASS_CONSTANTS.VIEW.PATH_FINDING.EDGE)
      .attr("x1", verticalIntersectingLine[0].x)
      .attr("y1", verticalIntersectingLine[0].y)
      .attr("x2", verticalIntersectingLine[1].x)
      .attr("y2", verticalIntersectingLine[1].y)
      .attr("stroke-width", isWall ? 4 : null)
      .attr("stroke", isWall ? grey["600"] : null);

    this._edgeDocumentIdMap.set(edge.id, [edgeConnectorLine, edgeWallLine]);
  }

  public pushToHeap(vertex: DijkstraGraphVertex) {
    if (this._view.dataStructure.entry === vertex) return;
    if (this._view.dataStructure.targets.includes(vertex)) return;
    const vertexSelection = this.mapVertexToD3Selection(vertex);
    vertexSelection.attr("fill", green["300"])
  }

  public updateEdge(edge: DijkstraGraphEdge) {
    const [_, wallSelection] = this.mapEdgeToD3Selection(edge);

    if (edge.data.blocked) {
      wallSelection.attr("stroke-width", 4).attr("stroke", grey["900"]);
    } else {
      wallSelection.attr("stroke-width", null).attr("stroke", null);
    }
  }

  public renderVisitVertex(
    vertexSVG: D3.Selection<SVGCircleElement, unknown, HTMLElement, any> | undefined,
    currentTargetId: DijkstraGraphVertex["id"]
  ) {
    const transitionObject = D3.transition().duration(1000).ease(D3.easeBounce);
    vertexSVG?.transition(transitionObject).attr("fill", this.targetsColor.get(currentTargetId)!);
  }
}

export default DijkstraVisualizerDOMHelper;
