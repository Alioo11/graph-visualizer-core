import "./scss/main.scss";
import { Stage } from ".";
import $ from "jquery";
import DijkstraVisualization from "@models/Visualization/Dijkstra";
import 'boxicons'

const appElement = document.querySelector("#app")! as HTMLDivElement;

const stage = Stage.init(appElement);

const dds = new DijkstraVisualization();

stage.visualization = dds;

const body = $("body");

const btn = $("<button></button>")
  .text("click")
  .addClass("btn btn-primary")
  .click(() => {
    dds.ff();
    dds.start();
  });


body.append(btn);
