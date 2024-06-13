interface IAlgorithm {
  iter: () => Promise<void>;
  performFastForward: Nullable<NoneToVoidFunction>;
}
