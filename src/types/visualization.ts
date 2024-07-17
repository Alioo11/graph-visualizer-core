import { NoneToVoidFunction, ValueOf } from "ts-wiz";
import { IAlgorithm } from "./algorithm";
import { IView } from "./view";

export interface IVisualization {
  algorithm: IAlgorithm;
  views: Array<IView<unknown>>;
  start: NoneToVoidFunction;
}

export type VisualizationSpeed = "slow" | "normal" | "fast";
