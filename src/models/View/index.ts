import { IDataStructure } from '../../types/dataStructure';
import { IView } from '../../types/view';
import $ from 'jquery';
import type { NoneToVoidFunction, Nullable } from "ts-wiz";


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
    if(!this.documentRootRef) throw new Error("something wrong while initializing wrapper element view document ref is not valid")

    const myButton = $("<button>helo</button>").addClass("btn btn-sm btn-primary");
    $(this.documentRootRef).append(myButton)


    const visibilityToggleButton = document.createElement("button");
    visibilityToggleButton.textContent = "toggle";
    this.documentRootRef?.appendChild(visibilityToggleButton);
    visibilityToggleButton.addEventListener("click" , (e)=>{
      this.visible = !this.visible;
      if(this.documentRootRef) this.documentRootRef.style.width = this.visible ? "100%": "10px"
    })
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
