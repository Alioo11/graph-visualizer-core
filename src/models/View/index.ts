import { DOCUMENT_ID_CONSTANTS } from "../../constants/DOM";
import type { IDataStructure } from "../../types/dataStructure";
import type { IView, IViewEventMap } from "../../types/view";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";

abstract class View<T> implements IView<T> {
  private documentRootRef: Nullable<HTMLDivElement> = null;
  abstract documentRef: Nullable<HTMLDivElement>;
  abstract dataStructure: IDataStructure<T>;
  abstract onReady: Nullable<NoneToVoidFunction>;
  private _events = new Map<keyof IViewEventMap, Array<(data: any) => void>>();
  visible: boolean = true;

  protected createWrapperElement = (rootElement: HTMLDivElement) => {
    const documentRefElement = document.createElement("div");
    documentRefElement.setAttribute("id", DOCUMENT_ID_CONSTANTS.VIEW.ROOT);
    documentRefElement.setAttribute("class", "view-container");

    this.documentRootRef = rootElement;
    this.documentRootRef.classList.add("view-root");

    this.documentRef = documentRefElement;
    this.documentRootRef.appendChild(documentRefElement);
  };

  init = (rootHTMLElement: HTMLDivElement) => {
    this.createWrapperElement(rootHTMLElement);
    this.onReady?.();
    this._events.get("ready")?.forEach((cb) => cb(this.documentRef));
  };

  toggleVisible = () => {
    this.visible = !this.visible;
  };

  on = <T extends keyof IViewEventMap>(eventType: T, callback: (data: IViewEventMap[T]) => void) => {
    const events = this._events.get(eventType) || [];
    this._events.set(eventType, [...events, callback]);
  };
}

export default View;
