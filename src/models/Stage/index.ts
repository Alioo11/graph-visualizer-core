import { Nullable } from "ts-wiz";
import { IStage, IView, IVisualization, StageLayout } from "../../types";

class Stage implements IStage {
  static self: Nullable<Stage> = null;
  documentRoot: HTMLDivElement;
  layout: StageLayout = "layout-1";
  fullScreenViewRef: Nullable<IView<unknown>> = null;
  visualization: Nullable<IVisualization> = null;

  start = async () => {
    if (this.visualization == null) return;
    await this.visualization.algorithm.iter(); //! TODO implement the thing
  };

  private constructor(documentRoot: IStage["documentRoot"]) {
    this.documentRoot = documentRoot;
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