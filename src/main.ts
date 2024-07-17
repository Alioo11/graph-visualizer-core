import "./scss/main.scss";
import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/PathFinding";
import "boxicons";
import Stage from "@models/Stage";
import wait from "@utils/wait";

const appElement = document.querySelector("#app")! as HTMLDivElement;

const stage = Stage.init(appElement);

let dds = new DijkstraVisualization();

stage.visualization = dds;

const body = $("body");

const iterThing = async () => {
  let goOne = true;
  while (goOne) {
    // if (Math.random() > 0.9)
    await wait(1);
    goOne = dds.algorithm.iter();
  }
};

const iterMaze = async () => {
  console.time();
  let goOne = true;
  while (goOne) {
    if (Math.random() > 0.99) await wait(1);
    goOne = dds.recursiveBacktrackingMazeGenerationAlgorithm.iter();
  }
  console.timeEnd();
};

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

body.append(btn);
body.append(btn2);
body.append(btn3);
body.append(btn4);

