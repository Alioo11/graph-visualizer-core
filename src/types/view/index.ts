import { NoneToVoidFunction, Nullable } from "ts-wiz";
import { IDataStructure } from "@_types/dataStructure";


export interface viewEventMap {
  "ready": HTMLDivElement;
}

export interface IView<T, E extends viewEventMap> {
  documentRef: Nullable<HTMLDivElement>;
  visible: boolean;
  dataStructure: IDataStructure<T>;
  toggleVisible: NoneToVoidFunction;
  documentRootId: string;
  init: (documentRef: HTMLDivElement) => void;
  on: <T extends keyof E>(eventType: T, eventCb: (data: E[T]) => void) => void;
}
