import { IVoronoiVertex, IVoronoiEdge } from '@_types/context/voronoi';
import Line from '@models/Line';
import VoronoiGraph from '@models/DataStructure/Graph/Voronio';

describe('VoronoiGraph', () => {
  let voronoiGraph: VoronoiGraph;
  const edgeData: IVoronoiEdge = { distanceFromSites: 1, type: 'inner-segmentation' };
  const vertexData1: IVoronoiVertex = { coordinate: { x: 0, y: 0 } };
  const vertexData2: IVoronoiVertex = { coordinate: { x: 5, y: 5 } };
  const vertexData3: IVoronoiVertex = { coordinate: { x: 10, y: 10 } };

  beforeEach(() => {
    voronoiGraph = new VoronoiGraph('directed');
  });

  describe('Adding and Removing Vertices', () => {
    it('should add a vertex and retrieve it by ID', () => {
      const vertex = voronoiGraph.addVertex('vertex1', vertexData1);
      const retrievedVertex = voronoiGraph.getVertexById(vertex.id);
      expect(retrievedVertex).toBe(vertex);
    });

    it('should remove a vertex and no longer retrieve it by ID', () => {
      const vertex = voronoiGraph.addVertex('vertex2', vertexData2);
      voronoiGraph.removeVertex(vertex.id);
      expect(voronoiGraph.getVertexById(vertex.id)).toBeNull();
    });
  });

  describe('Connecting and Disconnecting Edges', () => {
    it('should connect two vertices and retrieve the edge by its ID', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      const edge = voronoiGraph.connect(vertex1, vertex2, edgeData);

      expect(edge.from).toBe(vertex1);
      expect(edge.to).toBe(vertex2);
      expect(voronoiGraph.getEdgeBetween(vertex1, vertex2)).toBe(edge);
    });

    it('should disconnect an edge and no longer retrieve it between two vertices', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      const edge = voronoiGraph.connect(vertex1, vertex2, edgeData);

      voronoiGraph.disConnect(edge.id);
      expect(voronoiGraph.getEdgeBetween(vertex1, vertex2)).toBeNull();
    });
  });

  describe('Intersection Calculation Between Line and Voronoi Edges', () => {
    it('should return intersections when a line intersects with an edge', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      const edge = voronoiGraph.connect(vertex1, vertex2, edgeData);

      const line = new Line({ x: 0, y: 0 }, { x: 5, y: 5 });
      const intersections = voronoiGraph.intersectionCoordinate(line);

      expect(intersections.length).toBeGreaterThan(0);
      expect(intersections[0].edge).toBe(edge);
      expect(intersections[0].intersectionCoordinate).toEqual({ x: 2.5, y: 2.5 });
    });

    it('should return no intersections if the line does not intersect any edges', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      voronoiGraph.connect(vertex1, vertex2, edgeData);

      const line = new Line({ x: 6, y: 6 }, { x: 8, y: 8 });
      const intersections = voronoiGraph.intersectionCoordinate(line);

      expect(intersections).toHaveLength(0);
    });
  });

  describe('Edge Cases for Intersection Calculations', () => {
    it('should handle parallel edges without intersection', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      const edge = voronoiGraph.connect(vertex1, vertex2, edgeData);

      const parallelLine = new Line({ x: 0, y: 1 }, { x: 5, y: 6 });
      const intersections = voronoiGraph.intersectionCoordinate(parallelLine);

      expect(intersections).toHaveLength(0); // Should not intersect
    });

    it('should handle case where intersection is exactly at an edge endpoint', () => {
      const vertex1 = voronoiGraph.addVertex('vertex1', vertexData1);
      const vertex2 = voronoiGraph.addVertex('vertex2', vertexData2);
      const edge = voronoiGraph.connect(vertex1, vertex2, edgeData);

      const lineThroughEndpoint = new Line({ x: 0, y: 0 }, { x: 1, y: 1 });
      const intersections = voronoiGraph.intersectionCoordinate(lineThroughEndpoint);

      expect(intersections).toHaveLength(1);
      expect(intersections[0].intersectionCoordinate).toEqual(vertex1.data.coordinate);
    });
  });

  describe('Radius-Based Vertex Count Retrieval', () => {
    it('should return the correct vertex count within a radius', () => {
      voronoiGraph.addVertex('vertex1', vertexData1);
      voronoiGraph.addVertex('vertex2', vertexData2);
      voronoiGraph.addVertex('vertex3', vertexData3);

      const vertexCount = voronoiGraph.getVertexCountByRadius({ x: 0, y: 0 }, 8);
      expect(vertexCount).toBe(2); // Only vertex1 and vertex2 are within radius 8
    });

    it('should return zero if no vertices are within the radius', () => {
      voronoiGraph.addVertex('vertex3', vertexData3);
      const vertexCount = voronoiGraph.getVertexCountByRadius({ x: 0, y: 0 }, 3);
      expect(vertexCount).toBe(0);
    });
  });

  describe('Real world Example', () => {
    it('should return the correct', () => {
      /** create the bounding box */
      const v1 = voronoiGraph.addVertex("v1", { coordinate: { x: 0, y: 0 } });
      const v2 = voronoiGraph.addVertex("v2", { coordinate: { x: 0, y: 10 } });
      const v3 = voronoiGraph.addVertex("v3", { coordinate: { x: 10, y: 10 } });
      const v4 = voronoiGraph.addVertex("v4", { coordinate: { x: 10, y: 0 } });
      voronoiGraph.connect(v1, v2, { type: "bounding-box", distanceFromSites: 0 });
      voronoiGraph.connect(v2, v3, { type: "bounding-box", distanceFromSites: 0 });
      voronoiGraph.connect(v3, v4, { type: "bounding-box", distanceFromSites: 0 });
      voronoiGraph.connect(v4, v1, { type: "bounding-box", distanceFromSites: 0 });

      /** simple line collisions */
      const line1 = new Line({ x: 0, y: 0 }, { x: 10, y: 10 });
      const line2 = new Line({ x: 0, y: 5 }, { x: 10, y: 5 });
      const line3 = new Line({ x: -5, y: 5 }, { x: 15, y: 5 });
      const line4 = new Line({ x: 5, y: -5 }, { x: 5, y: 15 });
      expect(voronoiGraph.intersectionCoordinate(line1)).toHaveLength(4);
      expect(voronoiGraph.intersectionCoordinate(line2)).toHaveLength(2);
      expect(voronoiGraph.intersectionCoordinate(line3)).toHaveLength(2);
      expect(voronoiGraph.intersectionCoordinate(line4)).toHaveLength(2);

      /** outside lines */
      const line5 = new Line({ x: 100, y: 5 }, { x: 100, y: 10 });
      expect(voronoiGraph.intersectionCoordinate(line5)).toHaveLength(0);

      /** diagonal line collisions */
      const line6 = new Line({ x: 5, y: 5 }, { x: 5, y: 100 });
      expect(voronoiGraph.intersectionCoordinate(line6)).toHaveLength(1);

      const line7 = new Line({ x: 5, y: -5 }, { x: 15, y: 5 });
      expect(voronoiGraph.intersectionCoordinate(line7)).toHaveLength(2);

      const line8 = new Line({ x: 5, y: -5 }, { x: -5, y: 5 });
      expect(voronoiGraph.intersectionCoordinate(line8)).toHaveLength(2);

    });
  });

});