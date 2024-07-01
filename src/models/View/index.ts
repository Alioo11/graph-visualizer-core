import type { IDataStructure } from "../../types/dataStructure";
import type { IView } from "../../types/view";
import type { NoneToVoidFunction, Nullable } from "ts-wiz";

abstract class View<T> implements IView<T> {
  private documentRootRef: Nullable<HTMLDivElement> = null;
  abstract documentRef: Nullable<HTMLDivElement>;
  visible: boolean = true;
  abstract dataStructure: IDataStructure<T>;

  abstract onReady: Nullable<NoneToVoidFunction>;

  protected createWrapperElement = (rootElement: HTMLDivElement) => {
    const documentRefElement = document.createElement("div");
    documentRefElement.setAttribute("id", "element");
    documentRefElement.setAttribute("class", "view-container");

    this.documentRootRef = rootElement;
    this.documentRootRef.classList.add("view-root");

    this.documentRef = documentRefElement;
    this.documentRootRef.appendChild(documentRefElement);
  };

  protected initializeWrapperElements = () => {
    if (!this.documentRootRef)
      throw new Error(
        `something wrong while initializing wrapper element got ${this.documentRootRef} but expected a document element.`
      );
    const visibilityToggleButton = document.createElement("button");
  };

  init = (rootHTMLElement: HTMLDivElement) => {
    this.createWrapperElement(rootHTMLElement);
    this.initializeWrapperElements();
    this.onReady?.();
  };

  toggleVisible = () => {
    this.visible = !this.visible;
  };
}

export default View;
