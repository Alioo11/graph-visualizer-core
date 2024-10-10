/** views */
import ProceduralCityGenerationAlgorithm from "./Algorithm/PCG";
import CityView from "./view";
/** models */
import TensorField from "@models/TensorField";
import RadialField from "@models/TensorField/RadialField";
import CityGraph from "@models/DataStructure/Graph/City";
/** types */
import type { NoneToVoidFunction } from "ts-wiz";
import type { IAlgorithm } from "@_types/algorithm";
import type { IVisualization } from "@_types/visualization";
import type { IView, viewEventMap } from "@_types/view";


class CityVisualization implements IVisualization {
  start: NoneToVoidFunction = () => {};
  views: IView<unknown, viewEventMap>[] = [];
  mainView: CityView;
  algorithm: IAlgorithm = new ProceduralCityGenerationAlgorithm();
  field: TensorField;

  constructor() {
    const someOtherRadialField = new RadialField(10, 0);
    someOtherRadialField.radius = 90;

    const someOtherRadialField2 = new RadialField(-10, 0);
    someOtherRadialField2.radius = 90;

    const someOtherRadialField3 = new RadialField(0, 10);
    someOtherRadialField3.radius = 90;

    const someOtherRadialField4 = new RadialField(0, -10);
    someOtherRadialField4.radius = 90;

    const someField = new TensorField();
    // someField.addRadial(someOtherRadialField);
    someField.addRadial(someOtherRadialField);
    someField.addRadial(someOtherRadialField2);
    someField.addRadial(someOtherRadialField3);
    someField.addRadial(someOtherRadialField4);

    this.field = someField;
    const graph = new CityGraph("undirected");
    const mainView = new CityView(graph, someField);
    this.views = [mainView];
    this.mainView = mainView;
  }
}

export default CityVisualization;
