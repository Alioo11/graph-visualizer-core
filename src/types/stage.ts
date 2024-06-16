import { Nullable } from "ts-wiz";
import { IView } from "./view";
import { IVisualization } from "./visualization";

export type StageLayout = "layout-1" | "layout-2";

/**
 * @description a singleton object that gives DOM access to views
 */
export interface IStage {
  documentRoot: HTMLDivElement;
  layout: StageLayout;
  fullScreenViewRef: Nullable<IView<unknown>>;
  visualization: Nullable<IVisualization>;
  start: () => Promise<void>;
}

export interface IStageLayoutStrategy {
  initLayout: (
    documentRef: HTMLDivElement,
    count: number
  ) => Array<HTMLDivElement>;
}
