import $ from "jquery";
import stageLayoutMap from "./LayoutStrategy";
import ExecutionPhase from "@models/ExecutionPhase";
import type { Nullable } from "ts-wiz";
import type { IView } from "../../types/view";
import type { IStage, StageLayout } from "../../types/stage";
import type { IVisualization } from "../../types/visualization";

class Stage implements IStage {
  something = stageLayoutMap;
  documentRoot: HTMLDivElement;
  layout: StageLayout = "layout-1";
  fullScreenViewRef: Nullable<IView<unknown>> = null;
  private _status: ExecutionPhase;

  get status() {
    return this._status.phase;
  }

  get onStatus(){
    return this._status.on;
  }

  static instance: Nullable<Stage> = null;

  private _visualization: Nullable<IVisualization> = null;

  start = async () => {
    if (this._visualization == null) return;
    this._visualization.start();
  };

  private constructor(documentRoot: IStage["documentRoot"]) {
    this.documentRoot = documentRoot;
    this._status = ExecutionPhase.instance();
  }

  init() {
    if (!this._visualization) return;
    $(this.documentRoot).children().remove();
    const views = this.something.get("layout-1")?.initLayout(this.documentRoot, this._visualization.views.length);
    if (!views) throw new Error("Something went wrong while this");
    if (views.length !== this._visualization.views.length)
      throw new Error("mismatch between length of views and required length");
    for (let i = 0; i < views.length; i++) this._visualization.views[i].init(views[i]);
    this._status.update("prepared");
  }

  static init(documentRoot: IStage["documentRoot"]) {
    if (this.instance === null) this.instance = new Stage(documentRoot);
    this.instance.init()
    return this.instance;
  }

  get visualization() {
    return this._visualization;
  }

  set visualization(vis: IStage["visualization"]) {
    this._visualization = vis;
    this.init();
  }
}

export default Stage;
