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
  const {x,y} = vis.graph.entry.data
  vis.mainView.translateTo(x,y)
  vis.mainView.on("vertex-click" , (v)=>{
    console.log(v)
  })
});


stage.visualization = vis;

const body = $("body");

body.append($("<div></div>").attr("id", "btn-container").addClass("d-flex flex-wrap w-100 gap-1 bg-light p-3")).css("height","300px");

const addBtn = (name: string, cb: NoneToVoidFunction) => {
  const btn = $("<button></button>").addClass("btn btn-primary px-3").css("width","fit-content").click(cb).text(name);
  $("#btn-container").append(btn);
};

vis.speed ="fast";

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
  vis.speed = "fast";
  vis.generateRecursiveBacktrackingMaze();
  // dds.speed = "slow";
});
addBtn("toggle ruler", () => (vis.mainView.showRuler = !vis.mainView.showRuler));
addBtn("toggle grid", () => (vis.mainView.showGrid = !vis.mainView.showGrid));
addBtn("toggle grid", doSomething);
addBtn("rand", () => vis.createGraph("randomized" , {size:2000}));

// class Router<T> {
//   private _routeTree: T;
//   private _current: unknown;

//   goto(cb: (route: T) => Object | string) {
//     this._current = cb(this._routeTree);
//     return this;
//   }

//   constructor(routeTree: T) {
//     const hasCircularReference = this._hasCircularReference(routeTree);
//     if (hasCircularReference) throw new Error('invalid route tree: the provided route tree has circular reference');
//     this._routeTree = routeTree;
//     this._current = routeTree;
//   }
//   private _hasCircularReference(obj: T): boolean {
//     const visited = new Set();

//     function detect(obj: any): boolean {
//       if (obj && typeof obj === "object") {
//         if (visited.has(obj)) return true;
//         visited.add(obj);

//         for (const key in obj) {
//           if (Object.prototype.hasOwnProperty.call(obj, key)) {
//             if (detect(obj[key])) {
//               return true;
//             }
//           }
//         }
//         visited.delete(obj);
//       }
//       return false;
//     }

//     return detect(obj);
//   }

//   back() {
//     const root = this._routeTree as string | Object;
//     let currentRoute = this._current;

//     // Edge case: if the current route is the root, there's no parent to go back to
//     if (currentRoute === root) return this;

//     const visitStack = new Stack<Object | string>();
//     visitStack.push(root);

//     while (visitStack.length > 0) {
//       const topOfStack =  visitStack.top();
//       const isDeadEnd = typeof topOfStack === "string";

//       if(isDeadEnd){
//         currentRoute = visitStack.pop();
//         continue;
//       }else{

//       }

//       const [node, parent] = visitStack.pop() as [Object | string, Nullable<Object | string>];

//       // If we found the current route, set _current to its parent and return
//       if (node === currentRoute) {
//         this._current = parent || root; // if there's no parent, _current becomes the root
//         return this;
//       }

//       // Traverse the children of the node if it's an object (assuming the tree is structured as objects)
//       if (typeof node === "object" && node !== null) {
//         for (const key in node) {
//           if (Object.prototype.hasOwnProperty.call(node, key)) {
//             visitStack.push([node[key], node]); // Push child and current node as its parent
//           }
//         }
//       }
//     }

//     return this; // If no parent is found (which shouldn't happen if the tree is valid)
//   }

//   get current(): Nullable<string> {
//     if (typeof this._current === "string") return this.current;
//     return null;
//   }
// }


// const ff = new Router(DOCUMENT_ID_CONSTANTS).goto(r=>r.VIEW.PATH_FINDING.TOOLTIP_CONTAINER);
