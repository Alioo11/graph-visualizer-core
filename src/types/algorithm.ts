import { NoneToVoidFunction, Nullable } from "ts-wiz";

export interface IAlgorithm {
  iter: () => boolean;
  performFastForward: Nullable<NoneToVoidFunction>;
}
