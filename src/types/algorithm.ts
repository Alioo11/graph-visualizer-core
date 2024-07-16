import { NoneToVoidFunction, Nullable } from "ts-wiz";

export interface IAlgorithm {
  iter: () => boolean;
  reset: NoneToVoidFunction;
  performFastForward: Nullable<NoneToVoidFunction>;
}
