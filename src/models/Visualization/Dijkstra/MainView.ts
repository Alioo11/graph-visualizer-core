import * as D3 from "d3";
import { NoneToVoidFunction, Nullable } from "ts-wiz";
import DijkstraGraph from "../../DataStructure/Graph/Dijkstra";
import View from "../../View";
import InfiniteCanvasView from "@models/View/InfiniteCanvasView";

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function generateHexColor(inputNumber: number): string {
  // Step 1: Normalize the input to fall within the range [0, 1]
  const normalizedInput = Math.min(Math.max(0, inputNumber), 1);

  // Step 2: Map the normalized input to an RGB value
  // We start with blue at 0 and end with red at 255
  const rValue = Math.round(normalizedInput * 255);
  const gValue =  Math.round(normalizedInput * 255);
  const bValue = Math.round((1 - normalizedInput) * 255); // Inverse of rValue for blue

  // Step 3: Convert RGB to HEX
  const rHex = rValue.toString(16).padStart(2, '0');
  const gHex = gValue.toString(16).padStart(2, '0');
  const bHex = bValue.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function floatToHexColor(value: number): string {
  // Normalize the input if necessary
  const normalizedValue = Math.min(Math.max(0, value), 1);

  // Calculate RGB values based on the normalized float
  const red = Math.round(normalizedValue * 255);
  const green = Math.round((normalizedValue - 0.5) * 510); // Subtracting 0.5 shifts the range to [0, 510]
  const blue = 255 - green; // Ensuring the sum of R, G, B remains at 255

  // Convert RGB to hexadecimal
  const redHex = red.toString(16).padStart(2, '0');
  const greenHex = green.toString(16).padStart(2, '0');
  const blueHex = blue.toString(16).padStart(2, '0');

  return `#${redHex}${greenHex}${blueHex}`;
}


class DijkstraMainView extends InfiniteCanvasView<unknown> {
  private idToVertexMap = new Map<string, D3.Selection<SVGRectElement, unknown, HTMLElement, any> >();
  // private idToEdgeMap = new Map<string, D3.Selection<SVGRectElement, unknown, null, undefined>>();
  dataStructure: DijkstraGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  constructor(dataStructure: DijkstraGraph) {
    super();
    this.dataStructure = dataStructure;
    this.setEvents();
  }


  onReady: Nullable<NoneToVoidFunction> = () => {
    this.draw();
  };

  draw() {
    const VERTEX_WIDTH = 5;
    const VERTEX_HEIGHT = 5;

    const svg = D3.select("svg g");

    for (const edge of this.dataStructure.EdgesIter()) {
      svg
        .append("line")
        .attr("x1", edge.from.data.x + VERTEX_WIDTH / 2)
        .attr("y1", edge.from.data.y + VERTEX_HEIGHT / 2)
        .attr("x2", edge.to.data.x + VERTEX_WIDTH / 2)
        .attr("y2", edge.to.data.y + VERTEX_HEIGHT / 2)
        .attr("stroke-width" , .5)
        .attr("stroke", floatToHexColor(sigmoid(edge.data.wight! / 1)))
    }

    for (const vertex of this.dataStructure.iter()) {
      const isTarget = vertex === this.dataStructure.targetVertex[0];
      const isEntry = vertex === this.dataStructure.entryVertex;
      const color = isTarget ? "red" : isEntry ? "blue" : "white";
      let f = svg
        .append("rect")
        .attr("x", vertex.data.x)
        .attr("y", vertex.data.y)
        .attr("stroke", "gray")
        .attr("stroke-width" , .2)
        .attr("width", VERTEX_WIDTH)
        .attr("height", VERTEX_HEIGHT)
        .attr("fill", color);

      //   const text = svg.append("text")
      //     .attr("class", "text")
      //     .attr("x", vertex.data.x + 10)
      //     .attr("y", vertex.data.y + 13).attr("font-size" , 7)
      //     .text(vertex.label);

      //  // Optionally, adjust the text alignment if needed
      //  text.attr("text-anchor", "middle");

      f.append("text").text("H").attr("x", 0).attr("y", 0).attr("fill", "black");

      this.idToVertexMap.set(vertex.id, f);
    }
  }

  setEvents() {
    this.dataStructure.onVertex("state-change", (v) => {
      const documentRef = this.idToVertexMap.get(v.id);
      documentRef
        ?.transition()
        .duration(1000)
        .attr("fill", floatToHexColor(sigmoid(v.data.cost! / 10)));
    });
  }
}

export default DijkstraMainView;
