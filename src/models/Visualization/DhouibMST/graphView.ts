import * as D3 from "d3";
import View from "@models/View";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";
import type { DhouibGraphEdge } from "@_types/context/dhouib";

const VERTEX_RADIUS = 9;
class GraphView extends View<unknown> {
  private idToVertexMap = new Map<
    string,
    D3.Selection<SVGRectElement, unknown, null, undefined>
  >();
  private idToEdgeMap = new Map<
    string,
    D3.Selection<SVGLineElement, unknown, null, undefined>
  >();
  dataStructure: DhouibGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  constructor(dataStructure: DhouibGraph) {
    super();
    this.dataStructure = dataStructure;
  }


  private registerEvents (){
    this.dataStructure.onEdge("state-change" , (s) => this.updateState(s))
  }


  onReady: Nullable<NoneToVoidFunction> = () => {
    this.draw();
    this.registerEvents();
  };

  private updateState(edge:DhouibGraphEdge){
    const documentRef = this.idToEdgeMap.get(edge.id);
    if(!documentRef) throw new Error(`could not find document with id ${edge.id}`);

    if(edge.data.status === "candidate") documentRef.attr("stroke-width", 1).attr("stroke", "yellow");
    if(edge.data.status === "connected") documentRef.attr("stroke-width", 4).attr("stroke", "red");

  }

  draw() {
    const VERTEX_WIDTH = 7;
    const VERTEX_HEIGHT = 7 ;

    var svg = D3.select(this.documentRef)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g");

    for (const edge of this.dataStructure.EdgesIter()) {
      let f = svg
        .append("line")
        .attr("x1", edge.from.data.x + VERTEX_WIDTH / 2)
        .attr("y1", edge.from.data.y + VERTEX_HEIGHT / 2)
        .attr("x2", edge.to.data.x + VERTEX_WIDTH / 2)
        .attr("y2", edge.to.data.y + VERTEX_HEIGHT / 2)
        .attr("stroke-width", .2)
        .attr("stroke", "grey");
        this.idToEdgeMap.set(edge.id , f);
    }

    for (const vertex of this.dataStructure.iter()) {
      let f = svg
        .append("circle")
        .attr("cx", vertex.data.x + VERTEX_RADIUS/2)
        .attr("cy", vertex.data.y + VERTEX_RADIUS/2)
        .attr("r", VERTEX_RADIUS) // Radius of the circle
        .attr("width", VERTEX_WIDTH)
        .attr("height", VERTEX_HEIGHT)
        .attr("stroke", "blue")
        .attr("fill", "lightblue")
        

      const text = svg.append("text")
        .attr("x", vertex.data.x + VERTEX_RADIUS/2 - 6)
        .attr("y", vertex.data.y + VERTEX_RADIUS/2 + 6).attr("font-size" , 16)
        .text(vertex.label);

      f.append("text").text("H").attr("x",0).attr("y",0).attr("fill","black")
    }
  }

}

export default GraphView;
