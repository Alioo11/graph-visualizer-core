import TextUtil from "@utils/Text";
import type { IDataStructure } from "@_types/dataStructure";
import type { IView, viewEventMap } from "@_types/view";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";
import EventManager from "@models/EventManager";

abstract class View<T,E extends viewEventMap> implements IView<T,E> {
  private documentRootRef: Nullable<HTMLDivElement> = null;
  abstract documentRef: Nullable<HTMLDivElement>;
  abstract dataStructure: IDataStructure<T>;
  abstract onReady: Nullable<NoneToVoidFunction>;
  protected _events: EventManager<E> =  new EventManager<E>();

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
    if(!this.documentRef) throw new Error(`inconsistent state: expected document ref to be <HTMLDivElement> but got ${this.documentRef}`);
    this.createWrapperElement(rootHTMLElement);
    this.onReady?.();
    this._events.call("ready", this.documentRef);
  };

  toggleVisible = () => {
    this.visible = !this.visible;
  };

  on:EventManager<E>["on"] = (eventType , cb)=>{
    this._events.on(eventType , cb);
  }
}

export default View;
