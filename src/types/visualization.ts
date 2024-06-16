import { NoneToVoidFunction } from "ts-wiz";
import { IAlgorithm } from "./algorithm";
import { IView } from "./view";

export interface IVisualization {
  algorithm: IAlgorithm;
  start: NoneToVoidFunction;
  views: Array<IView<unknown>>;
}
