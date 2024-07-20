import * as D3 from "d3";
import { grey } from "@mui/material/colors";
import $ from "jquery";
import {
  pathFindingDropdownMenuButtonType,
  PathFindingGraphEdge,
  PathFindingGraphVertex,
  pathFindingGraphVertexNodeType,
} from "../../types/pathFindingGraph";
import { coordinate } from "../../types/coordinate";
import { DOCUMENT_CLASS_CONSTANTS, DOCUMENT_ID_CONSTANTS } from "../../constants/DOM";
import {
  BLANK_COLOR,
  DEFAULT_VERTEX_RADIUS,
  DEFAULT_VERTEX_STROKE_WIDTH,
  ENTRY_COLOR,
  TARGET_COLOR_LIST,
} from "../../constants/visualization/pathFinding";
import { Nullable } from "ts-wiz";
import DijkstraGraphView from "@models/Visualization/PathFinding/graphView";
import { INFINITE_CANVAS_TOOLTIP } from "../../constants/view";

class PathfindingVisualizerDOMHelper {
  tooltip_x_shift = 20;
  tooltip_y_shift = 0;
  vertexRadius = DEFAULT_VERTEX_RADIUS;
  vertexStrokeWidth = DEFAULT_VERTEX_STROKE_WIDTH;
  wallHeight = DEFAULT_VERTEX_RADIUS;
  targetsColor = new Map<PathFindingGraphVertex["id"], string>();

  _vertexDocumentIdMap = new Map<
    PathFindingGraphVertex["id"],
    D3.Selection<SVGCircleElement, unknown, HTMLElement, any>
  >();
  _edgeDocumentIdMap = new Map<
    PathFindingGraphVertex["id"],
    [D3.Selection<SVGLineElement, unknown, HTMLElement, any>, D3.Selection<SVGLineElement, unknown, HTMLElement, any>]
  >();

  _entryPoint: Nullable<D3.Selection<SVGCircleElement, unknown, HTMLElement, any>> = null;
  _targetPoints: Array<D3.Selection<SVGCircleElement, unknown, HTMLElement, any>> = [];


  _view: DijkstraGraphView

  constructor(graphView: DijkstraGraphView){
    this._view = graphView
  }

