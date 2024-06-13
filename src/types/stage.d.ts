type StageLayout = "layout-1" | "layout-2";

/**
 * @description a singleton object that gives DOM access to views
 */
interface IStage {
  documentRoot: HTMLDivElement;
  layout: StageLayout;
  fullScreenViewRef: Nullable<IView>;
  visualization: Nullable<IVisualization>;
  start: () => Promise<void>;
}

interface IStageLayoutStrategy {
  initLayout: (
    documentRef: HTMLDivElement,
    count: number
  ) => Array<HTMLDivElement>;
}
