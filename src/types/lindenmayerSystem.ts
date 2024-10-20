import { NoneToVoidFunction } from "ts-wiz";
import CityGraph from "@models/DataStructure/Graph/City";
import { ICityRoadGraphEdge, ICityRoadGraphVertex } from "./context/city";
import { IGraphVertex } from "./dataStructure/graph";
import TensorField from "@models/TensorField";

interface ICityGraphLindenmayerSystemCharacter<T> {
  graph: CityGraph;
  vertex: IGraphVertex<ICityRoadGraphVertex, ICityRoadGraphEdge>;
  tensorField: TensorField;
  data: T;
  perform: (generation: number) => Array<ICityGraphLindenmayerSystemCharacter<T>>;
}

interface ICityGraphLindenmayerSystem<T> {
  iter: NoneToVoidFunction;
  generation: number;
}

export { ICityGraphLindenmayerSystemCharacter, ICityGraphLindenmayerSystem };