  public renderTooltip = (x: number, y: number, vertex: PathFindingGraphVertex) => {
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

  private _tooltipContent = (vertex: PathFindingGraphVertex) => {
    const tooltipContentContainer = $("<div></div>").css({ display: "flex" });
    const coordinateText = `Coordinate: [${vertex.data.x}, ${vertex.data.y}]`;
    tooltipContentContainer.text(coordinateText);
    return tooltipContentContainer;
  };

  private _createDropdownButton(btnAttributes: pathFindingDropdownMenuButtonType) {
    return $("<button></button>")
      .addClass("btn btn-sm btn-secondary bg-dark")
      .text(btnAttributes.label)
      .click(btnAttributes.callback);
  }

  public createDropDownContainer(
    x: coordinate["x"],
    y: coordinate["y"],
    buttons: Array<pathFindingDropdownMenuButtonType>
  ) {
    const dropdownContainerElement = $("<div></div>")
      .attr("id", DOCUMENT_ID_CONSTANTS.VIEW.PATH_FINDING.TOOLTIP_CONTAINER)
      .css({
        position: "absolute",
        left: x + this.tooltip_x_shift,
        top: y + this.tooltip_y_shift,
        zIndex:INFINITE_CANVAS_TOOLTIP
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

  public renderPathfindingBlankVertex(vertex: PathFindingGraphVertex) {
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
    vertexType: pathFindingGraphVertexNodeType
  ) {
    // const color = vertexType === "blank" ? BLANK_COLOR : vertexType === "entry" ? ENTRY_COLOR : this.getColorForTarget(vertex);

    if (vertexType === "blank") vertex.attr("fill", BLANK_COLOR);
    else if (vertexType === "entry") vertex.attr("fill", ENTRY_COLOR);
    else {
      // color =
    }
  }

  getColorForTarget(vertex: PathFindingGraphVertex) {
    const color = TARGET_COLOR_LIST[this.targetsColor.size % TARGET_COLOR_LIST.length];
    this.targetsColor.set(vertex.id, color);
    return color;
  }

  renderNewEntryPoint(v: PathFindingGraphVertex) {
    this._entryPoint?.attr("fill", BLANK_COLOR);
    const vertexDocumentRef = this._vertexDocumentIdMap.get(v.id);
    if (!vertexDocumentRef) throw new Error(`could not find node with ID ${v.id}`);
    vertexDocumentRef.transition().attr("fill", ENTRY_COLOR);
    this._entryPoint = vertexDocumentRef;
  }

  renderUpdatedTargets(vertices: Array<PathFindingGraphVertex>) {
    this._targetPoints.forEach((t) => t.attr("fill", BLANK_COLOR));
    this._targetPoints = [];
    this.targetsColor = new Map<PathFindingGraphVertex["id"], string>();

    vertices.forEach((v) => {
      const documentNode = this._vertexDocumentIdMap.get(v.id);
      if (!documentNode) throw new Error(`could not find document node with ID ${v.id}`);
      this._targetPoints.push(documentNode);
      documentNode.attr("fill", this.getColorForTarget(v));
    });
  }

  renderTraceToSourceEvent(vertices: Array<PathFindingGraphVertex>) {
    vertices.forEach((v) => {
      const docElementReference = this._vertexDocumentIdMap.get(v.id);
      docElementReference?.attr("stroke-width", 7).attr("stroke", "yellow");
    });
  }

  renderVisitEvent(v: PathFindingGraphVertex, currentTargetId: PathFindingGraphVertex["id"]) {
    const docElementReference = this._vertexDocumentIdMap.get(v.id);
    const t = D3.transition().duration(800).ease(D3.easeBack)
    if (!docElementReference) throw new Error(`could not find document element with ID: ${v.id}`);
    const color = this.targetsColor.get(currentTargetId)!;
    docElementReference.transition(t).attr("fill", color);
  }

  public renderPathfindingVertex(vertex: PathFindingGraphVertex, vertexType: pathFindingGraphVertexNodeType) {
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

  private _calculateVerticalIntersectingLine(edge: PathFindingGraphEdge): [coordinate, coordinate] {
    const DX = edge.from.data.x - edge.to.data.x;
    const DY = edge.from.data.y - edge.to.data.y;

    const CX = (edge.from.data.x + edge.to.data.x) / 2;
    const CY = (edge.from.data.y + edge.to.data.y) / 2;
    const CR = Math.atan2(DY , DX) * -1 

    const DXC = Math.sin(CR) * this.wallHeight;
    const DYC = Math.cos(CR) * this.wallHeight;

    return [
      { x: CX - DXC, y: CY - DYC },
      { x: CX + DXC, y: CY + DYC },
    ];
  }

  public renderPathfindingEdge(edge: PathFindingGraphEdge) {
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
      .attr("stroke-width", .4)
      .attr("stroke", grey[900]);

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

  public updateEdge(edge: PathFindingGraphEdge) {
    const isWall = edge.data.blocked;
    const edgeSVG = this._edgeDocumentIdMap.get(edge.id);

    if (!edgeSVG) throw new Error("");

    edgeSVG[0]

    edgeSVG[1]
      .attr("stroke-width", isWall ? 4 : null)
      .attr("stroke", isWall ? grey["600"] : null);
  }

  public renderVisitVertex(
    vertexSVG: D3.Selection<SVGCircleElement, unknown, HTMLElement, any> | undefined,
    currentTargetId: PathFindingGraphVertex["id"]
  ) {
    const transitionObject = D3.transition().duration(1000).ease(D3.easeBounce);
    vertexSVG?.transition(transitionObject).attr("fill", this.targetsColor.get(currentTargetId)!);
  }
}

export default PathfindingVisualizerDOMHelper;
