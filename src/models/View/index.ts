import { NoneToVoidFunction, Nullable } from "ts-wiz";
import { IDataStructure, IView } from "../../types";

abstract class View<T> implements IView<T> {
  private documentRootRef: Nullable<HTMLDivElement> = null;
  abstract documentRef: Nullable<HTMLDivElement>;
  visible: boolean = true;
  abstract dataStructure: IDataStructure<T>;

  abstract onReady: Nullable<NoneToVoidFunction>;

  private createWrapperElement = (rootElement: HTMLDivElement) => {
    const documentRefElement = document.createElement("div");
    documentRefElement.setAttribute("id", "element");
    documentRefElement.setAttribute("class" , "view-container")

    this.documentRootRef = rootElement;
    this.documentRootRef.classList.add("view-root")

    this.documentRef = documentRefElement;
    this.documentRootRef.appendChild(documentRefElement);
  };

  private initializeWrapperElements = () => {
    const visibilityToggleButton = document.createElement("button");
    visibilityToggleButton.textContent = "toggle";
    this.documentRootRef?.appendChild(visibilityToggleButton);
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
