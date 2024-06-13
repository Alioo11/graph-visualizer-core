interface IView<T> {
  documentRef: Nullable<HTMLDivElement>;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
  init: (documentRef: HTMLDivElement) => void;
}
