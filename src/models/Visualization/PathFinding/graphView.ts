import * as D3 from "d3";
import $ from 'jquery';
import InfiniteCanvasView from "@models/View/InfiniteCanvasView";
import { Nullable } from "ts-wiz";
import PathFindingGraph from "@models/DataStructure/Graph/PathFindingGraph";
import { PathFindingGraphEdge, PathFindingGraphVertex } from "../../../types/pathFindingGraph";
import {
  DEFAULT_VERTEX_RADIUS,
  DEFAULT_VERTEX_STROKE_WIDTH,
  TARGET_COLOR_LIST,
} from "../../../constants/visualization/pathFinding";
import { grey } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";

class DijkstraGraphView extends InfiniteCanvasView<unknown> {
  dataStructure: PathFindingGraph;
  documentRef: Nullable<HTMLDivElement> = null;

  private _vertexStrokeWidth = DEFAULT_VERTEX_STROKE_WIDTH;
  private _vertexRadius = DEFAULT_VERTEX_RADIUS;
  private _vertexDocumentIdMap = new Map<
    PathFindingGraphVertex["id"],
    D3.Selection<SVGCircleElement, unknown, HTMLElement, any>
  >();

  private _hoveredVertex:Nullable<PathFindingGraphVertex> = null


  // private _renderTooltip(){
  //   if(this.hoveredVertex === null) {
  //     $("#infinite-canvas-tooltip").remove()
  //     return 
  //   }
  //   const infiniteCanvasRoot = $("#element");
  //   const [x,y] = this.projectCoord(this.hoveredVertex.data.x , this.hoveredVertex.data.y);
  //   if(!x || !y) return ;


  //   const tooltipElement = $("<div></div>").attr("id", "infinite-canvas-tooltip").css({
  //     position: "absolute",
  //     top: y - 100,
  //     left: x + 10,
  //     width:100,
  //     height:100,
  //     backgroundColor:"white",
  //     borderRadius: 4,
  //     boxShadow: shadows["15"],
  //     zIndex:10
  //   });

  //   tooltipElement.text(`x:${this.hoveredVertex.data.x}, y:${this.hoveredVertex.data.y}`)

  //   infiniteCanvasRoot.append(tooltipElement)
  // }

  set hoveredVertex(v:Nullable<PathFindingGraphVertex>){
    this._hoveredVertex = v;
    // this._renderTooltip();
  }

  get hoveredVertex(){
    return this._hoveredVertex;
  }

  private _targetsColor = new Map<PathFindingGraphVertex["id"], string>();

  constructor(graph: PathFindingGraph) {
    super();
    this.dataStructure = graph;
  }

  onReady = () => {
    if (!this.documentRef) throw new Error("inconsistent state can't call onReady while document reference is invalid");
    this._initialRender();
    this._registerEvents();
  };

  private _registerEvents() {
    this.dataStructure.onPathFinding("visit", (v) => this._renderVisitEvent(v));
    this.dataStructure.onPathFinding("trace-to-source", (v) => this._renderTraceToSourceEvent(v));
  }

  private _renderVisitEvent(v: PathFindingGraphVertex) {
    const transitionObject = D3.transition().duration(1000).ease(D3.easeBounce);
    const docElementReference = this._vertexDocumentIdMap.get(v.id);
    if (this.dataStructure.targets.find((i) => i.id === v.id)) return;
    docElementReference
      ?.transition(transitionObject)
      .attr("r", this._vertexRadius + 2)
      .attr("fill", this._targetsColor.get(this.dataStructure.currentTarget.id)!);
  }

  private _renderTraceToSourceEvent(vertices: Array<PathFindingGraphVertex>) {
    const transitionObject = D3.transition().duration(1000).ease(D3.easeBounce);
    vertices.forEach((v) => {
      const docElementReference = this._vertexDocumentIdMap.get(v.id);
      docElementReference?.attr("stroke-width", 7).attr("stroke", "yellow");
    });
  }

  private _getColorForTarget(vertex: PathFindingGraphVertex) {
    const color = TARGET_COLOR_LIST[this._targetsColor.size % TARGET_COLOR_LIST.length];
    this._targetsColor.set(vertex.id, color);
    return color;
  }

  private _renderVertex(vertex: PathFindingGraphVertex) {
    const root = D3.select("#infinite-canvas g");

    const isEntry = vertex === this.dataStructure.entry;
    const isATarget = vertex === this.dataStructure.targets.find((t) => t === vertex);

    let targetColor: Nullable<string> = null;
    if (isATarget) targetColor = this._getColorForTarget(vertex);

    const res = root
      .append("circle")
      .attr("id" , vertex.id)
      .attr("cx", vertex.data.x)
      .attr("cy", vertex.data.y)
      .attr("r", this._vertexRadius)
      .attr("stroke-width", this._vertexStrokeWidth)
      .attr("stroke", "grey")
      .attr("fill", isEntry ? "blue" : isATarget ? targetColor : "white");


    res.on("mouseover", (e:MouseEvent) =>{
      const elem = e.target as SVGElement;
      const vertex = this.dataStructure.getVertexById(elem.id);
      if(!vertex) console.warn(`could not find vertex with id: ${elem.id}`);
      this.hoveredVertex = vertex;
    })


    res.on("mouseout", (e:MouseEvent) =>{
      const elem = e.target as SVGElement;
      if(this.hoveredVertex && this.hoveredVertex.id === elem.id) this.hoveredVertex = null;
    })
        
    this._vertexDocumentIdMap.set(vertex.id, res);
  }

  private _renderEdge(edge: PathFindingGraphEdge) {
    const root = D3.select("#infinite-canvas g");

    const isWall = edge.data.wight === Infinity;

    // root
    //   .append("line")
    //   .attr("x1", edge.from.data.x)
    //   .attr("y1", edge.from.data.y)
    //   .attr("x2", edge.to.data.x)
    //   .attr("y2", edge.to.data.y)
    //   .attr("stroke", grey["300"])

    if (isWall){
      const DX = edge.from.data.x - edge.to.data.x;
      const DY = edge.from.data.y - edge.to.data.y;
      const lineWidth = Math.sqrt(DX **2 + DY**2);

      root
        .append("line")
        .attr("x1", edge.from.data.x + lineWidth / 2)
        .attr("y1", edge.from.data.y + lineWidth /2)
        .attr("x2", edge.to.data.x - lineWidth / 2)
        .attr("y2", edge.to.data.y - lineWidth /2)
        .attr("stroke-width", 4)
        .attr("stroke", grey["600"]);
    }
  }

  private _initialRender() {
    for (const edge of this.dataStructure.EdgesIter()) {
      this._renderEdge(edge);
    }

    for (const vertex of this.dataStructure.iter()) {
      this._renderVertex(vertex);
    }
  }
}

export default DijkstraGraphView;
