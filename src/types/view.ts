import { NoneToVoidFunction, Nullable } from "ts-wiz";
import { IDataStructure } from "./dataStructure";

export interface IView<T> {
  documentRef: Nullable<HTMLDivElement>;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
  init: (documentRef: HTMLDivElement) => void;
}
