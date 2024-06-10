import { Nullable, NoneToVoidFunction } from "ts-wiz";
import { IAlgorithm } from "../../../types";
import CoordinatedGraph from "../../Graph/Coordinated";

class Dijkstra implements IAlgorithm {
    private graph : CoordinatedGraph;
    iter = async()=>{
        this.graph.addVertex("A" , {x:0 , y:0 , state:"blank"});
    }; 
    performFastForward= null;


    constructor(graph : CoordinatedGraph){
        this.graph = graph
    }


}

export default Dijkstra;