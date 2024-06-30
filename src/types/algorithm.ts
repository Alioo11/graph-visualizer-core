import { NoneToVoidFunction, Nullable } from "ts-wiz";

export interface IAlgorithm {
  iter: () => Promise<any>;
  performFastForward: Nullable<NoneToVoidFunction>;
}
