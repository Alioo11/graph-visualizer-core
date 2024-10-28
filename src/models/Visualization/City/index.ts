/** views */
import CityView from "./view";
/** models */
import TensorField from "@models/TensorField";
import RadialField from "@models/TensorField/RadialField";
import CityGraph from "@models/DataStructure/Graph/City";
import LindenmayerSystemStreetGenerator from "./Algorithm/Lindenmayer/LindenmayerSystemStreetGenerator";
import wait from "@utils/wait";
import NumberUtils from "@utils/Number";
/** types */
import type { NoneToVoidFunction } from "ts-wiz";
import type { IAlgorithm } from "@_types/algorithm";
import type { IVisualization } from "@_types/visualization";
import type { IView, viewEventMap } from "@_types/view";


class CityVisualization implements IVisualization {
  start: NoneToVoidFunction = () => {};
  views: IView<unknown, viewEventMap>[] = [];
  mainView: CityView;
  algorithm: IAlgorithm;
  field: TensorField;
  graph: CityGraph;

  constructor() {
    const someField = new TensorField();
      const field = new RadialField(10, 10);
      field.radius = 1000
      someField.addRadial(field)

    this.field = someField;

    const graph = new CityGraph('directed');
    this.graph = graph;
    const mainView = new CityView(graph, someField);
    const generator = new LindenmayerSystemStreetGenerator(graph, someField);
    this.algorithm = generator;
    this.views = [mainView];
    this.mainView = mainView;
  }

  run = async () => {
    for (let i = 0; i < 100; i++) {
      await wait(5);
      this.algorithm.iter();
    }
    console.log(Array.from(this.graph.iter()).length)
    console.log(Array.from(this.graph.EdgesIter()).length)
  };
}

export default CityVisualization;
