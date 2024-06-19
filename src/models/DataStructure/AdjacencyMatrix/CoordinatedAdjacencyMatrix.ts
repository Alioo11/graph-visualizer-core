import AdjacencyMatrix from ".";
import { ICoordinatedGraphEdge, ICoordinatedGraphVertex } from "../../../types/graph";

class CoordinatedAdjacencyMatrix extends AdjacencyMatrix<ICoordinatedGraphVertex, ICoordinatedGraphEdge> {}

export default CoordinatedAdjacencyMatrix;
