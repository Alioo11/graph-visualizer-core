import { NoneToVoidFunction, Nullable } from "ts-wiz";

export interface IAlgorithm {
  iter: () => Promise<void>;
  performFastForward: Nullable<NoneToVoidFunction>;
}
