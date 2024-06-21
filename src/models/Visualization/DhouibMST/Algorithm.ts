import { IAlgorithm } from "../../../types/algorithm";
import DhouibGraph from "@models/DataStructure/Graph/Dhouib";

class DhouibMST implements IAlgorithm {
  private graph:DhouibGraph;

  constructor(graph:DhouibGraph) {
    this.graph = graph;
  }

  iter = async () => {};

  performFastForward = null;
}


export default DhouibMST;