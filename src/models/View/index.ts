import { IDataStructure, IView } from "../../types";

class View<T> implements IView<T> {
  documentRef: HTMLDivElement;
  visible: boolean = true;
  dataStructure: IDataStructure<T>;
  constructor(
    documentRef: IView<T>["documentRef"],
    dataStructure: IDataStructure<T>
  ) {
    this.documentRef = documentRef;
    this.dataStructure = dataStructure;
  }
  toggleVisible = () => {
    this.visible = !this.visible;
  };
}


export default View;