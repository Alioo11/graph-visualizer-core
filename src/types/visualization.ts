import { NoneToVoidFunction, ValueOf } from "ts-wiz";
import { IAlgorithm } from "./algorithm";
import { IView } from "./view";

/** @description `IVisualizationStatusMap` maps visualization status-code into a readable status */
export interface IVisualizationStatusMap {
  10: "initialized";

  20: "preparing";
  21: "prepared";

  30: "visualization-in-progress";
  31: "visualization-done";
}

export interface IVisualization {
  algorithm: IAlgorithm;
  start: NoneToVoidFunction;
  views: Array<IView<unknown>>;
}

export interface IVisualizationEventMap {
  "status-change": IVisualizationStatusMap[keyof IVisualizationStatusMap];
}