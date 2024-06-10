import { IStageLayoutStrategy, StageLayout } from "../../types";

class layout1Strategy implements IStageLayoutStrategy {
  initLayout = (documentRef: HTMLDivElement , count:number) => {
    documentRef.classList.add("stage-layout1-root");

    const divs = Array.from(Array(count).keys()).map(key => {
     const div=  document.createElement("div")
     div.classList.add("stage-layout1-child")
     return div
    });
    divs.forEach((div) => documentRef.appendChild(div));


    return divs;
  };
}

class layout2Strategy implements IStageLayoutStrategy {
  initLayout = (documentRef: HTMLDivElement, count:number) => [];
}

const stageLayoutMap = new Map<StageLayout, IStageLayoutStrategy>();

stageLayoutMap.set("layout-1", new layout1Strategy());
stageLayoutMap.set("layout-2", new layout2Strategy());

export default stageLayoutMap;
