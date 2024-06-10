import Graph from ".";

type CoordinatedGraphVertexState = "blank" | "visited";

interface ICoordinatedGraphVertex {
  state: CoordinatedGraphVertexState;
  x: number;
  y: number;
}

interface ICoordinatedGraphEdge {
  wight: number;
}

class CoordinatedGraph extends Graph<
  ICoordinatedGraphVertex,
  ICoordinatedGraphEdge
> {

  addEvent= ()=>{}
}

export default CoordinatedGraph;
