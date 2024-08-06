import { NoneToVoidFunction, ValueOf } from "ts-wiz";
import { IAlgorithm } from "./algorithm";
import { IView, viewEventMap } from "./view";

export interface IVisualization {
  algorithm: IAlgorithm;
  views: Array<IView<unknown , viewEventMap>>;
  start: NoneToVoidFunction;
}

export type VisualizationSpeed = "slow" | "normal" | "fast";
