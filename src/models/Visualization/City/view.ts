import InfiniteCanvasView from "@models/View/InfiniteCanvasView";
import CityGraph from "@models/DataStructure/Graph/City";
import type { Nullable, NoneToVoidFunction } from "ts-wiz";
import type { IDataStructure } from "@_types/dataStructure";
import type { infiniteCanvasEventMap } from "@_types/view/infiniteCanvas";
import type TensorField from "@models/TensorField";
import CityVisualizerDOMHelper from "@helpers/DOM/cityVisualizerView";

class CityView extends InfiniteCanvasView<unknown, infiniteCanvasEventMap> {
  documentRef: Nullable<HTMLDivElement> = null;
  dataStructure: IDataStructure<unknown> = new CityGraph("undirected");
  field: TensorField;
  CityDOMHelper: CityVisualizerDOMHelper;

  private _showTensorField: boolean = true;

  onReady: Nullable<NoneToVoidFunction> = () => {};

  get showTenserField() {
    return this._showTensorField;
  }

  set showTenserField(newValue: boolean) {
    this._showTensorField = newValue;
    if(this.showTenserField){
      if (this._zoom) this.CityDOMHelper.renderTensorField(this._zoom);
    }else{
      this.CityDOMHelper.removeTensorFields();
    }
  }

  constructor(graph: CityGraph, tensorField: TensorField) {
    super();
    this.CityDOMHelper = new CityVisualizerDOMHelper(this);
    this.dataStructure = graph;
    this.field = tensorField;
    this.initiateEvents();
  }


  initiateEvents() {
    this.on("zoom", (e) => this.CityDOMHelper.renderTensorField(e));
  }
}

export default CityView;
