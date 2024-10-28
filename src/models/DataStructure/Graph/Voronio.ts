import Graph from "@models/DataStructure/Graph";
import Line from "@models/Line";
import CoordinateHelper from "@helpers/Coordinate";
import type { IVoronoiEdge, IVoronoiVertex } from "@_types/context/voronoi";
import type { coordinate } from "@_types/coordinate";
import type { GraphType, IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";

class VoronoiGraph extends Graph<IVoronoiVertex, IVoronoiEdge> {
  constructor(type: GraphType) {
    super(type);
  }

  intersectionCoordinate = (line: Line) => {
    const intersections: Map<
      IGraphEdge<IVoronoiVertex, IVoronoiEdge>["id"],
      { edge: IGraphEdge<IVoronoiVertex, IVoronoiEdge>; intersectionCoordinate: coordinate }
    > = new Map();

    this._edges.forEach((edge) => {
      const intersection = this._intersectionCoordinate(line, edge);
      if (intersection) {
        intersections.set(edge.id, {
          edge,
          intersectionCoordinate: intersection,
        });
      }
    });

    const intersectionsAsArray = Array.from(intersections.values());
    
    return intersectionsAsArray.sort((a, b) => {
      if (a.intersectionCoordinate.x !== b.intersectionCoordinate.x)
        return a.intersectionCoordinate.x - b.intersectionCoordinate.x;
      return a.intersectionCoordinate.y - b.intersectionCoordinate.y;
    });
  };

  private _intersectionCoordinate = (line: Line, edge: IGraphEdge<IVoronoiVertex, IVoronoiEdge>) => {
    const a = edge.from.data.coordinate;
    const b = edge.to.data.coordinate;
    const { from: c, to: d } = line;
    const haveTheSameStartingPoint = a.x === c.x && a.y === c.y;
    const haveTheSameEndPoint = b.x === d.x && b.y === d.y;
    if (haveTheSameStartingPoint && haveTheSameEndPoint) return { x: a.x + b.x / 2, y: a.y + b.y / 2 };
    if (haveTheSameStartingPoint) return a;
    if (haveTheSameEndPoint) return c;
    const a1 = b.y - a.y;
    const b1 = a.x - b.x;
    const c1 = a1 * a.x + b1 * a.y;
    const a2 = d.y - c.y;
    const b2 = c.x - d.x;
    const c2 = a2 * c.x + b2 * c.y;
    const determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) {
      return null;
    } else {
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;

      if (
        Math.min(a.x, b.x) <= x &&
        x <= Math.max(a.x, b.x) &&
        Math.min(a.y, b.y) <= y &&
        y <= Math.max(a.y, b.y) &&
        Math.min(c.x, d.x) <= x &&
        x <= Math.max(c.x, d.x) &&
        Math.min(c.y, d.y) <= y &&
        y <= Math.max(c.y, d.y)
      ) {
        return { x, y };
      } else {
        return null;
      }
    }
  };

  insertVertex = (
    edgeReference: IGraphEdge<IVoronoiVertex, IVoronoiEdge>,
    vertexData: IVoronoiVertex,
  ) => {
    const { from, to, data } = edgeReference;
    const vertex = this.addVertex(`${from.label} --connection-- ${to.label}`, vertexData);
    this.connect(from, vertex, data);
    this.connect(to, vertex, data);
    this.disConnect(edgeReference.id);
    return vertex;
  };

  getVertexCountByRadius(coordinate: coordinate, radius: number) {
    return this._oldApproach(coordinate, radius).length;
  }

  private _oldApproach = (coordinate: coordinate, radius: number) => {
    let count: Array<IGraphVertex<IVoronoiVertex, IVoronoiEdge>> = [];
    this._vertexes.forEach((v) => {
      const dist = CoordinateHelper.getDistanceBetweenTwoPoints(v.data.coordinate, coordinate);
      if (dist < radius) count.push(v);
    });
    return count;
  };

  private pointToLineDistance(point: coordinate, edge: IGraphEdge<IVoronoiVertex, IVoronoiEdge>): number {
    const { from, to } = edge;

    const { x: fromX, y: fromY } = from.data.coordinate;
    const { x: toX, y: toY } = to.data.coordinate;

    const DX = toX - fromX;
    const DY = toY - fromY;

    const lineLengthSquared = DX ** 2 + DY ** 2;

    if (lineLengthSquared === 0) return CoordinateHelper.getDistanceBetweenTwoPoints(point, from.data.coordinate);

    let t = ((point.x - fromX) * (toX - fromX) + (point.y - fromY) * (toY - fromY)) / lineLengthSquared;

    t = Math.max(0, Math.min(1, t));

    const closestPoint: coordinate = {
      x: fromX + t * (toX - fromX),
      y: fromY + t * (toY - fromY),
    };

    return CoordinateHelper.getDistanceBetweenTwoPoints(point, closestPoint);
  }
}

export default VoronoiGraph;
