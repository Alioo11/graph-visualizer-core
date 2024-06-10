import { NoneToVoidFunction, Nullable } from "ts-wiz";
import CoordinatedGraph from "../../Graph/Coordinated";
import View from "../../View";

class DijkstraMainView extends View<unknown> {
  dataStructure: CoordinatedGraph;
  documentRef: Nullable<HTMLDivElement> = null;
  constructor(dataStructure: CoordinatedGraph) {
    super();
    this.dataStructure = dataStructure;
    this.setEvents();
  }

  onReady: Nullable<NoneToVoidFunction> = () => {
    const div = document.createElement("div");
    div.style.border = "solid 1px red";
    div.style.width = "200px";
    div.style.height = "200px";
    this.documentRef?.appendChild(div);
  };

  setEvents = () => {
    this.dataStructure.on("add-vertex", (e) => {
      console.log("a new vertex with added", e.label);
      // if(this.documentRef) this.documentRef.style.background = "red";
    });
  };
}

export default DijkstraMainView;
