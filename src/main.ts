import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/PathFinding";
import Stage from "@models/Stage";
import type { NoneToVoidFunction } from "ts-wiz";
import "./scss/main.scss";
import "boxicons";

const appElement = document.querySelector("#app")! as HTMLDivElement;

let stage = Stage.init(appElement);

let dds = new DijkstraVisualization();

stage.visualization = dds;

const body = $("body");

body.append($("<div></div>").attr("id", "btn-container").addClass("d-flex w-100 gap-1"));

const addBtn = (name: string, cb: NoneToVoidFunction) => {
  const btn = $("<button></button>").addClass("btn btn-primary").click(cb).text(name);
  $("#btn-container").append(btn);
};

addBtn("start", () => dds.start());
addBtn("pause", () => dds.pause());
addBtn("step", () => dds.step());
addBtn("generate maze", () => dds.generateRecursiveBacktrackingMaze());
addBtn("toggle ruler", () => (dds.mainView.showRuler = !dds.mainView.showRuler));
addBtn("toggle grid", () => (dds.mainView.showGrid = !dds.mainView.showGrid));
addBtn("create new Graph", () => dds.createGraph("randomized", { size: 100 }));
