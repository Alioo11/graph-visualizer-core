import * as D3 from "d3";
import { NoneToVoidFunction, Nullable } from "ts-wiz";
import View from "../../View";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";


const VERTEX_RADIUS = 20;

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


class GraphView extends View<unknown> {
  private idToVertexMap = new Map<
    string,
    D3.Selection<SVGRectElement, unknown, null, undefined>
  >();
  private idToEdgeMap = new Map<
    string,
    D3.Selection<SVGRectElement, unknown, null, undefined>
  >();
  dataStructure: DhouibGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  constructor(dataStructure: DhouibGraph) {
    super();
    this.dataStructure = dataStructure;
    this.setEvents();
  }

  onReady: Nullable<NoneToVoidFunction> = () => {
    this.draw();
  };

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
        .attr("stroke-width", .7)
        .attr("stroke", "grey");
    }

    for (const vertex of this.dataStructure.iter()) {
      let f = svg
        .append("circle")
        .attr("cx", vertex.data.x + VERTEX_RADIUS/2)
        .attr("cy", vertex.data.y + VERTEX_RADIUS/2)
        .attr("r", VERTEX_RADIUS) // Radius of the circle
        .attr("width", VERTEX_WIDTH)
        .attr("height", VERTEX_HEIGHT)
        .attr("fill", "lightblue")

      const text = svg.append("text")
        .attr("x", vertex.data.x + VERTEX_RADIUS/2 - 6)
        .attr("y", vertex.data.y + VERTEX_RADIUS/2 + 6).attr("font-size" , 16)
        .text(vertex.label);

      f.append("text").text("H").attr("x",0).attr("y",0).attr("fill","black")
    }
  }

  setEvents() {
    this.dataStructure.onVertex("state-change", (v) => {
      const documentRef = this.idToVertexMap.get(v.id);
      documentRef?.transition().duration(1000).attr("fill", floatToHexColor(sigmoid(v.data.cost!/10)));
    });
  }
}

export default GraphView;
