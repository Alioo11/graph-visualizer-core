import { IAlgorithm } from "@_types/algorithm";

/**
 * @description procedural city generation algorithm
 */
class ProceduralCityGenerationAlgorithm implements IAlgorithm {
  iter: IAlgorithm["iter"] = () => false;
  reset: IAlgorithm["reset"] = () => {};
  performFastForward: IAlgorithm["performFastForward"] = () => {};
}

export default ProceduralCityGenerationAlgorithm;
