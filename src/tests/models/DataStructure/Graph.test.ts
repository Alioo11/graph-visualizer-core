import { GraphType } from '@_types/dataStructure/graph';
import Graph from '@models/DataStructure/Graph';

// Helper function for creating vertices and edges in tests
function createGraphInstance() {
  return new Graph<string, string>('undirected');
}

describe('GraphVertex', () => {
  it('should create a vertex with the correct label and data', () => {
    const graph = createGraphInstance();
    const vertex = graph.addVertex('A', 'Data A');

    expect(vertex).toBeDefined();
    expect(vertex.label).toBe('A');
    expect(vertex.data).toBe('Data A');
  });
});

describe('GraphEdge', () => {
  it('should connect two vertices correctly', () => {
    const graph = createGraphInstance();
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');

    const edge = graph.connect(vertexA, vertexB, 'EdgeData');

    expect(edge).toBeDefined();
    expect(edge.data).toBe('EdgeData');
    expect(edge.from).toBe(vertexA);
    expect(edge.to).toBe(vertexB);
  });

  it('should not create duplicate edges between two vertices', () => {
    const graph = createGraphInstance();
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');

    const edge1 = graph.connect(vertexA, vertexB, 'EdgeData');
    const edge2 = graph.connect(vertexA, vertexB, 'EdgeData');

    expect(edge1).toBeDefined();
    expect(edge2).toBe(edge1); // Should be the same edge instance
  });
});

describe('Graph', () => {
  let graph: Graph<string, string>;

  beforeEach(() => {
    graph = createGraphInstance();
  });

  test('should add and retrieve vertices correctly', () => {
    const vertexA = graph.addVertex('A', 'Data A');
    expect(graph.getVertexById(vertexA.id)).toBe(vertexA);
  });

  test('should connect vertices and allow retrieval of the edge', () => {
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');

    const edge = graph.connect(vertexA, vertexB, 'EdgeData');
    expect(graph.getEdgeBetween(vertexA, vertexB)).toBe(edge);
  });

  test('should disconnect edges correctly', () => {
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');

    const edge = graph.connect(vertexA, vertexB, 'EdgeData');
    graph.disConnect(edge.id);

    expect(graph.getEdgeBetween(vertexA, vertexB)).toBe(null);
  });

  test('should remove vertices and associated edges', () => {
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');
    graph.connect(vertexA, vertexB, 'EdgeData');

    graph.removeVertex(vertexA.id);

    expect(graph.getVertexById(vertexA.id)).toBe(null);
    expect(graph.getEdgeBetween(vertexA, vertexB)).toBe(null);
  });

  test('should trigger events on adding vertices', () => {
    const addVertexCallback = jest.fn();
    graph.on('add-vertex', addVertexCallback);

    const vertexA = graph.addVertex('A', 'Data A');
    expect(addVertexCallback).toHaveBeenCalledWith(vertexA);
  });

  test('should trigger events on connecting vertices', () => {
    const connectCallback = jest.fn();
    graph.on('connect', connectCallback);

    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');
    const edge = graph.connect(vertexA, vertexB, 'EdgeData');

    expect(connectCallback).toHaveBeenCalledWith(edge);
  });

  test('should iterate through vertices and edges correctly', () => {
    const vertexA = graph.addVertex('A', 'Data A');
    const vertexB = graph.addVertex('B', 'Data B');
    graph.connect(vertexA, vertexB, 'EdgeData');

    const vertices = Array.from(graph.iter());
    const edges = Array.from(graph.EdgesIter());

    expect(vertices).toHaveLength(2);
    expect(edges).toHaveLength(1);
  });

  test('should return correct size', () => {
    expect(graph.size).toBe(0);

    const vertexA = graph.addVertex('A', 'Data A');
    expect(graph.size).toBe(1);

    graph.addVertex('B', 'Data B');
    expect(graph.size).toBe(2);
  });
});