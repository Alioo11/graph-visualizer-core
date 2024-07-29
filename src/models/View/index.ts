import TextUtil from "@utils/Text";
import type { IDataStructure } from "@_types/dataStructure";
import type { IView, IViewEventMap } from "@_types/view";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";

abstract class View<T> implements IView<T> {
  private documentRootRef: Nullable<HTMLDivElement> = null;
  abstract documentRef: Nullable<HTMLDivElement>;
  abstract dataStructure: IDataStructure<T>;
  abstract onReady: Nullable<NoneToVoidFunction>;
  protected _events = new Map<keyof IViewEventMap, Array<(data: any) => void>>();
  visible: boolean = true;
  documentRootId: string;

  constructor(){
    this.documentRootId = TextUtil.randomText(10);
  }

  protected createWrapperElement = (rootElement: HTMLDivElement) => {
    const documentRefElement = document.createElement("div");
    documentRefElement.setAttribute("id", this.documentRootId);
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
