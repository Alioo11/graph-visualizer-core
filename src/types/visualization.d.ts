interface IVisualization {
  algorithm: IAlgorithm;
  start: NoneToVoidFunction;
  views: Array<IView<unknown>>;
}
