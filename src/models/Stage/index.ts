import { Nullable } from "ts-wiz";
import stageLayoutMap from "./LayoutStrategy";
import { IStage, StageLayout } from "../../types/stage";
import { IView } from "../../types/view";
import { IVisualization } from "../../types/visualization";

class Stage implements IStage {
  something = stageLayoutMap;
  static self: Nullable<Stage> = null;
  documentRoot: HTMLDivElement;
  layout: StageLayout = "layout-1";
  fullScreenViewRef: Nullable<IView<unknown>> = null;
  private _visualization: Nullable<IVisualization> = null;


  private _cleanDocumentRoot = ()=>{
    while(this.documentRoot.hasAttribute){
      this.documentRoot.removeAttribute(this.documentRoot.attributes[0].name);
    }
    while(this.documentRoot.firstChild){
      this.documentRoot.removeChild(this.documentRoot.firstChild);
    }
  }

  start = async () => {
    if (this._visualization == null) return;
    this._visualization.start();
    // await this._visualization.algorithm.iter(); //! TODO implement the thing
  };

  private constructor(documentRoot: IStage["documentRoot"]) {
    this.documentRoot = documentRoot;
  }

  init() {
    if(!this._visualization) return 
    const views = this.something.get("layout-1")?.initLayout(this.documentRoot , this._visualization.views.length);
    if(!views) throw new Error("Something went wrong while this")
    if(views.length !== this._visualization.views.length) throw new Error("mismatch between length of views and required length");
    for (let i  = 0 ; i< views.length ; i++){
      this._visualization.views[i].init(views[i])
    }
  }

  get visualization() {
    return this._visualization;
  }

  set visualization(vis: IStage["visualization"]) {
    this._visualization = vis;
    this.init();
  }

  static init(documentRoot: IStage["documentRoot"]) {
    if (this.self === null) {
      this.self = new Stage(documentRoot);
      return this.self;
    } else {
      return this.self;
    }
  }
}


export default Stage;