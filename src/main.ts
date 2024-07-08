import "./scss/main.scss";
import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/PathFinding";
import "boxicons";
import Stage from "@models/Stage";
import wait from "@utils/wait";

const appElement = document.querySelector("#app")! as HTMLDivElement;

const stage = new Stage(appElement);

let dds = new DijkstraVisualization({});

stage.visualization = dds;

const body = $("body");

const iterThing = async () => {
  let goOne = true;
  while (goOne) {
    await wait(1);
    goOne = dds.algorithm.iter();
  }
};

const btn = $("<button></button>")
  .text("start")
  .addClass("btn btn-primary")
  .click(() => {
    iterThing();
  });

const btn2 = $("<button></button>")
  .text("reset")
  .addClass("btn btn-danger")
  .click(() => {
    // $("#app").children().remove();
    const newStage = new Stage(appElement);
    dds = new DijkstraVisualization({ width: 100, height: 100 , entry:[0,0] , targetPoints:[[10 , 10],[50 , 50],[20 , 10]] });
    dds.width = 100
    dds.height = 200
    newStage.visualization = dds;

  });

body.append(btn);
body.append(btn2);
