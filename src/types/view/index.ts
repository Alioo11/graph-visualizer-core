import { NoneToVoidFunction, Nullable } from "ts-wiz";
import { IDataStructure } from "../dataStructure";

export interface IView<T> {
  documentRef: Nullable<HTMLDivElement>;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
  documentRootId: string;
  init: (documentRef: HTMLDivElement) => void;
  on: <T extends keyof IViewEventMap>(eventType: T, eventCb: (data: IViewEventMap[T]) => void) => void;
}

export interface IViewEventMap {
  "ready": HTMLDivElement;
}
