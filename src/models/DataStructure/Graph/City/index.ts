import Graph from "@models/DataStructure/Graph";
import type { ICityRoadGraphEdge, ICityRoadGraphVertex } from "@_types/context/city";
import type { coordinate } from "@_types/coordinate";
import type { GraphType, IGraphEdge, IGraphVertex } from "@_types/dataStructure/graph";
import CoordinateHelper from "@helpers/Coordinate";
import SortedList from "@models/DataStructure/SortedList";

class CityGraph extends Graph<ICityRoadGraphVertex, ICityRoadGraphEdge> {
  private _horizontalVertexMap = new SortedList<IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>>((v)=>v.data.x);
  private _verticalVertexMap = new SortedList<IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>>((v)=>v.data.y);

  constructor(type: GraphType) {
    super(type);
    this.on("add-vertex", this._addVertexToVertexMaps);
  }

  private _addVertexToVertexMaps = (vertex: IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>) => {
    this._horizontalVertexMap.add(vertex)
    this._verticalVertexMap.add(vertex)
  };

  private _oldApproach = (coordinate: coordinate, radius: number) => {
    let count: Array<IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>> = [];
    this._vertexes.forEach((v) => {
      const dist = CoordinateHelper.getDistanceBetweenTwoPoints(v.data, coordinate);
      if (dist < radius) count.push(v);
    });
    return count;
  };

  private _newApproach = (coordinate: coordinate, radius: number) => {
    const { x, y } = coordinate;
    const [fromX,toX]: RangeList = [x - radius, x + radius];
    const [fromY, toY]: RangeList = [y - radius, y + radius];

    const horizontalVertexes = this._horizontalVertexMap.getElementInRange(fromX, toX);
    const verticalVertexes = this._verticalVertexMap.getElementInRange(fromY, toY);

    const horizontalVertexesIds = new Set<IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>['id']>();
    horizontalVertexes.forEach((i) => horizontalVertexesIds.add(i.id));

    return verticalVertexes.filter((i) => horizontalVertexesIds.has(i.id));
  };

  getVertexCountByRadius(coordinate: coordinate, radius: number) {
    return this._newApproach(coordinate, radius).length;
  }

  getNearestVertex(coordinate: coordinate, radius: number) {
    const vs = this._newApproach(coordinate , radius);

    const vertexList: Array<{ vertex: IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>; distance: number }> = [];
    vs.forEach((v) => {
      const dist = CoordinateHelper.getDistanceBetweenTwoPoints(v.data, coordinate);
      vertexList.push({ vertex: v, distance: dist });
    });
    const sortedVs = vertexList.sort((a, b) => a.distance - b.distance).map((v) => v.vertex);
    return sortedVs;
  }

  getEdgeCountByRadius(coordinate: coordinate, radius: number) {
    let count = 0;
    this._edges.forEach((e) => {
      const dist = this.pointToLineDistance(coordinate, e);
      if (dist < radius) count += 1;
    });
    return count;
  }

  private pointToLineDistance(point: coordinate, edge: IGraphEdge<ICityRoadGraphVertex, ICityRoadGraphEdge>): number {
    const { from, to } = edge;

    const { x: fromX, y: fromY } = from.data;
    const { x: toX, y: toY } = to.data;

    const DX = toX - fromX;
    const DY = toY - fromY;

    const lineLengthSquared = DX ** 2 + DY ** 2;

    if (lineLengthSquared === 0) return CoordinateHelper.getDistanceBetweenTwoPoints(point, from.data);

    let t = ((point.x - fromX) * (toX - fromX) + (point.y - fromY) * (toY - fromY)) / lineLengthSquared;

    t = Math.max(0, Math.min(1, t));

    const closestPoint: coordinate = {
      x: fromX + t * (toX - fromX),
      y: fromY + t * (toY - fromY),
    };

    return CoordinateHelper.getDistanceBetweenTwoPoints(point, closestPoint);
  }
}

export default CityGraph;
