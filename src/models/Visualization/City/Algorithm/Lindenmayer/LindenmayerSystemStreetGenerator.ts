import CityGraph from "@models/DataStructure/Graph/City";
import CityGraphLindenmayerSystem from "@models/LinenmayerSystem/City";
import TensorField from "@models/TensorField";
import LindenmayerCharacterForwardPathRule from "./ForwardPathRule";
import type { ICityLindenmayerSystemCharacter } from "@_types/context/city";
import type { IAlgorithm } from "@_types/algorithm";

/** @description procedural city generation algorithm */
class LindenmayerSystemStreetGenerator implements IAlgorithm {
  reset: IAlgorithm["reset"] = () => {};
  performFastForward: IAlgorithm["performFastForward"] = () => {};
  graph: CityGraph;
  field: TensorField;
  LSystem: CityGraphLindenmayerSystem<ICityLindenmayerSystemCharacter>;

  constructor(graph: CityGraph, field: TensorField) {
    this.graph = graph;
    this.field = field;
    const axiom = this.createLSystemAxiom();
    this.LSystem = new CityGraphLindenmayerSystem(axiom);
  }

  createLSystemAxiom = () => {
    const initialVertex = this.graph.addVertex("axiom", { x: 0, y: 0 });
    const axiom = [
      new LindenmayerCharacterForwardPathRule(this.graph, this.field, initialVertex, { expansionRegion: 0 }),
      new LindenmayerCharacterForwardPathRule(this.graph, this.field, initialVertex, { expansionRegion: 1 }),
      new LindenmayerCharacterForwardPathRule(this.graph, this.field, initialVertex, { expansionRegion: 2 }),
      new LindenmayerCharacterForwardPathRule(this.graph, this.field, initialVertex, { expansionRegion: 3 }),
    ];
    return axiom;
  };


  iter: IAlgorithm["iter"] = () => {
    this.LSystem.iter();
    return true;
  };
}

export default LindenmayerSystemStreetGenerator;
