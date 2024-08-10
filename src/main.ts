import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/Dijkstra";
import Stage from "@models/Stage";
import type { NoneToVoidFunction } from "ts-wiz";
import "./scss/main.scss";
import "boxicons";
import wait from "@utils/wait";
import NumberUtils from "@utils/Number";

const appElement = document.querySelector("#app")! as HTMLDivElement;

let stage = Stage.init(appElement);

let vis = new DijkstraVisualization();
vis.mainView.on("ready", () => {
  vis.mainView.translateTo(0,0)
});


stage.visualization = vis;

const body = $("body");

body.append($("<div></div>").attr("id", "btn-container").addClass("d-flex w-100 gap-1"));

const addBtn = (name: string, cb: NoneToVoidFunction) => {
  const btn = $("<button></button>").addClass("btn btn-primary").click(cb).text(name);
  $("#btn-container").append(btn);
};

vis.speed = "slow";

const doSomething = async () => {
  const someRandomCoords = Array.from(new Array(100).keys()).map((i) => [
    NumberUtils.randomNumberBetween(-5000, 5000),
    NumberUtils.randomNumberBetween(-5000, 5000),
  ]);
  for (let value of someRandomCoords) {
    vis.mainView.translateTo(value[0], value[1]);
    await wait(2000);
    
  }
};

addBtn("start", () => vis.start());
addBtn("pause", () => vis.pause());
addBtn("step", () => vis.step());
addBtn("generate maze", () => {
  vis.speed = "normal";
  vis.generateRecursiveBacktrackingMaze();
  // dds.speed = "slow";
});
addBtn("toggle ruler", () => (vis.mainView.showRuler = !vis.mainView.showRuler));
addBtn("toggle grid", () => (vis.mainView.showGrid = !vis.mainView.showGrid));
addBtn("toggle grid", doSomething);
addBtn("rand", () => vis.createGraph("randomized" , {size:2000}));

vis.graph.onDijkstra("edge-change" , (e)=>{
  const [x, y] = [e.from.data.x, e.from.data.y];
  vis.mainView.translateTo(x,y, 300)
})