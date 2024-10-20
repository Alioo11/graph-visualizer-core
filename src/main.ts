import $ from "jquery";
import Stage from "@models/Stage";
import type { NoneToVoidFunction } from "ts-wiz";
import "./scss/main.scss";
import "boxicons";
import CityVisualization from "@models/Visualization/City";


const appElement = document.querySelector("#app")! as HTMLDivElement;

let stage = Stage.init(appElement);

let vis = new CityVisualization();


stage.visualization = vis;

const body = $("body");

body.append($("<div></div>").attr("id", "btn-container").addClass("d-flex flex-wrap w-100 gap-1 bg-light p-3")).css("height","300px");

const addBtn = (name: string, cb: NoneToVoidFunction) => {
  const btn = $("<button></button>").addClass("btn btn-primary px-3").css("width","fit-content").click(cb).text(name);
  $("#btn-container").append(btn);
};


addBtn("start", () => (vis.mainView.showGrid = false));
addBtn("toggle ruler", () => (vis.mainView.showRuler = false));
addBtn("toggle tensor field", () => (vis.mainView.showTenserField =  !vis.mainView.showTenserField ));
addBtn("run", () => vis.run());

// addBtn("toggle grid", () => (vis.mainView.showGrid = !vis.mainView.showGrid));
// addBtn("toggle grid", doSomething);
// addBtn("rand", () => vis.createGraph("randomized" , {size:2000}));