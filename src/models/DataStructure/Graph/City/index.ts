import type { ICityRoadGraphEdge, ICityRoadGraphVertex } from "@_types/context/city";
import Graph from "@models/DataStructure/Graph";

class CityGraph extends Graph<ICityRoadGraphVertex, ICityRoadGraphEdge> {
}

export default CityGraph;
