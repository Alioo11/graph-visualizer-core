import VoronoiGraph from "@models/DataStructure/Graph/Voronio";
import Line from "@models/Line";
import type { IGraphEdge } from "@_types/dataStructure/graph";
import type { IVoronoiEdge, IVoronoiVertex } from "@_types/context/voronoi";
import type { coordinate } from "@_types/coordinate";
import type { IVoronoi } from "@_types/voronoi";

class Voronoi implements IVoronoi {
  private _sitePoints: Array<coordinate>;
  private _padding: number;
  private _graph: VoronoiGraph;

  private _width: number;
  private _height: number;

  constructor(sitePoints: Array<coordinate>, padding: number) {
    this._padding = padding;
    this._sitePoints = sitePoints;
    this._graph = new VoronoiGraph("undirected");
    const [minX, maxX, minY, maxY] = this._getBorders();
    this._width = Math.abs(minX - maxX);
    this._height = Math.abs(minY - maxY);
  }

  private _getBorders(): [number, number, number, number] {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const vertex of this._graph.iter()) {
      minX = Math.min(vertex.data.coordinate.x, minX);
      maxX = Math.max(vertex.data.coordinate.x, maxX);
      minY = Math.min(vertex.data.coordinate.y, minY);
      maxY = Math.max(vertex.data.coordinate.y, maxY);
    }
    return [minX, maxX, minY, maxY];
  }

  private _generateBoundingBox() {
    const [minX, maxX, minY, maxY] = this._getBorders();

    const topLeftCoord: coordinate = { x: minX - this._padding, y: maxY + this._padding };
    const bottomLeftCoord: coordinate = { x: minX - this._padding, y: maxY + this._height + this._padding };

    const bottomRightCoord: coordinate = { x: maxX + this._padding, y: minY - this._padding };
    const topRightCoord: coordinate = { x: maxX + this._width + this._padding, y: minY - this._padding };

    const topLeftVertex = this._graph.addVertex(`@@voronoi bounding box@@`, { coordinate: topLeftCoord });
    const bottomLeftVertex = this._graph.addVertex(`@@voronoi bounding box@@`, { coordinate: bottomLeftCoord });
    const bottomRightVertex = this._graph.addVertex(`@@voronoi bounding box@@`, { coordinate: bottomRightCoord });
    const topRightVertex = this._graph.addVertex(`@@voronoi bounding box@@`, { coordinate: topRightCoord });

    this._graph.connect(topLeftVertex, bottomLeftVertex, { type: "bounding-box", distanceFromSites: 0 });
    this._graph.connect(bottomLeftVertex, bottomRightVertex, { type: "bounding-box", distanceFromSites: 0 });
    this._graph.connect(bottomRightVertex, topRightVertex, { type: "bounding-box", distanceFromSites: 0 });
    this._graph.connect(topRightVertex, topLeftVertex, { type: "bounding-box", distanceFromSites: 0 });
  }

  private _createPerpendicularBisector(siteA: coordinate, siteB: coordinate) {
    const chord = Math.sqrt(this._width ** 2 + this._height ** 2);
    const bisectorLine = new Line(siteA, siteB).rotate(Math.PI / 2).grow(chord * 2);
    const intersections = this._graph.intersectionCoordinate(bisectorLine);

    /** since this is a bisector the distance from both siteA and siteB is the same */
    const distanceFromSites = bisectorLine.distanceFromPoint(siteA);

    for (let i = 1; i < intersections.length; i++) {
      const prevIntersection = intersections[i - 1];
      const currentIntersection = intersections[i];

      const fromV = this._graph.insertVertex(prevIntersection.edge, {
        coordinate: prevIntersection.intersectionCoordinate,
      });

      const toV = this._graph.insertVertex(currentIntersection.edge, {
        coordinate: currentIntersection.intersectionCoordinate,
      });
      this._graph.connect(fromV, toV, { type: "inner-segmentation", distanceFromSites });
    }
  }

  private _removeExesBisectors(edge:IGraphEdge<IVoronoiVertex, IVoronoiEdge>) {
    if (edge.data.type === "bounding-box") return;
    const minValidDistance = edge.data.distanceFromSites;

    const edgeLine = new Line(edge.from.data.coordinate, edge.to.data.coordinate);

    let minDistance = Infinity;
    for (let i = 0; i < this._sitePoints.length; i++) {
      const currentSite = this._sitePoints[i];
      const distance = edgeLine.distanceFromPoint(currentSite)
      if(distance < minValidDistance){
        this._graph.disConnect(edge.id);
        return ;
      }
      minDistance = Math.min(distance, minDistance);
    }
    
  }

  generate: IVoronoi["generate"] = () => {
    this._generateBoundingBox();

    for (let i = 0; i < this._sitePoints.length; i++) {
      for (let j = i; j < this._sitePoints.length; j++) {
        const pointA = this._sitePoints[i];
        const pointB = this._sitePoints[j];
        this._createPerpendicularBisector(pointA, pointB);
      }
    }

    for (const edge of this._graph.EdgesIter()) this._removeExesBisectors(edge);
  };
}

export default Voronoi;
