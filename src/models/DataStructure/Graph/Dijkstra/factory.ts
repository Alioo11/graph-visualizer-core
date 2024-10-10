import DijkstraGraph from ".";
import NumberUtils from "@utils/Number";
import type {
  GraphTopology,
  gridGraphOptions,
  IGraphFactory,
  randomizedGraphOptions,
} from "@_types/dataStructure/graph";
import type { IDijkstraGraphEdge, IDijkstraGraphVertex, DijkstraGraphVertex } from "@_types/context/dijkstra";
import type { coordinate } from "@_types/coordinate";

const INITIAL_LENGTH = 1200;
const SPREAD_ANGLE = Math.PI / 5;
const GENERATION_LIMIT = 15;


class lindenmayerSystemChar {
  constructor(public graph: DijkstraGraph, public vertex: DijkstraGraphVertex, public angle: number) {}

  createA(dir: "left" | "right", gen:number) {
    const [left, right] = [
      this.calculatePoints(this.angle + SPREAD_ANGLE, gen),
      this.calculatePoints(this.angle - SPREAD_ANGLE, gen),
    ];
    const point = dir === "left" ? left : right;

    return this.graph.addVertex("A", {
      x: point.x,
      y: point.y,
    });
  }

  createB() {
    const { x, y } = this.vertex.data;
    return this.graph.addVertex("B", { x: x + 100, y: y - 100 });
  }

  calculatePoints = (angleInRadian: number, gen:number): coordinate => {
    const length = INITIAL_LENGTH / gen ** 2
    const { x, y } = this.vertex.data;
    return { x: x + length * Math.cos(angleInRadian), y: y + length * Math.sin(angleInRadian) };
  };

  handleACase(gen: number) {
    const AVertex = this.createA("left", gen);
    const BVertex = this.createA("right", gen);

    this.graph.connect(this.vertex, AVertex, { wight: 10, blocked: false });
    this.graph.connect(this.vertex, BVertex, { wight: 10, blocked: false });

    return [
      new lindenmayerSystemChar(this.graph, AVertex, this.angle + SPREAD_ANGLE),
      new lindenmayerSystemChar(this.graph, BVertex, this.angle - SPREAD_ANGLE),
    ];
  }

  handleBCase(gen:number) {
    const AVertex = this.createA("left" ,gen);

    this.graph.connect(this.vertex, AVertex, { wight: 10, blocked: false });

    return [new lindenmayerSystemChar(this.graph, AVertex, 0)];
  }

  create = (gen: number) => {
    switch (this.vertex.label) {
      case "A":
        return this.handleACase(gen);
      case "B":
        return this.handleBCase(gen);
      default:
        return this.handleACase(gen);
    }
  };
}

class DijkstraGraphFactory implements IGraphFactory<IDijkstraGraphVertex, IDijkstraGraphEdge, DijkstraGraph> {
  size: number = 10;
  topology: GraphTopology = "mesh";

  public radius = 4000;

  lindenmayerSystem() {
    const graph = new DijkstraGraph("undirected");
    const initialNode = graph.addVertex("A", { x: 0, y: 0 });

    graph.entry = initialNode;
    graph.addTarget(initialNode);

    const charsList: Array<lindenmayerSystemChar> = [new lindenmayerSystemChar(graph, initialNode, Math.PI / 2 * -1)];

    const iterator = (prevGen: Array<lindenmayerSystemChar>, generation: number) => {
      if (generation > GENERATION_LIMIT) return;
      const newList = [];
      for (let i = 0; i < prevGen.length; i++) {
        const addedChars = prevGen[i].create(generation);
        newList.push(...addedChars);
      }
      charsList.push(...newList);
      iterator(newList, generation + 1);
    };

    iterator(charsList, 1);

    return graph;
  }

  createGrid(options: gridGraphOptions) {
    const { gap, width, height, entry, targets } = options;

    const startingPointX = ((gap * width) / 2) * -1;
    const startingPointY = ((gap * height) / 2) * -1;

    const mat: Array<Array<any>> = Array.from(Array(width).keys()).map(() => new Array(height));
    const graph = new DijkstraGraph("undirected");

    const isValidEntry = entry[0] < width && entry[1] < height;
    const isValidTarget = targets.every(([x, y]) => x < width && y < height);

    if (!isValidEntry) throw new Error("entry point out of grid");

    if (!isValidTarget) throw new Error("one or more target is out of entry grid range");

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const f = graph.addVertex(`${j}-${i}`, {
          x: gap * j + startingPointX,
          y: gap * i + startingPointY,
        });
        mat[i][j] = f;
      }
    }

    for (let row = 0; row < mat.length; row++) {
      for (let col = 0; col < mat[row].length; col++) {
        const currentNode = mat[row][col];
        const bottomNode = mat?.[row + 1]?.[col];
        const nextNode = mat?.[row]?.[col + 1];
        if (nextNode) graph.connect(currentNode, nextNode, { wight: 1, blocked: false });
        if (bottomNode) graph.connect(currentNode, bottomNode, { wight: 1, blocked: false });
      }
    }

    graph.entry = mat[entry[0]][entry[1]];
    targets.forEach(([x, y]) => graph.addTarget(mat[y][x]));
    return graph;
  }

  get portion() {
    return (2 * Math.PI) / this.size;
  }

  randomizedGraph(options: randomizedGraphOptions) {
    const { size } = options;

    const PICK_PORTION = 0.02;
    const graph = new DijkstraGraph("undirected");
    const vertices: Array<DijkstraGraphVertex> = new Array(size);

    for (let i = 0; i < size; i++) {
      const vertexRef = graph.addVertex(`${i}`, {
        x: NumberUtils.randomNumberBetween(-size * 3, size * 3),
        y: NumberUtils.randomNumberBetween(-size * 3, size * 3),
      });
      vertices[i] = vertexRef;
    }

    const getDistance = (v1: DijkstraGraphVertex, v2: DijkstraGraphVertex) => {
      const DX = v2.data.x - v1.data.x;
      const DY = v2.data.y - v1.data.y;
      return Math.sqrt(DX ** 2 + DY ** 2);
    };

    for (const v of vertices) {
      const nearestVertices = vertices.sort((a, b) => getDistance(a, v) - getDistance(b, v));
      const bestOnes = nearestVertices.slice(0, nearestVertices.length * PICK_PORTION);

      bestOnes.forEach((b) => {
        graph.connect(b, v, { wight: getDistance(v, b), blocked: false });
      });
    }

    graph.entry = vertices[0];

    return graph;
  }

  create = () => {
    return this.randomizedGraph({ size: 10 });
  };
}

export default DijkstraGraphFactory;