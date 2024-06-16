import Stage from "@models/Stage";
import DijkstraVisualization from "@models/Visualization/Dijkstra";

import "./scss/main.scss";
import * as bootstrap from "bootstrap";
import $ from 'jquery'

//SECTION - init program
// const bodyElement = document.querySelector("body")!;
// const rootElement = document.createElement("div");
// rootElement.style.border = "solid 1px black";
// rootElement.style.width = "900px";
// rootElement.style.height = "500px";
// bodyElement.appendChild(rootElement);
//SECTION - init program


$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

const appElement = document.querySelector("#app")! as HTMLDivElement;

console.log("helo")

const stage = Stage.init(appElement);

const dds = new DijkstraVisualization();

stage.visualization = dds;

// stage.start();

// interface shit {
//   mam: Number;
//   dummy: string;
// }

// const f = new PriorityQueue<shit>((a,b) => a.mam>b.mam);

// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})

// f.pop();

// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})

// f.pop();

// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})
// f.push({mam:1 , dummy:"helo"})

// f.pop();


// f.push({mam:2 , dummy:"helo"})
// f.push({mam:2 , dummy:"helo"})

// f.pop();

// f.push({mam:1 , dummy:"helo"})


