import "./scss/main.scss";
import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/PathFinding";
import "boxicons";
import Stage from "@models/Stage";

const appElement = document.querySelector("#app")! as HTMLDivElement;

let stage = Stage.init(appElement);

let dds = new DijkstraVisualization();
// dds.speed = "slow"

stage.visualization = dds;

const body = $("body");

const btn = $("<button></button>")
  .text("start")
  .addClass("btn btn-primary")
  .click(() => {
    dds.start();
  });

const btn2 = $("<button></button>")
  .text("pause")
  .addClass("btn btn-primary")
  .click(() => {
    dds.pause();
  });

const btn3 = $("<button></button>")
  .text("step")
  .addClass("btn btn-primary")
  .click(() => {
    dds.step();
  });

const btn4 = $("<button></button>")
  .text("generate maze")
  .addClass("btn btn-primary")
  .click(() => {
    dds.generateRecursiveBacktrackingMaze();
  });

const btn5 = $("<button></button>")
  .text("toggle ruler")
  .addClass("btn btn-primary")
  .click(() => {
    dds.mainView.showRuler = !dds.mainView.showRuler;
  });


  const btn6 = $("<button></button>")
  .text("toggle grid")
  .addClass("btn btn-primary")
  .click(() => {
    dds.mainView.showGrid = !dds.mainView.showGrid;
  });



  const btn7 = $("<button></button>")
  .text("create new Grid")
  .addClass("btn btn-primary")
  .click(() => {
    dds.createGraph("randomized", {size:100});
  });


  
body.append(btn);
body.append(btn2);
body.append(btn3);
body.append(btn4);
body.append(btn5);
body.append(btn6);

body.append(btn7);