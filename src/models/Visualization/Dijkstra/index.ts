import { IAlgorithm, IVisualization } from "../../../types";
import CoordinatedGraph from "../../Graph/Coordinated";
import Dijkstra from "./Algorithm";
import View from "../../View";
import DijkstraMainView from "./MainView";

class DijkstraVisualization implements IVisualization {
  private CoordinatedGraph = new CoordinatedGraph("undirected");
  algorithm: IAlgorithm = new Dijkstra(this.CoordinatedGraph);
  views: View<unknown>[] = [new DijkstraMainView(this.CoordinatedGraph) , new DijkstraMainView(this.CoordinatedGraph)];
  start= ()=>{
    this.algorithm.iter();
  }
}

export default DijkstraVisualization;